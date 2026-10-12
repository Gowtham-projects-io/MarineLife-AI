import {
  MOCK_SPECIES,
  MOCK_OBSERVATIONS,
  MOCK_THREATS,
  MOCK_METRICS,
  getMockStats,
  simulatePrediction
} from './mockData';

// Setup local storage keys
const OBS_STORAGE_KEY = 'marinelife_observations';
const THREATS_STORAGE_KEY = 'marinelife_threats';

function getStoredObservations() {
  try {
    const raw = localStorage.getItem(OBS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return [...MOCK_OBSERVATIONS];
}

function saveStoredObservation(newObs) {
  const current = getStoredObservations();
  const item = {
    id: Date.now(),
    created_at: new Date().toISOString(),
    ...newObs
  };
  current.unshift(item);
  try {
    localStorage.setItem(OBS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {}
  return item;
}

function getStoredThreats() {
  try {
    const raw = localStorage.getItem(THREATS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...MOCK_THREATS];
}

function saveStoredThreat(newThreat) {
  const current = getStoredThreats();
  const item = {
    id: Date.now(),
    status: 'Unverified',
    created_at: new Date().toISOString(),
    ...newThreat
  };
  current.unshift(item);
  try {
    localStorage.setItem(THREATS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {}
  return item;
}

export function installApiInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async function (input, init = {}) {
    const urlStr = typeof input === 'string' ? input : input instanceof Request ? input.url : '';
    const isApi = urlStr.includes('/api/');

    if (!isApi) {
      return originalFetch.apply(this, arguments);
    }

    // Try live server first (works when running backend locally)
    try {
      const response = await originalFetch.apply(this, arguments);
      // If server returned ok, or valid json, return it
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        return response;
      }
      // If 404 or HTML returned (standard for Vite static fallback on GH Pages), fallback to mock
      if (response.status === 404 || contentType.includes('text/html')) {
        return handleMockRoute(urlStr, init);
      }
      return response;
    } catch (err) {
      // Live server unreachable (GitHub Pages environment)
      return handleMockRoute(urlStr, init);
    }
  };
}

async function handleMockRoute(urlStr, init = {}) {
  const method = (init.method || 'GET').toUpperCase();
  const urlObj = new URL(urlStr, window.location.origin);
  const path = urlObj.pathname;

  // Small latency simulation for realism
  await new Promise((r) => setTimeout(r, 120));

  // 1. Species Catalog
  if (path.includes('/api/species')) {
    const parts = path.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];

    if (lastPart !== 'species' && lastPart !== 'api') {
      const found = MOCK_SPECIES.find((s) => s.id === lastPart);
      if (found) return createJsonResponse(found, 200);
      return createJsonResponse({ detail: 'Species not found' }, 404);
    }

    const iucnStatus = urlObj.searchParams.get('iucn_status');
    let list = [...MOCK_SPECIES];
    if (iucnStatus && iucnStatus !== 'ALL') {
      list = list.filter((s) => s.iucn_code.toUpperCase() === iucnStatus.toUpperCase());
    }
    return createJsonResponse(list, 200);
  }

  // 2. Observations
  if (path.includes('/api/observations')) {
    if (method === 'POST') {
      let bodyData = {};
      try {
        bodyData = typeof init.body === 'string' ? JSON.parse(init.body) : {};
      } catch (e) {}
      const saved = saveStoredObservation(bodyData);
      return createJsonResponse(saved, 201);
    }
    const obs = getStoredObservations();
    return createJsonResponse(obs, 200);
  }

  // 3. Threats
  if (path.includes('/api/threats') || path.includes('/api/threat-reports')) {
    if (method === 'POST') {
      let bodyData = {};
      try {
        if (init.body instanceof FormData) {
          init.body.forEach((val, key) => { bodyData[key] = val; });
        } else if (typeof init.body === 'string') {
          bodyData = JSON.parse(init.body);
        }
      } catch (e) {}
      const saved = saveStoredThreat(bodyData);
      return createJsonResponse(saved, 201);
    }
    const threats = getStoredThreats();
    return createJsonResponse(threats, 200);
  }

  // 4. Statistics Dashboard
  if (path.includes('/api/stats')) {
    const stats = getMockStats(getStoredObservations(), getStoredThreats());
    return createJsonResponse(stats, 200);
  }

  // 5. ML Metrics
  if (path.includes('/api/metrics')) {
    return createJsonResponse(MOCK_METRICS, 200);
  }

  // 6. Predict Inference
  if (path.includes('/api/predict')) {
    let fileName = '';
    if (init.body instanceof FormData) {
      const file = init.body.get('file');
      if (file && file.name) fileName = file.name;
    }
    const result = simulatePrediction(fileName);
    return createJsonResponse(result, 200);
  }

  // Fallback
  return createJsonResponse({ message: 'OK' }, 200);
}

function createJsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
