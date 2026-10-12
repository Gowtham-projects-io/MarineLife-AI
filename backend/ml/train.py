import os
import json
import time
import datetime
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from torchvision.models import mobilenet_v3_small, MobileNet_V3_Small_Weights
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
TRAIN_DIR = os.path.join(DATA_DIR, "train")
TEST_DIR = os.path.join(DATA_DIR, "test")
WEIGHTS_DIR = os.path.join(BASE_DIR, "weights")
MODEL_SAVE_PATH = os.path.join(WEIGHTS_DIR, "marinelife_mobilenetv3.pt")
CLASSES_SAVE_PATH = os.path.join(WEIGHTS_DIR, "classes.json")
METRICS_SAVE_PATH = os.path.join(WEIGHTS_DIR, "metrics.json")


def train_and_evaluate(epochs=10, batch_size=16, lr=1e-3):
    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[ML Training] Using device: {device}")

    # Image transformations
    train_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=10),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    test_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    train_dataset = datasets.ImageFolder(TRAIN_DIR, transform=train_transforms)
    test_dataset = datasets.ImageFolder(TEST_DIR, transform=test_transforms)

    class_names = train_dataset.classes
    num_classes = len(class_names)
    print(f"[ML Training] Found {len(train_dataset)} training samples, {len(test_dataset)} test samples across {num_classes} classes.")
    print(f"[ML Training] Classes: {class_names}")

    with open(CLASSES_SAVE_PATH, "w") as f:
        json.dump(class_names, f, indent=2)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    # Initialize MobileNetV3-Small with pretrained ImageNet weights
    model = mobilenet_v3_small(weights=MobileNet_V3_Small_Weights.DEFAULT)
    
    # Fine-tune the classifier layer
    in_features = model.classifier[0].in_features  # 576
    model.classifier[3] = nn.Linear(1024, num_classes)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    start_time = time.time()
    print("[ML Training] Starting model fine-tuning...")

    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

        scheduler.step()
        epoch_loss = running_loss / total
        epoch_acc = (correct / total) * 100
        print(f"  Epoch [{epoch}/{epochs}] - Loss: {epoch_loss:.4f} - Train Acc: {epoch_acc:.2f}%")

    total_training_time = time.time() - start_time
    print(f"[ML Training] Completed training in {total_training_time:.2f} seconds.")

    # Save trained weights
    torch.save(model.state_dict(), MODEL_SAVE_PATH)
    print(f"[ML Training] Saved fine-tuned model weights to {MODEL_SAVE_PATH}")

    # Rigorous Evaluation on Held-Out Test Set
    print("[ML Evaluation] Evaluating on held-out test split...")
    model.eval()
    test_loss = 0.0
    all_preds = []
    all_targets = []
    all_probs = []

    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            test_loss += loss.item() * images.size(0)

            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(labels.cpu().numpy())
            all_probs.extend(probs.cpu().numpy())

    total_test = len(all_targets)
    test_loss_avg = test_loss / total_test
    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)
    all_probs = np.array(all_probs)

    # Top-3 Accuracy
    top3_correct = 0
    for i in range(total_test):
        top3_indices = np.argsort(all_probs[i])[-3:]
        if all_targets[i] in top3_indices:
            top3_correct += 1
    top3_accuracy = float(top3_correct / total_test)

    # Metrics computation using scikit-learn
    acc = float(accuracy_score(all_targets, all_preds))
    prec_macro = float(precision_score(all_targets, all_preds, average='macro', zero_division=0))
    rec_macro = float(recall_score(all_targets, all_preds, average='macro', zero_division=0))
    f1_macro = float(f1_score(all_targets, all_preds, average='macro', zero_division=0))
    conf_matrix = confusion_matrix(all_targets, all_preds).tolist()

    # Per-class metrics
    class_metrics = {}
    for idx, c_name in enumerate(class_names):
        c_targets = (all_targets == idx).astype(int)
        c_preds = (all_preds == idx).astype(int)
        class_metrics[c_name] = {
            "precision": float(precision_score(c_targets, c_preds, zero_division=0)),
            "recall": float(recall_score(c_targets, c_preds, zero_division=0)),
            "f1_score": float(f1_score(c_targets, c_preds, zero_division=0)),
            "test_support": int(np.sum(c_targets))
        }

    metrics_payload = {
        "model_name": "MarineLife-MobileNetV3",
        "architecture": "MobileNetV3-Small (Transfer Learning + Fine-Tuned Head)",
        "dataset_name": "MarineLife-AI SDG 14 Benchmark Dataset (Curated Verified Marine Specimens)",
        "num_classes": num_classes,
        "classes": class_names,
        "accuracy": round(acc, 4),
        "precision_macro": round(prec_macro, 4),
        "recall_macro": round(rec_macro, 4),
        "f1_macro": round(f1_macro, 4),
        "top3_accuracy": round(top3_accuracy, 4),
        "total_test_samples": total_test,
        "test_loss": round(test_loss_avg, 4),
        "evaluation_date": datetime.datetime.utcnow().isoformat(),
        "is_real_trained_model": True,
        "training_time_seconds": round(total_training_time, 2),
        "confusion_matrix": conf_matrix,
        "class_metrics": class_metrics
    }

    with open(METRICS_SAVE_PATH, "w") as f:
        json.dump(metrics_payload, f, indent=2)

    print("\n================ FINAL EVALUATION METRICS ================")
    print(f"  Overall Accuracy:      {acc * 100:.2f}%")
    print(f"  Top-3 Accuracy:        {top3_accuracy * 100:.2f}%")
    print(f"  Precision (Macro):     {prec_macro:.4f}")
    print(f"  Recall (Macro):        {rec_macro:.4f}")
    print(f"  Macro F1-Score:        {f1_macro:.4f}")
    print(f"  Total Held-out Test:   {total_test} samples")
    print(f"Metrics saved to {METRICS_SAVE_PATH}")
    print("==========================================================\n")
    return metrics_payload


if __name__ == "__main__":
    train_and_evaluate(epochs=8)
