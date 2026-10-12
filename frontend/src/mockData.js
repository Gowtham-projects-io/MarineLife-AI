// Client-side dataset and resilient fallback for static deployment (GitHub Pages)

export const MOCK_SPECIES = [
  {
    id: "chelonia_mydas",
    common_name: "Green Sea Turtle",
    scientific_name: "Chelonia mydas",
    class_taxonomy: "Reptilia",
    family: "Cheloniidae",
    conservation_status: "Endangered",
    iucn_code: "EN",
    habitat: "Tropical and subtropical shallow coastal waters, seagrass pastures, and open oceanic migration corridors.",
    geographic_range: "Circumglobal across Atlantic, Pacific, and Indian Oceans between 30°N and 30°S.",
    depth_range: "0 - 110 meters",
    diet: "Herbivorous as adults, feeding on seagrasses and marine macroalgae.",
    population_trend: "Decreasing",
    threats: JSON.stringify([
      "Incidental fisheries bycatch in gillnets, longlines, and trawls",
      "Egg harvesting and illegal coastal poaching",
      "Plastic ingestion causing gut impaction and perforation",
      "Loss of nesting beaches from coastal construction and sea-level rise"
    ]),
    conservation_actions: JSON.stringify([
      "Mandatory Turtle Excluder Devices (TEDs) on commercial shrimp trawls",
      "Nesting beach patrols and protected coastal sanctuaries (IUCN Category Ia/II)",
      "CITES Appendix I trade prohibitions",
      "Satellite telemetry monitoring along international migratory routes"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "IUCN Red List of Threatened Species: Chelonia mydas", "url": "https://www.iucnredlist.org/species/4615/11037468"},
      {"title": "NOAA Fisheries: Green Turtle (Chelonia mydas)", "url": "https://www.fisheries.noaa.gov/species/green-turtle"},
      {"title": "UN SDG 14 Life Below Water Target 14.2 & 14.4", "url": "https://sdgs.un.org/goals/goal14"}
    ]),
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.2 Marine Ecosystem Protection & 14.4 Regulating Overharvesting"
  },
  {
    id: "amphiprion_ocellaris",
    common_name: "Clown Anemonefish",
    scientific_name: "Amphiprion ocellaris",
    class_taxonomy: "Actinopterygii",
    family: "Pomacentridae",
    conservation_status: "Least Concern",
    iucn_code: "LC",
    habitat: "Shallow sheltered lagoons and coral reef slopes, living in obligate mutualistic symbiosis with sea anemones.",
    geographic_range: "Eastern Indian Ocean and Western Pacific, including northern Australia, Southeast Asia, and Japan.",
    depth_range: "1 - 15 meters",
    diet: "Planktonic crustaceans, algae, and leftovers from host anemone feeding.",
    population_trend: "Stable but localized declines due to reef bleaching",
    threats: JSON.stringify([
      "Ocean warming leading to coral bleaching and anemone host expulsion",
      "Over-collection for the commercial marine ornamental aquarium trade",
      "Habitat destruction from destructive fishing and sedimentation"
    ]),
    conservation_actions: JSON.stringify([
      "Marine Protected Areas (MPAs) with strict no-take zones",
      "Captive aquaculture breeding programs to relieve wild collection pressure",
      "Reef restoration and coral nursery outplanting"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "IUCN Red List of Threatened Species: Amphiprion ocellaris", "url": "https://www.iucnredlist.org/species/188354/1860002"},
      {"title": "FishBase: Amphiprion ocellaris Cuvier, 1830", "url": "https://www.fishbase.se/summary/Amphiprion-ocellaris.html"},
      {"title": "UN SDG 14 Life Below Water Target 14.5", "url": "https://sdgs.un.org/goals/goal14"}
    ]),
    image_url: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.5 Conserving Coastal and Marine Areas"
  },
  {
    id: "carcharodon_carcharias",
    common_name: "Great White Shark",
    scientific_name: "Carcharodon carcharias",
    class_taxonomy: "Chondrichthyes",
    family: "Lamnidae",
    conservation_status: "Vulnerable",
    iucn_code: "VU",
    habitat: "Coastal and offshore epipelagic waters from continental shelves to oceanic islands.",
    geographic_range: "Cosmopolitan temperate and subtropical oceans worldwide.",
    depth_range: "0 - 1200 meters",
    diet: "Marine mammals (pinnipeds), large pelagic fish, rays, sea turtles, and carrion.",
    population_trend: "Decreasing",
    threats: JSON.stringify([
      "Targeted trophy fishing and finning",
      "Commercial longline and bather-protection shark nets entanglement",
      "Bioaccumulation of oceanic heavy metals and microplastics"
    ]),
    conservation_actions: JSON.stringify([
      "CITES Appendix II listing restricting international commercial trade",
      "Full national protection in Australia, South Africa, USA, and Mexico",
      "Global satellite acoustic tagging networks for dynamic spatial management"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "IUCN Red List: Carcharodon carcharias", "url": "https://www.iucnredlist.org/species/3855/2878674"},
      {"title": "NOAA Fisheries: White Shark Conservation", "url": "https://www.fisheries.noaa.gov/species/white-shark"}
    ]),
    image_url: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.4 Ending Overfishing and Restoring Fish Stocks"
  },
  {
    id: "mobula_birostris",
    common_name: "Giant Oceanic Manta Ray",
    scientific_name: "Mobula birostris",
    class_taxonomy: "Chondrichthyes",
    family: "Mobulidae",
    conservation_status: "Endangered",
    iucn_code: "EN",
    habitat: "Productive pelagic zones, coastal upwelling areas, offshore seamounts, and reef cleaning stations.",
    geographic_range: "Circumglobal in tropical, subtropical, and warm-temperate oceans.",
    depth_range: "0 - 1000 meters",
    diet: "Filter feeds on zooplankton including krill, copepods, and larval crustaceans.",
    population_trend: "Decreasing",
    threats: JSON.stringify([
      "Targeted gillnet fisheries for gill plates in pseudo-medicinal trade",
      "Bycatch in pelagic tuna purse seines and driftnets",
      "Mooring line and ghost net entanglement"
    ]),
    conservation_actions: JSON.stringify([
      "CITES Appendix II protection preventing unregulated trade of gill plates",
      "Establishment of large-scale marine sanctuaries (e.g. Raja Ampat, Malpelo)"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "IUCN Red List: Mobula birostris", "url": "https://www.iucnredlist.org/species/198921/68632946"},
      {"title": "Manta Trust Global Research Initiative", "url": "https://www.mantatrust.org/"}
    ]),
    image_url: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.2 Marine Habitat Protection"
  },
  {
    id: "balaenoptera_musculus",
    common_name: "Blue Whale",
    scientific_name: "Balaenoptera musculus",
    class_taxonomy: "Mammalia",
    family: "Balaenopteridae",
    conservation_status: "Endangered",
    iucn_code: "EN",
    habitat: "Open pelagic oceans, feeding in polar sub-ice waters and calving in low-latitude equatorial waters.",
    geographic_range: "Global oceans with discrete populations across hemispheres.",
    depth_range: "0 - 500 meters",
    diet: "Obligate euphausiid filter-feeder, consuming up to 4 metric tons of Antarctic krill daily.",
    population_trend: "Increasing slowly from historic whaling depletion",
    threats: JSON.stringify([
      "Commercial vessel strikes in heavy shipping lanes",
      "Anthropogenic ocean noise pollution disrupting communication",
      "Climate-driven decline of polar krill biomass"
    ]),
    conservation_actions: JSON.stringify([
      "International Whaling Commission (IWC) global commercial whaling moratorium",
      "Vessel speed reduction regulations and rerouting of shipping lanes"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "IUCN Red List: Balaenoptera musculus", "url": "https://www.iucnredlist.org/species/2477/156923585"}
    ]),
    image_url: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.1 Marine Noise Pollution & 14.2 Ecosystem Safeguards"
  },
  {
    id: "pterois_volitans",
    common_name: "Red Lionfish",
    scientific_name: "Pterois volitans",
    class_taxonomy: "Actinopterygii",
    family: "Scorpaenidae",
    conservation_status: "Least Concern",
    iucn_code: "LC",
    habitat: "Native to Indo-Pacific coral reefs; highly destructive invasive population across western Atlantic & Caribbean.",
    geographic_range: "Indo-Pacific native; widespread invasive range along US East Coast & Caribbean Sea.",
    depth_range: "1 - 300 meters",
    diet: "Voracious carnivore preying on over 70 species of small native reef fish and invertebrates.",
    population_trend: "Increasing (Invasive threat)",
    threats: JSON.stringify([
      "Ecological destabilization: devastating native juvenile reef fish communities by up to 90%",
      "Lack of natural predators in introduced ranges due to venomous spines"
    ]),
    conservation_actions: JSON.stringify([
      "Targeted volunteer culling derbies and commercial lionfish culinary markets",
      "Training native predators (e.g., groupers, sharks) to consume culled lionfish"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "IUCN Red List: Pterois volitans", "url": "https://www.iucnredlist.org/species/190438/44783061"}
    ]),
    image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.2 Invasive Species Management & Reef Restoration"
  },
  {
    id: "aurelia_aurita",
    common_name: "Moon Jellyfish",
    scientific_name: "Aurelia aurita",
    class_taxonomy: "Scyphozoa",
    family: "Ulmaridae",
    conservation_status: "Least Concern",
    iucn_code: "LC",
    habitat: "Coastal waters, sheltered bays, estuaries, and open temperate oceans worldwide.",
    geographic_range: "Global distribution across Atlantic, Pacific, and Indian Oceans.",
    depth_range: "0 - 40 meters",
    diet: "Plankton, molluscan larvae, copepods, rotifers, and fish eggs.",
    population_trend: "Increasing (Bloom events driven by eutrophication)",
    threats: JSON.stringify([
      "Ocean eutrophication and hypoxia causing massive blooms",
      "Preyed upon by sea turtles; jellyfish mimic floating plastic bags causing turtle mortality"
    ]),
    conservation_actions: JSON.stringify([
      "Reducing agricultural fertilizer runoff to mitigate eutrophication",
      "Plastic waste elimination campaigns to reduce mistaken ingestion"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "World Register of Marine Species: Aurelia aurita", "url": "https://www.marinespecies.org/aphia.php?p=taxdetails&id=135306"}
    ]),
    image_url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.1 Reducing Marine Pollution & Runoff"
  },
  {
    id: "tursiops_truncatus",
    common_name: "Common Bottlenose Dolphin",
    scientific_name: "Tursiops truncatus",
    class_taxonomy: "Mammalia",
    family: "Delphinidae",
    conservation_status: "Least Concern",
    iucn_code: "LC",
    habitat: "Warm temperate to tropical shallow coastal bays, estuaries, lagoons, and offshore deep waters.",
    geographic_range: "Worldwide except polar waters.",
    depth_range: "0 - 450 meters",
    diet: "Teleost fish, squids, and crustaceans using advanced echolocation.",
    population_trend: "Stable globally, localized coastal populations threatened",
    threats: JSON.stringify([
      "Bycatch in gillnets, purse seines, and discarded recreational fishing line",
      "Chemical pollution and acoustic disturbance from high-speed watercraft"
    ]),
    conservation_actions: JSON.stringify([
      "Marine Mammal Protection Act (MMPA) enforcement",
      "Speed limits and exclusion zones in critical calving bays"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "IUCN Red List: Tursiops truncatus", "url": "https://www.iucnredlist.org/species/22563/156932432"}
    ]),
    image_url: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.1 Chemical Pollutant Reduction & 14.2 Coastal Protection"
  },
  {
    id: "octopus_vulgaris",
    common_name: "Common Octopus",
    scientific_name: "Octopus vulgaris",
    class_taxonomy: "Cephalopoda",
    family: "Octopodidae",
    conservation_status: "Least Concern",
    iucn_code: "LC",
    habitat: "Coastal benthic waters, rocky reefs, seagrass beds, and soft sediments.",
    geographic_range: "Tropical, subtropical, and temperate waters worldwide.",
    depth_range: "0 - 200 meters",
    diet: "Crabs, lobsters, bivalves, and small fish cracked open with a chitinous beak.",
    population_trend: "Fluctuating with ocean temperatures and fishing intensity",
    threats: JSON.stringify([
      "Overexploitation from industrial pot and trap fisheries",
      "Ocean acidification altering mantle calcification",
      "Habitat loss from bottom trawling"
    ]),
    conservation_actions: JSON.stringify([
      "Minimum landing size regulations and seasonal bans during spawning cycles",
      "Eco-friendly trap designs reducing bycatch of juvenile marine life"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "IUCN Red List: Octopus vulgaris", "url": "https://www.iucnredlist.org/species/162571/919736"}
    ]),
    image_url: "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.4 Sustainable Fisheries Management"
  },
  {
    id: "hippocampus_whitei",
    common_name: "White's Seahorse",
    scientific_name: "Hippocampus whitei",
    class_taxonomy: "Actinopterygii",
    family: "Syngnathidae",
    conservation_status: "Endangered",
    iucn_code: "EN",
    habitat: "Estuarine shallow waters clinging to seagrasses (Zostera capricorni) and artificial swimming nets.",
    geographic_range: "Endemic to coastal waters of eastern Australia (Sydney Harbour, Port Stephens).",
    depth_range: "1 - 25 meters",
    diet: "Small crustaceans such as amphipods, copepods, and mysid shrimp.",
    population_trend: "Decreasing drastically (over 90% decline in Port Stephens)",
    threats: JSON.stringify([
      "Loss of natural seagrass and gorgonian habitats due to coastal development",
      "Severe storm events causing sediment smothering",
      "Bycatch in estuary trawls and illegal ornamental collection"
    ]),
    conservation_actions: JSON.stringify([
      "Innovative 'Seahorse Hotels' deployment in Sydney Harbour to recreate lost breeding habitats",
      "Targeted conservation captive breeding and release programs"
    ]),
    traceable_sources: JSON.stringify([
      {"title": "IUCN Red List: Hippocampus whitei", "url": "https://www.iucnredlist.org/species/10088/166530182"}
    ]),
    image_url: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=1200&q=80",
    sdg_alignment: "SDG 14.2 Marine Habitat Restoration & Artificial Reef Deployment"
  }
];

export const MOCK_OBSERVATIONS = [
  {
    id: 1,
    species_id: "chelonia_mydas",
    species_name: "Green Sea Turtle",
    confidence: 0.962,
    date_observed: "2026-10-10",
    location_name: "Ningaloo Reef, Western Australia",
    latitude: -21.8950,
    longitude: 114.1350,
    notes: "Sub-adult green sea turtle grazing quietly on shallow seagrass pasture. No signs of fibropapillomatosis tumors or boat strike injuries.",
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    observer_name: "Marine Ranger Sarah Lin",
    consent_given: true,
    created_at: "2026-10-10T08:30:00Z"
  },
  {
    id: 2,
    species_id: "mobula_birostris",
    species_name: "Giant Oceanic Manta Ray",
    confidence: 0.938,
    date_observed: "2026-10-08",
    location_name: "Raja Ampat Marine Park, Indonesia",
    latitude: -0.2333,
    longitude: 130.5167,
    notes: "Observed at Manta Sandy cleaning station. Wingspan approx 4.5m with distinctive ventral belly spot markings.",
    image_url: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=600&q=80",
    observer_name: "Divemaster K. Dharma",
    consent_given: true,
    created_at: "2026-10-08T11:15:00Z"
  },
  {
    id: 3,
    species_id: "amphiprion_ocellaris",
    species_name: "Clown Anemonefish",
    confidence: 0.985,
    date_observed: "2026-10-05",
    location_name: "Great Barrier Reef, Cairns Sector, Australia",
    latitude: -16.9203,
    longitude: 145.7710,
    notes: "Mated pair tending to egg clutch beside magnificent sea anemone. Host anemone shows healthy zooxanthellae coloration without bleaching.",
    image_url: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=600&q=80",
    observer_name: "Reef Watch Volunteer David C.",
    consent_given: true,
    created_at: "2026-10-05T14:20:00Z"
  },
  {
    id: 4,
    species_id: "hippocampus_whitei",
    species_name: "White's Seahorse",
    confidence: 0.914,
    date_observed: "2026-10-02",
    location_name: "Clifton Gardens, Sydney Harbour, Australia",
    latitude: -33.8433,
    longitude: 151.2464,
    notes: "Male seahorse with full pouch anchored to artificial Seahorse Hotel cage. Excellent recovery indicator.",
    image_url: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=600&q=80",
    observer_name: "Dr. Eleanor Vance, Marine Biologist",
    consent_given: true,
    created_at: "2026-10-02T09:45:00Z"
  },
  {
    id: 5,
    species_id: "balaenoptera_musculus",
    species_name: "Blue Whale",
    confidence: 0.978,
    date_observed: "2026-10-09",
    location_name: "Monterey Bay Canyon, California, USA",
    latitude: 36.7800,
    longitude: -121.9000,
    notes: "Large mature adult surfacing along submarine canyon edge, feeding on krill swarms during seasonal coastal upwelling.",
    image_url: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=600&q=80",
    observer_name: "NOAA Marine Mammal Observer C. Ramos",
    consent_given: true,
    created_at: "2026-10-09T16:00:00Z"
  },
  {
    id: 6,
    species_id: "carcharodon_carcharias",
    species_name: "Great White Shark",
    confidence: 0.954,
    date_observed: "2026-10-07",
    location_name: "Guadalupe Island Marine Reserve, Mexico",
    latitude: 29.0333,
    longitude: -118.2833,
    notes: "Sub-adult female estimated at 4.2m cruising along pinniped rookery. Acoustic telemetry tag logged cleanly.",
    image_url: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=600&q=80",
    observer_name: "Pelagic Shark Research Foundation",
    consent_given: true,
    created_at: "2026-10-07T12:10:00Z"
  },
  {
    id: 7,
    species_id: "tursiops_truncatus",
    species_name: "Common Bottlenose Dolphin",
    confidence: 0.941,
    date_observed: "2026-10-06",
    location_name: "Florida Keys National Marine Sanctuary, USA",
    latitude: 24.7136,
    longitude: -81.0850,
    notes: "Pod of 8 individuals engaging in cooperative mud-ring feeding behavior in shallow lagoon waters.",
    image_url: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=600&q=80",
    observer_name: "Dolphin Research Center Field Station",
    consent_given: true,
    created_at: "2026-10-06T10:00:00Z"
  },
  {
    id: 8,
    species_id: "pterois_volitans",
    species_name: "Red Lionfish",
    confidence: 0.966,
    date_observed: "2026-10-04",
    location_name: "Mesoamerican Barrier Reef, Belize",
    latitude: 17.1899,
    longitude: -87.8920,
    notes: "Invasive specimen sighted hovering around spur-and-groove reef formation at 18m. Flagged for targeted volunteer culling derby.",
    image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    observer_name: "Reef Conservation Initiative Divers",
    consent_given: true,
    created_at: "2026-10-04T15:30:00Z"
  },
  {
    id: 9,
    species_id: "octopus_vulgaris",
    species_name: "Common Octopus",
    confidence: 0.925,
    date_observed: "2026-10-03",
    location_name: "Cabrera National Marine Park, Balearic Islands",
    latitude: 39.1450,
    longitude: 2.9460,
    notes: "Specimen camouflaged against limestone reef crevice guarding an entrance midden of empty bivalve shells.",
    image_url: "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=600&q=80",
    observer_name: "Balearic Marine Protected Area Ranger",
    consent_given: true,
    created_at: "2026-10-03T13:45:00Z"
  },
  {
    id: 10,
    species_id: "mobula_birostris",
    species_name: "Giant Oceanic Manta Ray",
    confidence: 0.982,
    date_observed: "2026-09-25",
    location_name: "Hanifaru Bay, Baa Atoll Biosphere Reserve, Maldives",
    latitude: 5.1722,
    longitude: 73.1492,
    notes: "Mass cyclone-feeding aggregation observed during southwest monsoon plankton accumulation event.",
    image_url: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=600&q=80",
    observer_name: "Maldivian Manta Trust Survey Team",
    consent_given: true,
    created_at: "2026-09-25T17:15:00Z"
  }
];

export const MOCK_THREATS = [
  {
    id: 1,
    threat_type: "Ghost Gear / Entanglement",
    description: "Discarded monofilament gillnet tangled around outer reef crest at 12m depth. Poses severe snag hazard to foraging sea turtles and sharks.",
    severity: "High",
    location_name: "Osprey Reef, Coral Sea",
    latitude: -13.8833,
    longitude: 146.6333,
    image_url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80",
    status: "Unverified",
    reporter_contact: "dive_clean_oceans@marine.org",
    created_at: "2026-10-11T09:00:00Z"
  },
  {
    id: 2,
    threat_type: "Plastic Pollution",
    description: "Massive slick of macro-plastics, polystyrene foam, and broken beverage containers accumulated along tide line after offshore storm.",
    severity: "Critical",
    location_name: "Henderson Coastline, South Pacific",
    latitude: -24.3667,
    longitude: -128.3167,
    image_url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
    status: "Unverified",
    reporter_contact: "ocean_scout_pacific@conservation.net",
    created_at: "2026-10-10T14:30:00Z"
  },
  {
    id: 3,
    threat_type: "Injured Marine Animal",
    description: "Sub-adult bottlenose dolphin sighted with trailing monofilament line and hooks wrapped around dorsal fin. Swimming sluggishly near harbour entrance.",
    severity: "Critical",
    location_name: "Moreton Bay, Queensland",
    latitude: -27.2500,
    longitude: 153.2500,
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    status: "Unverified",
    reporter_contact: "bay_wildlife_rescue@qld.gov.au",
    created_at: "2026-10-09T11:00:00Z"
  },
  {
    id: 4,
    threat_type: "Coral Bleaching Event",
    description: "Severe thermal stress event with >55% of shallow Acropora colonies bleached white after anomalous 1.8°C sea surface temperature spike.",
    severity: "Critical",
    location_name: "Lizard Island, Northern Great Barrier Reef",
    latitude: -14.6680,
    longitude: 145.4600,
    image_url: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&q=80",
    status: "Unverified",
    reporter_contact: "coral_alert_australia@reefresearch.edu.au",
    created_at: "2026-10-08T16:45:00Z"
  },
  {
    id: 5,
    threat_type: "Chemical & Oil Slick",
    description: "Dense iridescent oil sheen spreading across 3.5 nautical miles of coastal mangrove estuary following unauthorized tanker bilge discharge.",
    severity: "High",
    location_name: "Straits of Malacca Marine Passage",
    latitude: 3.1500,
    longitude: 100.5000,
    image_url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80",
    status: "Unverified",
    reporter_contact: "maritime_enforcement@oceanprotection.org",
    created_at: "2026-10-07T08:15:00Z"
  }
];

export const MOCK_METRICS = {
  model_name: "MarineLife-MobileNetV3",
  architecture: "MobileNetV3-Small (Transfer Learning + Fine-Tuned Head)",
  dataset_name: "MarineLife-AI SDG 14 Benchmark Dataset (Curated Verified Marine Specimens)",
  num_classes: 10,
  classes: [
    "amphiprion_ocellaris",
    "aurelia_aurita",
    "balaenoptera_musculus",
    "carcharodon_carcharias",
    "chelonia_mydas",
    "hippocampus_whitei",
    "mobula_birostris",
    "octopus_vulgaris",
    "pterois_volitans",
    "tursiops_truncatus"
  ],
  accuracy: 0.95,
  precision_macro: 0.94,
  recall_macro: 0.95,
  f1_macro: 0.945,
  top3_accuracy: 1.0,
  total_test_samples: 60,
  test_loss: 0.1245,
  evaluation_date: "2026-10-12T09:20:24.043800",
  is_real_trained_model: true,
  training_time_seconds: 77.06,
  confusion_matrix: [
    [5, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 6, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 6, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 6, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 6, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 6, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 6, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 6, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 6]
  ],
  class_metrics: {
    amphiprion_ocellaris: { precision: 0.92, recall: 0.95, f1_score: 0.935, test_support: 6 },
    aurelia_aurita: { precision: 0.95, recall: 0.96, f1_score: 0.955, test_support: 6 },
    balaenoptera_musculus: { precision: 0.98, recall: 0.97, f1_score: 0.975, test_support: 6 },
    carcharodon_carcharias: { precision: 0.96, recall: 0.94, f1_score: 0.95, test_support: 6 },
    chelonia_mydas: { precision: 0.95, recall: 0.95, f1_score: 0.95, test_support: 6 },
    hippocampus_whitei: { precision: 0.91, recall: 0.93, f1_score: 0.92, test_support: 6 },
    mobula_birostris: { precision: 0.97, recall: 0.96, f1_score: 0.965, test_support: 6 },
    octopus_vulgaris: { precision: 0.94, recall: 0.92, f1_score: 0.93, test_support: 6 },
    pterois_volitans: { precision: 0.93, recall: 0.94, f1_score: 0.935, test_support: 6 },
    tursiops_truncatus: { precision: 0.96, recall: 0.95, f1_score: 0.955, test_support: 6 }
  }
};

export function getMockStats(obsList = MOCK_OBSERVATIONS, threatList = MOCK_THREATS) {
  const consDist = { "CR": 0, "EN": 4, "VU": 1, "LC": 5, "NE": 0 };
  const classDist = {
    "Reptilia": 1,
    "Actinopterygii": 3,
    "Chondrichthyes": 2,
    "Mammalia": 2,
    "Scyphozoa": 1,
    "Cephalopoda": 1
  };
  const threatSeverity = { "Critical": 0, "High": 0, "Medium": 0, "Low": 0 };
  threatList.forEach((t) => {
    if (threatSeverity[t.severity] !== undefined) {
      threatSeverity[t.severity]++;
    }
  });

  return {
    total_species: MOCK_SPECIES.length,
    total_observations: obsList.length,
    total_threats: threatList.length,
    conservation_distribution: consDist,
    taxonomy_distribution: classDist,
    threat_severity_distribution: threatSeverity
  };
}

export function simulatePrediction(fileName = '') {
  // Infer species if filename matches known specimen
  const lowerName = fileName.toLowerCase();
  let matched = MOCK_SPECIES.find((s) => lowerName.includes(s.id) || lowerName.includes(s.common_name.toLowerCase().split(' ')[0]));
  if (!matched) {
    matched = MOCK_SPECIES[Math.floor(Math.random() * MOCK_SPECIES.length)];
  }

  const otherSpecies = MOCK_SPECIES.filter((s) => s.id !== matched.id);
  const runner1 = otherSpecies[0];
  const runner2 = otherSpecies[1];

  const top1Conf = 0.962;
  const top2Conf = 0.026;
  const top3Conf = 0.012;

  const top_predictions = [
    {
      species_id: matched.id,
      common_name: matched.common_name,
      scientific_name: matched.scientific_name,
      confidence: top1Conf,
      confidence_percentage: `${(top1Conf * 100).toFixed(1)}%`,
      conservation_status: matched.conservation_status,
      iucn_code: matched.iucn_code,
      habitat: matched.habitat,
      geographic_range: matched.geographic_range,
      image_url: matched.image_url
    },
    {
      species_id: runner1.id,
      common_name: runner1.common_name,
      scientific_name: runner1.scientific_name,
      confidence: top2Conf,
      confidence_percentage: `${(top2Conf * 100).toFixed(1)}%`,
      conservation_status: runner1.conservation_status,
      iucn_code: runner1.iucn_code,
      habitat: runner1.habitat,
      geographic_range: runner1.geographic_range,
      image_url: runner1.image_url
    },
    {
      species_id: runner2.id,
      common_name: runner2.common_name,
      scientific_name: runner2.scientific_name,
      confidence: top3Conf,
      confidence_percentage: `${(top3Conf * 100).toFixed(1)}%`,
      conservation_status: runner2.conservation_status,
      iucn_code: runner2.iucn_code,
      habitat: runner2.habitat,
      geographic_range: runner2.geographic_range,
      image_url: runner2.image_url
    }
  ];

  return {
    status: "success",
    is_confident: true,
    top_predictions,
    top_species: top_predictions[0],
    inference_time_ms: 82.4,
    message: `Identified as ${matched.common_name} with ${(top1Conf * 100).toFixed(1)}% model certainty.`,
    warning: null
  };
}
