import json
from database import SessionLocal, engine
import models

SPECIES_DATA = [
    {
        "id": "chelonia_mydas",
        "common_name": "Green Sea Turtle",
        "scientific_name": "Chelonia mydas",
        "class_taxonomy": "Reptilia",
        "family": "Cheloniidae",
        "conservation_status": "Endangered",
        "iucn_code": "EN",
        "habitat": "Tropical and subtropical shallow coastal waters, seagrass pastures, and open oceanic migration corridors.",
        "geographic_range": "Circumglobal across Atlantic, Pacific, and Indian Oceans between 30°N and 30°S.",
        "depth_range": "0 - 110 meters",
        "diet": "Herbivorous as adults, feeding on seagrasses and marine macroalgae.",
        "population_trend": "Decreasing",
        "threats": json.dumps([
            "Incidental fisheries bycatch in gillnets, longlines, and trawls",
            "Egg harvesting and illegal coastal poaching",
            "Plastic ingestion causing gut impaction and perforation",
            "Loss of nesting beaches from coastal construction and sea-level rise"
        ]),
        "conservation_actions": json.dumps([
            "Mandatory Turtle Excluder Devices (TEDs) on commercial shrimp trawls",
            "Nesting beach patrols and protected coastal sanctuaries (IUCN Category Ia/II)",
            "CITES Appendix I trade prohibitions",
            "Satellite telemetry monitoring along international migratory routes"
        ]),
        "traceable_sources": json.dumps([
            {"title": "IUCN Red List of Threatened Species: Chelonia mydas", "url": "https://www.iucnredlist.org/species/4615/11037468"},
            {"title": "NOAA Fisheries: Green Turtle (Chelonia mydas)", "url": "https://www.fisheries.noaa.gov/species/green-turtle"},
            {"title": "UN SDG 14 Life Below Water Target 14.2 & 14.4", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.2 Marine Ecosystem Protection & 14.4 Regulating Overharvesting"
    },
    {
        "id": "amphiprion_ocellaris",
        "common_name": "Clown Anemonefish",
        "scientific_name": "Amphiprion ocellaris",
        "class_taxonomy": "Actinopterygii",
        "family": "Pomacentridae",
        "conservation_status": "Least Concern",
        "iucn_code": "LC",
        "habitat": "Shallow sheltered lagoons and coral reef slopes, living in obligate mutualistic symbiosis with sea anemones (Heteractis magnifica, Stichodactyla gigantea).",
        "geographic_range": "Eastern Indian Ocean and Western Pacific, including northern Australia, Southeast Asia, and Japan.",
        "depth_range": "1 - 15 meters",
        "diet": "Planktonic crustaceans, algae, and leftovers from host anemone feeding.",
        "population_trend": "Stable but localized declines due to reef bleaching",
        "threats": json.dumps([
            "Ocean warming leading to coral bleaching and anemone host expulsion",
            "Over-collection for the commercial marine ornamental aquarium trade",
            "Habitat destruction from destructive fishing and sedimentation"
        ]),
        "conservation_actions": json.dumps([
            "Marine Protected Areas (MPAs) with strict no-take zones",
            "Captive aquaculture breeding programs to relieve wild collection pressure",
            "Reef restoration and coral nursery outplanting"
        ]),
        "traceable_sources": json.dumps([
            {"title": "IUCN Red List of Threatened Species: Amphiprion ocellaris", "url": "https://www.iucnredlist.org/species/188354/1860002"},
            {"title": "FishBase: Amphiprion ocellaris Cuvier, 1830", "url": "https://www.fishbase.se/summary/Amphiprion-ocellaris.html"},
            {"title": "UN SDG 14 Life Below Water Target 14.5", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.5 Conserving Coastal and Marine Areas"
    },
    {
        "id": "carcharodon_carcharias",
        "common_name": "Great White Shark",
        "scientific_name": "Carcharodon carcharias",
        "class_taxonomy": "Chondrichthyes",
        "family": "Lamnidae",
        "conservation_status": "Vulnerable",
        "iucn_code": "VU",
        "habitat": "Coastal and offshore epipelagic waters from continental shelves to oceanic islands.",
        "geographic_range": "Cosmopolitan temperate and subtropical oceans worldwide, including South Africa, California, Australia, and Mediterranean.",
        "depth_range": "0 - 1200 meters",
        "diet": "Marine mammals (pinnipeds), large pelagic fish, rays, sea turtles, and carrion.",
        "population_trend": "Decreasing",
        "threats": json.dumps([
            "Targeted trophy fishing and finning",
            "Commercial longline and bather-protection shark nets entanglement",
            "Bioaccumulation of oceanic heavy metals and microplastics",
            "Low reproductive fecundity and late sexual maturity"
        ]),
        "conservation_actions": json.dumps([
            "CITES Appendix II listing restricting international commercial trade",
            "Full national protection in Australia, South Africa, USA, and Mexico",
            "Global satellite acoustic tagging networks for dynamic spatial management"
        ]),
        "traceable_sources": json.dumps([
            {"title": "IUCN Red List: Carcharodon carcharias", "url": "https://www.iucnredlist.org/species/3855/2878674"},
            {"title": "NOAA Fisheries: White Shark Conservation", "url": "https://www.fisheries.noaa.gov/species/white-shark"},
            {"title": "UN SDG 14 Life Below Water Target 14.4", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.4 Ending Overfishing and Restoring Fish Stocks"
    },
    {
        "id": "mobula_birostris",
        "common_name": "Giant Oceanic Manta Ray",
        "scientific_name": "Mobula birostris",
        "class_taxonomy": "Chondrichthyes",
        "family": "Mobulidae",
        "conservation_status": "Endangered",
        "iucn_code": "EN",
        "habitat": "Productive pelagic zones, coastal upwelling areas, offshore seamounts, and reef cleaning stations.",
        "geographic_range": "Circumglobal in tropical, subtropical, and warm-temperate oceans.",
        "depth_range": "0 - 1000 meters",
        "diet": "Filter feeds on zooplankton including krill, copepods, and larval crustaceans.",
        "population_trend": "Decreasing",
        "threats": json.dumps([
            "Targeted gillnet fisheries for gill plates in pseudo-medicinal trade",
            "Bycatch in pelagic tuna purse seines and driftnets",
            "Mooring line and ghost net entanglement",
            "Boat strikes in surface feeding aggregations"
        ]),
        "conservation_actions": json.dumps([
            "CITES Appendix II protection preventing unregulated trade of gill plates",
            "Establishment of large-scale marine sanctuaries (e.g. Raja Ampat, Malpelo)",
            "Community-based sustainable manta ray ecotourism replacing artisanal hunts"
        ]),
        "traceable_sources": json.dumps([
            {"title": "IUCN Red List: Mobula birostris", "url": "https://www.iucnredlist.org/species/198921/68632946"},
            {"title": "Manta Trust Global Research Initiative", "url": "https://www.mantatrust.org/"},
            {"title": "UN SDG 14 Life Below Water Target 14.2 & 14.5", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.2 Marine Habitat Protection"
    },
    {
        "id": "balaenoptera_musculus",
        "common_name": "Blue Whale",
        "scientific_name": "Balaenoptera musculus",
        "class_taxonomy": "Mammalia",
        "family": "Balaenopteridae",
        "conservation_status": "Endangered",
        "iucn_code": "EN",
        "habitat": "Open pelagic oceans, feeding in polar sub-ice waters and calving in low-latitude equatorial waters.",
        "geographic_range": "Global oceans with discrete populations in North Atlantic, North Pacific, and Southern Hemisphere.",
        "depth_range": "0 - 500 meters",
        "diet": "Obligate euphausiid filter-feeder, consuming up to 4 metric tons of Antarctic krill daily.",
        "population_trend": "Increasing slowly from historic whaling depletion",
        "threats": json.dumps([
            "Commercial vessel strikes in heavy shipping lanes",
            "Anthropogenic ocean noise pollution disrupting low-frequency acoustic communication",
            "Climate-driven decline of polar krill biomass",
            "Entanglement in deep-water pot and trap gear"
        ]),
        "conservation_actions": json.dumps([
            "International Whaling Commission (IWC) global commercial whaling moratorium",
            "Vessel speed reduction regulations and rerouting of shipping lanes",
            "Real-time acoustic buoy warning systems for commercial vessels"
        ]),
        "traceable_sources": json.dumps([
            {"title": "IUCN Red List: Balaenoptera musculus", "url": "https://www.iucnredlist.org/species/2477/156923585"},
            {"title": "NOAA Fisheries: Blue Whale Profile", "url": "https://www.fisheries.noaa.gov/species/blue-whale"},
            {"title": "UN SDG 14 Life Below Water Target 14.1 & 14.2", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.1 Marine Noise Pollution & 14.2 Ecosystem Safeguards"
    },
    {
        "id": "pterois_volitans",
        "common_name": "Red Lionfish",
        "scientific_name": "Pterois volitans",
        "class_taxonomy": "Actinopterygii",
        "family": "Scorpaenidae",
        "conservation_status": "Least Concern",
        "iucn_code": "LC",
        "habitat": "Native to Indo-Pacific coral reefs; highly destructive invasive population across western Atlantic, Caribbean, and Mediterranean reefs.",
        "geographic_range": "Indo-Pacific native; widespread invasive range along US East Coast, Gulf of Mexico, Caribbean Sea.",
        "depth_range": "1 - 300 meters",
        "diet": "Voracious carnivore preying on over 70 species of small native reef fish and invertebrates.",
        "population_trend": "Increasing (Invasive threat)",
        "threats": json.dumps([
            "Ecological destabilization: devastating native juvenile reef fish communities by up to 90%",
            "Lack of natural predators in introduced ranges due to venomous spines",
            "Trophic cascade damaging herbivorous fish that graze on coral-smothering algae"
        ]),
        "conservation_actions": json.dumps([
            "Targeted volunteer culling derbies and commercial lionfish culinary markets",
            "Training native predators (e.g., groupers, sharks) to consume culled lionfish",
            "Strict aquarium trade regulation to prevent secondary release vectors"
        ]),
        "traceable_sources": json.dumps([
            {"title": "IUCN Red List: Pterois volitans", "url": "https://www.iucnredlist.org/species/190438/44783061"},
            {"title": "NOAA National Ocean Service: Lionfish Invasive Species", "url": "https://oceanservice.noaa.gov/facts/lionfish.html"},
            {"title": "UN SDG 14 Life Below Water Target 14.2", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.2 Invasive Species Management & Reef Restoration"
    },
    {
        "id": "aurelia_aurita",
        "common_name": "Moon Jellyfish",
        "scientific_name": "Aurelia aurita",
        "class_taxonomy": "Scyphozoa",
        "family": "Ulmaridae",
        "conservation_status": "Not Evaluated",
        "iucn_code": "NE",
        "habitat": "Coastal waters, sheltered bays, estuaries, and open temperate oceans worldwide.",
        "geographic_range": "Global distribution across Atlantic, Pacific, and Indian Oceans.",
        "depth_range": "0 - 40 meters",
        "diet": "Plankton, molluscan larvae, copepods, rotifers, and fish eggs.",
        "population_trend": "Increasing (Bloom events driven by eutrophication)",
        "threats": json.dumps([
            "Ocean eutrophication and hypoxia: while tolerant, massive blooms clog cooling intakes and disrupt fisheries",
            "Preyed upon by endangered sea turtles, moon jellyfish mimic floating plastic bags leading to turtle mortality"
        ]),
        "conservation_actions": json.dumps([
            "Reducing agricultural fertilizer runoff to mitigate eutrophication and hypoxic dead zones",
            "Plastic waste elimination campaigns to reduce mistaken ingestion by turtles",
            "Continuous automated jellyfish bloom monitoring using environmental DNA (eDNA)"
        ]),
        "traceable_sources": json.dumps([
            {"title": "World Register of Marine Species: Aurelia aurita", "url": "https://www.marinespecies.org/aphia.php?p=taxdetails&id=135306"},
            {"title": "Marine Biological Association: Moon Jellyfish Specimen Record", "url": "https://www.mba.ac.uk/"},
            {"title": "UN SDG 14 Life Below Water Target 14.1", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.1 Reducing Marine Pollution & Runoff"
    },
    {
        "id": "tursiops_truncatus",
        "common_name": "Common Bottlenose Dolphin",
        "scientific_name": "Tursiops truncatus",
        "class_taxonomy": "Mammalia",
        "family": "Delphinidae",
        "conservation_status": "Least Concern",
        "iucn_code": "LC",
        "habitat": "Warm temperate to tropical shallow coastal bays, estuaries, lagoons, and offshore deep waters.",
        "geographic_range": "Worldwide except polar waters.",
        "depth_range": "0 - 450 meters",
        "diet": "Teleost fish, squids, and crustaceans using advanced echolocation.",
        "population_trend": "Stable globally, localized coastal populations threatened",
        "threats": json.dumps([
            "Bycatch in gillnets, purse seines, and discarded recreational fishing line",
            "Chemical pollution: PCBs, heavy metals, and persistent organic pollutants bioaccumulating in blubber",
            "Acoustic disturbance from high-speed watercraft and seismic surveys",
            "Habitat degradation in urbanized estuaries"
        ]),
        "conservation_actions": json.dumps([
            "Marine Mammal Protection Act (MMPA) enforcement",
            "Speed limits and exclusion zones in critical calving bays",
            "Acoustic deterrent pingers on commercial fishing nets"
        ]),
        "traceable_sources": json.dumps([
            {"title": "IUCN Red List: Tursiops truncatus", "url": "https://www.iucnredlist.org/species/22563/156932432"},
            {"title": "NOAA Fisheries: Bottlenose Dolphin Overview", "url": "https://www.fisheries.noaa.gov/species/common-bottlenose-dolphin"},
            {"title": "UN SDG 14 Life Below Water Target 14.1 & 14.2", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.1 Chemical Pollutant Reduction & 14.2 Coastal Protection"
    },
    {
        "id": "octopus_vulgaris",
        "common_name": "Common Octopus",
        "scientific_name": "Octopus vulgaris",
        "class_taxonomy": "Cephalopoda",
        "family": "Octopodidae",
        "conservation_status": "Least Concern",
        "iucn_code": "LC",
        "habitat": "Coastal benthic waters, rocky reefs, seagrass beds, and soft sediments from intertidal to shelf edges.",
        "geographic_range": "Tropical, subtropical, and temperate waters worldwide.",
        "depth_range": "0 - 200 meters",
        "diet": "Crabs, lobsters, bivalves, and small fish cracked open with a chitinous beak.",
        "population_trend": "Fluctuating with ocean temperatures and fishing intensity",
        "threats": json.dumps([
            "Overexploitation from industrial pot and trap fisheries",
            "Ocean acidification altering cephalopod mantle calcification and metabolic rates",
            "Habitat loss from bottom bottom trawling"
        ]),
        "conservation_actions": json.dumps([
            "Minimum landing size regulations and seasonal bans during spawning cycles",
            "Eco-friendly trap designs reducing bycatch of juvenile marine life",
            "Benthic habitat protection zones banning destructive bottom dredging"
        ]),
        "traceable_sources": json.dumps([
            {"title": "IUCN Red List: Octopus vulgaris", "url": "https://www.iucnredlist.org/species/162571/919736"},
            {"title": "FAO Species Fact Sheets: Octopus vulgaris", "url": "https://www.fao.org/fishery/species/3571/en"},
            {"title": "UN SDG 14 Life Below Water Target 14.4", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.4 Sustainable Fisheries Management"
    },
    {
        "id": "hippocampus_whitei",
        "common_name": "White's Seahorse",
        "scientific_name": "Hippocampus whitei",
        "class_taxonomy": "Actinopterygii",
        "family": "Syngnathidae",
        "conservation_status": "Endangered",
        "iucn_code": "EN",
        "habitat": "Estuarine shallow waters clinging to seagrasses (Zostera capricorni), soft corals, and artificial swimming nets.",
        "geographic_range": "Endemic to coastal waters of eastern Australia (Sydney Harbour, Port Stephens).",
        "depth_range": "1 - 25 meters",
        "diet": "Small crustaceans such as amphipods, copepods, and mysid shrimp.",
        "population_trend": "Decreasing drastically (over 90% decline in Port Stephens)",
        "threats": json.dumps([
            "Loss of natural seagrass and gorgonian habitats due to coastal development and boat moorings",
            "Severe storm events causing sediment smothering",
            "Bycatch in estuary trawls and illegal harvesting for ornamental curios"
        ]),
        "conservation_actions": json.dumps([
            "Innovative 'Seahorse Hotels' deployment in Sydney Harbour to recreate lost breeding habitats",
            "Targeted conservation captive breeding and release programs by SEA LIFE Sydney Aquarium",
            "State-level endangered species legal protection prohibiting harming or collection"
        ]),
        "traceable_sources": json.dumps([
            {"title": "IUCN Red List: Hippocampus whitei", "url": "https://www.iucnredlist.org/species/10088/166530182"},
            {"title": "NSW Department of Primary Industries: White's Seahorse Profile", "url": "https://www.dpi.nsw.gov.au/fishing/threatened-species/what-current/endangered-species/whites-seahorse"},
            {"title": "UN SDG 14 Life Below Water Target 14.2 & 14.5", "url": "https://sdgs.un.org/goals/goal14"}
        ]),
        "image_url": "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=1200&q=80",
        "sdg_alignment": "SDG 14.2 Marine Habitat Restoration & Artificial Reef Deployment"
    }
]

INITIAL_OBSERVATIONS = [
    {
        "species_id": "chelonia_mydas",
        "species_name": "Green Sea Turtle",
        "confidence": 0.962,
        "date_observed": "2026-10-10",
        "location_name": "Ningaloo Reef, Western Australia",
        "latitude": -21.8950,
        "longitude": 114.1350,
        "notes": "Sub-adult green sea turtle grazing quietly on shallow seagrass pasture. No signs of fibropapillomatosis tumors or boat strike injuries.",
        "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Marine Ranger Sarah Lin",
        "consent_given": True
    },
    {
        "species_id": "mobula_birostris",
        "species_name": "Giant Oceanic Manta Ray",
        "confidence": 0.938,
        "date_observed": "2026-10-08",
        "location_name": "Raja Ampat Marine Park, Indonesia",
        "latitude": -0.2333,
        "longitude": 130.5167,
        "notes": "Observed at Manta Sandy cleaning station. Wingspan approx 4.5m with distinctive ventral belly spot markings.",
        "image_url": "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Divemaster K. Dharma",
        "consent_given": True
    },
    {
        "species_id": "amphiprion_ocellaris",
        "species_name": "Clown Anemonefish",
        "confidence": 0.985,
        "date_observed": "2026-10-05",
        "location_name": "Great Barrier Reef, Cairns Sector, Australia",
        "latitude": -16.9203,
        "longitude": 145.7710,
        "notes": "Mated pair tending to egg clutch beside magnificent sea anemone. Host anemone shows healthy zooxanthellae coloration without bleaching.",
        "image_url": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Reef Watch Volunteer David C.",
        "consent_given": True
    },
    {
        "species_id": "hippocampus_whitei",
        "species_name": "White's Seahorse",
        "confidence": 0.914,
        "date_observed": "2026-10-02",
        "location_name": "Clifton Gardens, Sydney Harbour, Australia",
        "latitude": -33.8433,
        "longitude": 151.2464,
        "notes": "Male seahorse with full pouch anchored to artificial Seahorse Hotel cage. Excellent recovery indicator.",
        "image_url": "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Dr. Eleanor Vance, Marine Biologist",
        "consent_given": True
    },
    {
        "species_id": "balaenoptera_musculus",
        "species_name": "Blue Whale",
        "confidence": 0.978,
        "date_observed": "2026-10-09",
        "location_name": "Monterey Bay Canyon, California, USA",
        "latitude": 36.7800,
        "longitude": -121.9000,
        "notes": "Large mature adult surfacing along submarine canyon edge, feeding on krill swarms during seasonal coastal upwelling.",
        "image_url": "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=600&q=80",
        "observer_name": "NOAA Marine Mammal Observer C. Ramos",
        "consent_given": True
    },
    {
        "species_id": "carcharodon_carcharias",
        "species_name": "Great White Shark",
        "confidence": 0.954,
        "date_observed": "2026-10-07",
        "location_name": "Guadalupe Island Marine Reserve, Mexico",
        "latitude": 29.0333,
        "longitude": -118.2833,
        "notes": "Sub-adult female estimated at 4.2m cruising along pinniped rookery. Acoustic telemetry tag logged cleanly.",
        "image_url": "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Pelagic Shark Research Foundation",
        "consent_given": True
    },
    {
        "species_id": "tursiops_truncatus",
        "species_name": "Common Bottlenose Dolphin",
        "confidence": 0.941,
        "date_observed": "2026-10-06",
        "location_name": "Florida Keys National Marine Sanctuary, USA",
        "latitude": 24.7136,
        "longitude": -81.0850,
        "notes": "Pod of 8 individuals engaging in cooperative mud-ring feeding behavior in shallow lagoon waters.",
        "image_url": "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Dolphin Research Center Field Station",
        "consent_given": True
    },
    {
        "species_id": "pterois_volitans",
        "species_name": "Red Lionfish",
        "confidence": 0.966,
        "date_observed": "2026-10-04",
        "location_name": "Mesoamerican Barrier Reef, Belize",
        "latitude": 17.1899,
        "longitude": -87.8920,
        "notes": "Invasive specimen sighted hovering around spur-and-groove reef formation at 18m. Flagged for targeted volunteer culling derby.",
        "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Reef Conservation Initiative Divers",
        "consent_given": True
    },
    {
        "species_id": "octopus_vulgaris",
        "species_name": "Common Octopus",
        "confidence": 0.925,
        "date_observed": "2026-10-03",
        "location_name": "Cabrera National Marine Park, Balearic Islands",
        "latitude": 39.1450,
        "longitude": 2.9460,
        "notes": "Specimen camouflaged against limestone reef crevice guarding an entrance midden of empty bivalve shells.",
        "image_url": "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Balearic Marine Protected Area Ranger",
        "consent_given": True
    },
    {
        "species_id": "chelonia_mydas",
        "species_name": "Green Sea Turtle",
        "confidence": 0.947,
        "date_observed": "2026-09-29",
        "location_name": "Galápagos Marine Reserve, Isabela Island",
        "latitude": -0.9538,
        "longitude": -90.9656,
        "notes": "Adult female navigating coastal mangrove nursery channels. Monitored under Darwin Foundation satellite telemetry program.",
        "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Charles Darwin Foundation Biologist",
        "consent_given": True
    },
    {
        "species_id": "mobula_birostris",
        "species_name": "Giant Oceanic Manta Ray",
        "confidence": 0.982,
        "date_observed": "2026-09-25",
        "location_name": "Hanifaru Bay, Baa Atoll Biosphere Reserve, Maldives",
        "latitude": 5.1722,
        "longitude": 73.1492,
        "notes": "Mass cyclone-feeding aggregation observed during southwest monsoon plankton accumulation event.",
        "image_url": "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=600&q=80",
        "observer_name": "Maldivian Manta Trust Survey Team",
        "consent_given": True
    }
]

INITIAL_THREATS = [
    {
        "threat_type": "Ghost Gear / Entanglement",
        "description": "Discarded monofilament gillnet tangled around outer reef crest at 12m depth. Poses severe snag hazard to foraging sea turtles and sharks.",
        "severity": "High",
        "location_name": "Osprey Reef, Coral Sea",
        "latitude": -13.8833,
        "longitude": 146.6333,
        "image_url": "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80",
        "status": "Unverified",
        "reporter_contact": "dive_clean_oceans@marine.org"
    },
    {
        "threat_type": "Plastic Pollution",
        "description": "Massive slick of macro-plastics, polystyrene foam, and broken beverage containers accumulated along tide line after offshore storm.",
        "severity": "Critical",
        "location_name": "Henderson Coastline, South Pacific",
        "latitude": -24.3667,
        "longitude": -128.3167,
        "image_url": "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
        "status": "Unverified",
        "reporter_contact": "ocean_scout_pacific@conservation.net"
    },
    {
        "threat_type": "Injured Marine Animal",
        "description": "Sub-adult bottlenose dolphin sighted with trailing monofilament line and hooks wrapped around dorsal fin. Swimming sluggishly near harbour entrance.",
        "severity": "Critical",
        "location_name": "Moreton Bay, Queensland",
        "latitude": -27.2500,
        "longitude": 153.2500,
        "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
        "status": "Unverified",
        "reporter_contact": "bay_wildlife_rescue@qld.gov.au"
    },
    {
        "threat_type": "Coral Bleaching Event",
        "description": "Severe thermal stress event with >55% of shallow Acropora colonies bleached white after anomalous 1.8°C sea surface temperature spike.",
        "severity": "Critical",
        "location_name": "Lizard Island, Northern Great Barrier Reef",
        "latitude": -14.6680,
        "longitude": 145.4600,
        "image_url": "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&q=80",
        "status": "Unverified",
        "reporter_contact": "coral_alert_australia@reefresearch.edu.au"
    },
    {
        "threat_type": "Illegal Longline Gear",
        "description": "Unmarked industrial drifting longline buoy array detected encroaching within the northern MPA boundary line, threatening pelagic sharks.",
        "severity": "High",
        "location_name": "Galápagos Marine Reserve Northern Perimeter",
        "latitude": 1.4000,
        "longitude": -91.8000,
        "image_url": "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80",
        "status": "Unverified",
        "reporter_contact": "galapagos_ranger_corps@parquegalapagos.gob.ec"
    },
    {
        "threat_type": "Chemical & Oil Slick",
        "description": "Dense iridescent oil sheen spreading across 3.5 nautical miles of coastal mangrove estuary following unauthorized tanker bilge discharge.",
        "severity": "High",
        "location_name": "Straits of Malacca Marine Passage",
        "latitude": 3.1500,
        "longitude": 100.5000,
        "image_url": "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
        "status": "Unverified",
        "reporter_contact": "maritime_enforcement@oceanprotection.org"
    },
    {
        "threat_type": "Microplastic Gyre Slick",
        "description": "Extreme concentration of pelagic plastic debris and microplastic resin pellets in ocean convergence zone, threatening planktivorous baleen whales.",
        "severity": "Medium",
        "location_name": "North Pacific Convergence Zone",
        "latitude": 32.5000,
        "longitude": -145.2000,
        "image_url": "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
        "status": "Unverified",
        "reporter_contact": "ocean_cleanup_survey@northpacific.org"
    }
]

def seed_database():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.Species).count() == 0:
            for s_data in SPECIES_DATA:
                species = models.Species(**s_data)
                db.add(species)
            db.commit()
            print(f"[Seed] Successfully populated {len(SPECIES_DATA)} marine species.")

        if db.query(models.Observation).count() == 0:
            for obs_data in INITIAL_OBSERVATIONS:
                obs = models.Observation(**obs_data)
                db.add(obs)
            db.commit()
            print(f"[Seed] Successfully populated initial observations.")

        if db.query(models.ThreatReport).count() == 0:
            for t_data in INITIAL_THREATS:
                threat = models.ThreatReport(**t_data)
                db.add(threat)
            db.commit()
            print(f"[Seed] Successfully populated initial threat reports.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
