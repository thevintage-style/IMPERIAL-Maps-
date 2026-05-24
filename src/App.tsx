import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Map as MapIcon, 
  BookOpen, 
  Scroll as ScrollIcon, 
  HelpCircle, 
  Shield, 
  Anchor, 
  Swords, 
  Waves, 
  Mountain, 
  Landmark, 
  Sparkles, 
  Feather, 
  Loader2, 
  FolderHeart, 
  Trash2,
  ChevronRight,
  Globe,
  Search,
  CheckCircle,
  HelpCircle as QuestionIcon,
  Volume2,
  VolumeX,
  Play
} from "lucide-react";
import { INDIA_LOCATIONS, WORLD_LOCATIONS } from "./data";
import { MapSection, MapSubSection, PresetLocation, ChroniclerReport } from "./types";
import { RIVERS_DATA, RiverData } from "./riversData";

export default function App() {
  // Current mapping selections
  const [activeSection, setActiveSection] = useState<MapSection>("india");
  const [activeSubSection, setActiveSubSection] = useState<MapSubSection>("political");
  const [isLegendHovered, setIsLegendHovered] = useState<boolean>(false);

  // Selection marker states
  const [selectedLocation, setSelectedLocation] = useState<PresetLocation | null>(null);
  const [selectedRiver, setSelectedRiver] = useState<RiverData | null>(null);
  const [cursorCoordinates, setCursorCoordinates] = useState<string>("N 28°36' / E 77°12'");
  const [caliperPosition, setCaliperPosition] = useState<{ lat: number; lng: number } | null>({ lat: 28.6139, lng: 77.2090 }); // default at Delhi
  
  // Custom marker dropped on maps
  const [customMarker, setCustomMarker] = useState<{
    x?: number;
    y?: number;
    lat?: number;
    lng?: number;
    coordsStr: string;
    section: MapSection;
  } | null>(null);

  // Gemini chronicle analysis state
  const [isChroniclerLoading, setIsChroniclerLoading] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<ChroniclerReport | null>(null);
  const [chroniclerError, setChroniclerError] = useState<string | null>(null);

  // Expedition journal logging (saved places)
  const [expeditionJournal, setExpeditionJournal] = useState<ChroniclerReport[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Sound feedback states (Lute/quill classical synthesizer)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Custom AI elaboration query
  const [followUpPrompt, setFollowUpPrompt] = useState<string>("");
  const [isElaborating, setIsElaborating] = useState<boolean>(false);
  const [elaborationError, setElaborationError] = useState<string | null>(null);
  const [journalFeedback, setJournalFeedback] = useState<string | null>(null);

  // Refs for managing Leaflet map instance and DOM container
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  // Select initial location on load (Delhi for India)
  useEffect(() => {
    const defaultLoc = INDIA_LOCATIONS.find(l => l.id === "delhi") || INDIA_LOCATIONS[0];
    handleSelectLocation(defaultLoc);
  }, []);

  // Vintage parchment scroll audio synthesis feedback
  const playVintageSound = (type: "click" | "scroll" | "quill" | "sea") => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (type === "click") {
        // High resonance old map paper click
        osc.type = "triangle";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === "scroll") {
        // Deep string parchment wobble
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.32);
      } else if (type === "quill") {
        // Sand paper parchment scribble
        const bufferSize = ctx.sampleRate * 0.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1000;
        filter.Q.value = 3.0;
        noise.connect(filter);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start();
      }
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  // Turn voice on/off
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      // Small chime
      setTimeout(() => {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          osc.start();
          osc.stop(ctx.currentTime + 0.22);
        } catch(e) {}
      }, 100);
    }
  };

  // Format real global coordinates to classic naval/maritime parchment structure
  const formatLatLngToVintage = (lat: number, lng: number): string => {
    const latAbs = Math.abs(lat);
    const latDeg = Math.floor(latAbs);
    const latMin = Math.round((latAbs - latDeg) * 60);
    const latDir = lat >= 0 ? "N" : "S";

    const lngAbs = Math.abs(lng);
    const lngDeg = Math.floor(lngAbs);
    const lngMin = Math.round((lngAbs - lngDeg) * 60);
    const lngDir = lng >= 0 ? "E" : "W";

    return `${latDir} ${latDeg}°${String(latMin).padStart(2, '0')}' / ${lngDir} ${String(lngMin).padStart(2, '0')}'`;
  };

  // Convert SVG coordinates as a backward-compatibility fallback
  const calculateCoordinates = (xPercent: number, yPercent: number, section: MapSection): string => {
    if (section === "india") {
      const latVal = 37.0 - (yPercent / 100) * (37.0 - 6.0);
      const lngVal = 68.0 + (xPercent / 100) * (98.0 - 68.0);
      return formatLatLngToVintage(latVal, lngVal);
    } else {
      const latVal = 80.0 - (yPercent / 100) * (80.0 + 60.0);
      const lngVal = -180.0 + (xPercent / 100) * 360.0;
      return formatLatLngToVintage(latVal, lngVal);
    }
  };

  // 1. Initialize the Leaflet Map Container once upon mounting
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Prevent multiple initializations

    // Setup map (defaults to India center initially)
    const map = L.map(mapContainerRef.current, {
      center: activeSection === "india" ? [22.5, 78.5] : [30.0, 15.0],
      zoom: activeSection === "india" ? 5 : 2,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    mapRef.current = map;

    // Create a markers display group
    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Set map controls position
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Track real-time coordinates readout as cursor pans across vellum
    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const formatted = formatLatLngToVintage(lat, lng);
      setCursorCoordinates(formatted);
    });

    // Handle tactile clicks anywhere on the real map layers to drop crosshairs!
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      playVintageSound("click");

      const coordsStr = formatLatLngToVintage(lat, lng);
      const presets = activeSection === "india" ? INDIA_LOCATIONS : WORLD_LOCATIONS;

      // Snapping algorithm: if clicked within 0.8 degrees of a preset, select it!
      const snappedPreset = presets.find((loc) => {
        if (loc.lat === undefined || loc.lng === undefined) return false;
        const dist = Math.sqrt(Math.pow(loc.lat - lat, 2) + Math.pow(loc.lng - lng, 2));
        return dist < 0.8;
      });

      if (snappedPreset) {
        handleSelectLocation(snappedPreset);
        return;
      }

      // Drop a custom Surveyor point
      setCustomMarker({
        lat,
        lng,
        coordsStr,
        section: activeSection
      });
      setSelectedLocation(null);
      setCaliperPosition({ lat, lng });

      // Transmit Dispatch to Gemini Chronicle Scholar
      fetchScholarReport(
        "",
        coordsStr,
        activeSubSection === "political" ? "Historical Frontier Zone" : activeSubSection === "physical" ? "Elevation Gradients" : "Topographical Watershed Profile",
        `A custom surveyor mark placed at global coordinates [Lat: ${lat.toFixed(4)}°, Lng: ${lng.toFixed(4)}°], examining local terrain structure, chronological empire lines, and region folklore.`,
        activeSection
      );
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Synchronize Map Center when section tabs switch (India vs World)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (activeSection === "india") {
      map.setView([22.5, 78.5], 5, { animate: true, duration: 1.2 });
    } else {
      map.setView([30.0, 15.0], 2, { animate: true, duration: 1.2 });
    }
  }, [activeSection]);

  // 3. Synchronize Tile Map Styles based on active subcategory layers (Political, Physical, Terrain)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Use highly accurate ESRI and OSM tiles styled dynamically with our sepia CSS blend
    let tileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";

    if (activeSubSection === "physical") {
      // Shaded Relief Topographical Map
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}";
    } else if (activeSubSection === "terrain") {
      // Clean geographical and political bounds outline map, isolating coastlines & river pathways in vintage monochrome
      tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    }

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const newLayer = L.tileLayer(tileUrl, {
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [activeSubSection]);

  // 4. Draw markers reactively in the Leaflet viewport
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    // Clear previous marks
    markersGroup.clearLayers();

    // Render presets index pins
    const presets = activeSection === "india" ? INDIA_LOCATIONS : WORLD_LOCATIONS;
    presets.forEach((loc) => {
      if (loc.lat === undefined || loc.lng === undefined) return;

      const isSelected = selectedLocation?.id === loc.id;
      
      const pinHtml = `
        <div class="relative flex items-center justify-center">
          ${isSelected ? `<div class="absolute w-8 h-8 rounded-full border-2 border-[#a63f3f]/50 animate-ping"></div>` : ""}
          <div class="w-4 h-4 rounded-full ${isSelected ? "bg-[#a63f3f]" : "bg-[#8a6c31]"} border border-vintage-gold shadow flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-40">
            <div class="w-1.5 h-1.5 bg-[#fdfaf2] rounded-full"></div>
          </div>
          <div class="absolute top-4 left-4 bg-parchment-light/95 text-charcoal-ink text-[8px] border border-vintage-gold/50 rounded px-1 font-bold whitespace-nowrap opacity-85 shadow-sm capitalize font-serif z-50">
            ${loc.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: "custom-leaflet-pin",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        handleSelectLocation(loc);
      });
      marker.addTo(markersGroup);
    });

    // Render real flowing rivers when Rivers & Ridges / Terrain tab is selected
    if (activeSubSection === "terrain") {
      const activeRivers = RIVERS_DATA.filter(r => r.section === activeSection);
      activeRivers.forEach((river) => {
        const isSelected = selectedRiver?.id === river.id;

        const polyline = L.polyline(river.path, {
          color: isSelected ? "#0fa6d1" : "#1e7a9b",
          weight: isSelected ? 4.5 : 2.5,
          opacity: 0.9,
          className: isSelected ? "river-flowing-selected" : "river-flowing"
        });

        // Add vintage text label above the flowing river path
        polyline.bindTooltip(
          `<div class="serif-vintage font-bold text-[9px] text-[#0c435c] bg-[#faf3dc]/90 border border-[#8a6c31]/30 rounded px-1.5 py-0.5 shadow-sm whitespace-nowrap select-none tracking-wide text-center uppercase">${river.name}</div>`,
          {
            permanent: true,
            direction: "center",
            className: "transparent-leaflet-tooltip",
            sticky: true
          }
        );

        polyline.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          handleSelectRiver(river);
        });

        polyline.addTo(markersGroup);
      });
    }

    // Render custom surveyor dropped crosshair caliper
    if (customMarker && customMarker.section === activeSection && customMarker.lat !== undefined && customMarker.lng !== undefined) {
      const caliperIcon = L.divIcon({
        html: `
          <div class="caliper-inner-animate relative flex items-center justify-center w-20 h-20">
            <!-- Concentric spinning rings -->
            <div class="absolute w-12 h-12 border border-[#a63f3f]/40 rounded-full animate-spin-slow pointer-events-none bg-[#fdfaf2]/40"></div>
            <div class="absolute w-16 h-16 border border-dashed border-[#a63f3f]/20 rounded-full pointer-events-none"></div>
            
            <!-- Custom sight glass crosshairs -->
            <div class="absolute h-10 w-[1px] bg-[#a63f3f]/30 pointer-events-none"></div>
            <div class="absolute w-10 h-[1px] bg-[#a63f3f]/30 pointer-events-none"></div>

            <!-- Coords Box placed perfectly inside the marker circle boundaries -->
            <div class="absolute bg-[#2a1305]/95 text-[#fdfaf2] text-[7px] border border-[#a63f3f]/70 rounded px-1.5 py-0.5 font-mono shadow-md z-20 text-center leading-normal">
              <div class="text-[#ffb7b7] text-[5.5px] tracking-wider uppercase font-bold leading-none mb-0.5 select-none font-sans">SURVEYING</div>
              <div class="text-[7.5px] font-bold"><span class="caliper-lat-label">${customMarker.lat.toFixed(4)}</span>°</div>
              <div class="text-[7.5px] font-bold"><span class="caliper-lng-label">${customMarker.lng.toFixed(4)}</span>°</div>
            </div>
          </div>
        `,
        className: "custom-leaflet-caliper",
        iconSize: [80, 80],
        iconAnchor: [40, 40]
      });

      const marker = L.marker([customMarker.lat, customMarker.lng], { 
        icon: caliperIcon,
        draggable: true 
      });
      
      // Bind coordinate floating info-tooltip on hover
      const latCoords = customMarker.lat.toFixed(5);
      const lngCoords = customMarker.lng.toFixed(5);
      marker.bindTooltip(
        `<div class="flex flex-col items-center">
           <span class="text-[7.5px] tracking-wider uppercase font-sans text-amber-200/50 font-bold">SEXTANT POSITION</span>
           <span class="font-mono text-[9px] text-amber-100">LAT: ${latCoords}°</span>
           <span class="font-mono text-[9px] text-amber-100">LNG: ${lngCoords}°</span>
         </div>`,
        {
          className: "caliper-tooltip-custom",
          direction: "top",
          offset: [0, -10],
          opacity: 1.0,
          permanent: false // floating/on hover!
        }
      );

      // Handle dragging event to update coordinates inside marker and tooltip in real time
      marker.on("drag", (e: L.LeafletEvent) => {
        const markerInstance = e.target as L.Marker;
        const currentLatLng = markerInstance.getLatLng();
        
        // 1. Update Tooltip text dynamically
        markerInstance.setTooltipContent(
          `<div class="flex flex-col items-center">
             <span class="text-[7.5px] tracking-wider uppercase font-sans text-amber-200/50 font-bold">SEXTANT POSITION (DRAGGING)</span>
             <span class="font-mono text-[9px] text-amber-100">LAT: ${currentLatLng.lat.toFixed(5)}°</span>
             <span class="font-mono text-[9px] text-amber-100">LNG: ${currentLatLng.lng.toFixed(5)}°</span>
           </div>`
        );
        
        // Standard Leaflet may close tooltip on drag; reopen it to guide the user
        if (!markerInstance.isTooltipOpen()) {
          markerInstance.openTooltip();
        }

        // 2. Direct DOM manipulation for coordinate displays inside marker circle for 60 FPS performance
        const element = markerInstance.getElement();
        if (element) {
          const latLabel = element.querySelector(".caliper-lat-label");
          const lngLabel = element.querySelector(".caliper-lng-label");
          if (latLabel) latLabel.textContent = currentLatLng.lat.toFixed(4);
          if (lngLabel) lngLabel.textContent = currentLatLng.lng.toFixed(4);
        }
      });

      // Handle dragend to push the coordinates back to React state and dispatch a new scholar report
      marker.on("dragend", (e: L.LeafletEvent) => {
        const markerInstance = e.target as L.Marker;
        const finalLatLng = markerInstance.getLatLng();
        const coordsStr = formatLatLngToVintage(finalLatLng.lat, finalLatLng.lng);
        
        setCustomMarker({
          lat: finalLatLng.lat,
          lng: finalLatLng.lng,
          coordsStr,
          section: activeSection
        });
        setCaliperPosition({ lat: finalLatLng.lat, lng: finalLatLng.lng });

        // Request a fresh chronicle analysis from Gemini at the final drag destination
        fetchScholarReport(
          "",
          coordsStr,
          activeSubSection === "political" ? "Historical Frontier Zone" : activeSubSection === "physical" ? "Elevation Gradients" : "Topographical Watershed Profile",
          `A custom surveyor mark placed at global coordinates [Lat: ${finalLatLng.lat.toFixed(4)}°, Lng: ${finalLatLng.lng.toFixed(4)}°], examining local terrain structure, chronological empire lines, and region folklore.`,
          activeSection
        );
      });

      marker.addTo(markersGroup);
    }
  }, [activeSection, selectedLocation, customMarker, activeSubSection, selectedRiver]);

  // Request high-quality cartographical analysis from server (Gemini API)
  const fetchScholarReport = async (
    name: string,
    coords: string,
    category: string,
    detailsText: string,
    section: MapSection
  ) => {
    setIsChroniclerLoading(true);
    setChroniclerError(null);
    playVintageSound("scroll");

    try {
      const response = await fetch("/api/gemini/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          section: section === "india" ? "Realm of India" : "The Known World",
          category: category,
          coordinates: coords,
          details: detailsText
        })
      });

      if (!response.ok) {
        let extra = "Imperial dispatch lost at sea.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            extra = errData.error;
          }
        } catch (je) {}
        throw new Error(extra);
      }

      const parsedData = await response.json();
      setCurrentReport(parsedData);
      playVintageSound("quill");
    } catch (err: any) {
      const fallbackName = name || (coords ? `Survey Point [${coords}]` : "Ancient Outlook");
      console.warn("Front-end fallback engaged:", err?.message || err);

      // Search lists for a matched preset to deliver ultra high fidelity factual fallback
      const presetMatches = [...INDIA_LOCATIONS, ...WORLD_LOCATIONS];
      const match = presetMatches.find(p => p.name.toLowerCase() === fallbackName.toLowerCase() || p.id.toLowerCase() === fallbackName.toLowerCase());
      const riverMatch = RIVERS_DATA.find(r => r.name.toLowerCase() === fallbackName.toLowerCase() || r.id.toLowerCase() === fallbackName.toLowerCase());

      let clientFallback: ChroniclerReport;

      if (riverMatch) {
        clientFallback = {
          locationName: riverMatch.name,
          coordinates: `${riverMatch.path[0][0].toFixed(3)}°N / ${riverMatch.path[0][1].toFixed(3)}°E (Source)`,
          archetype: "Flowing Lifeline Watercourse",
          title: `${riverMatch.name.toUpperCase()} RIVER DISPATCH`,
          poeticDescription: `${riverMatch.name} is one of the most vital rivers in UPSC geography. It originates at ${riverMatch.origin} and meanders for an extensive length of ${riverMatch.length}. It flows directly across ${riverMatch.statesOrCountriesDirect.length} territory zones: ${riverMatch.statesOrCountriesDirect.join(", ")}. It is central to agricultural safety, industrial basins, and ecological zones.`,
          importance: `Pivotal hydro-ecological stream acting as irrigation backbone, riparian demarcator, and regional transport corridor (NW networks).`,
          timeline: [
            { era: "Headwaters Source", event: riverMatch.origin },
            { era: "Total Flow Meander", event: riverMatch.length },
            { era: "Left Bank", event: riverMatch.tributariesLeft.join(", ") },
            { era: "Right Bank", event: riverMatch.tributariesRight.join(", ") }
          ],
          associatedFeatures: {
            rivers: `${riverMatch.name} River Basin & Catchment`,
            mountains: "Surrounding alpine ridges and glacier lines that supply water flow",
            surroundingPlains: "Fertile agricultural river-delta or riparian basin plains"
          },
          trivia: `Major Hydrological Infrastructure/Dams: ${riverMatch.majorDamsProjects.join(", ")}. Ancient Context: ${riverMatch.historicSignificance}`,
          upscPrelims: `• National Status: Major drainage basin framework.\n• Left Bank Tributaries: ${riverMatch.tributariesLeft.join(", ")}\n• Right Bank Tributaries: ${riverMatch.tributariesRight.join(", ")}\n• Dam Projects & Engineering: ${riverMatch.majorDamsProjects.join(", ")}\n• UPSC Prelims Highlight: ${riverMatch.upscPrelimsBrief}`,
          upscMains: `• Direct Territory Coverage: Passes directly through ${riverMatch.statesOrCountriesDirect.length} regions: ${riverMatch.statesOrCountriesDirect.join(", ")}.\n\n• UPSC Mains Analytical Studies (Geography, Environment, Disaster Management):\n${riverMatch.upscMainsBrief}`,
          systemMessage: "Sovereign Scroll Vaults Ledger Entry • Offline Backup Active"
        };
      } else if (match) {
        clientFallback = {
          locationName: match.name,
          coordinates: match.coordinatesStr,
          archetype: match.subCategoryText,
          title: `THE CHRONICLE OF IMPERIAL ${match.name.toUpperCase()}`,
          poeticDescription: match.details,
          importance: `Key geographic bastion holding core strategic significance, managing sovereign transportation routes, water drainages, or fertile basin soils.`,
          timeline: [
            { era: "Antiquity", event: "Noted in early geographic records of classical mapmakers." },
            { era: "Imperial Peak", event: "Consolidated as a pivotal asset for defensive walls and trade networks." },
            { era: "Modern Era", event: "Preserved as a protected national heritage and study monument." }
          ],
          associatedFeatures: {
            rivers: "Faint river channels or underground aquifers feed nearby agricultural systems.",
            mountains: "High crests of the defensive terrain line are observable nearby.",
            surroundingPlains: "Flat valleys and black or alluvial soils support vast agrarian communities."
          },
          trivia: "An extremely legendary chronicle states ancient caravans stopped here to verify maps and swap deep gold and silk loads.",
          upscPrelims: `• Landmark Feature: ${match.name} remains a crucial historical subject.\n• Category Type: ${match.category.toUpperCase()} within the geographic region.\n• Core UPSC Significance: Connected to major dynastic administrative seats, art-and-architecture models, or crucial environmental zones.`,
          upscMains: `A comprehensive evaluation of the physical geography of ${match.name} highlights the dynamic link between spatial terrains, agrarian base integration, and historical communication corridors (GS-1 & GS-3).`,
          systemMessage: "Sovereign Scroll Vaults Ledger Entry • Offline Backup Active"
        };
      } else {
        clientFallback = {
          locationName: fallbackName,
          coordinates: coords || "Uncharted Meridians",
          archetype: category || "Scholastic Frontier Observation",
          title: `THE ATLAS LEDGER FOR ${fallbackName.toUpperCase()}`,
          poeticDescription: `Surrounding geography has nourished regional agricultural basins, military units, and merchants throughout history.`,
          importance: `A key spatial beacon holding strategic defensive value, coordinating local transport, or harboring accessible freshwater tributaries.`,
          timeline: [
            { era: "First Epoch", event: "Nomadic hunters trace seasonal migration lines past this altitude." },
            { era: "Imperial Rise", event: "Fortified guard posts are raised nearby to oversee caravan tax collections." },
            { era: "The Royal Charts", event: "Registered in the Imperial Map Society Archive under vellum code 404." }
          ],
          associatedFeatures: {
            rivers: "Gentle streams mapped in surrounding valleys feed regional basins.",
            mountains: "Moderate hills and green slopes shelter the immediate valleys.",
            surroundingPlains: "Pastoral landscape suitable for boundary delineation."
          },
          trivia: "Legend states early mariners observed migratory eagles nesting near this location, signifying holy water springs.",
          upscPrelims: `• Key Dynasties & Administration: Surrounding geography has intersections with major imperial consolidation lines.\n• Structural Monuments: Notable structures from historical periods showcasing regional design types.\n• Ecological Context: Linked to vital regional watersheds, local forest covers, or protected wildlife zones.\n• Mapping Highlights: Command center of early defensive passes or caravan linkages.`,
          upscMains: `The developmental and geographical evolution of this area illustrates the pivotal role physical terrain plays in guiding trade corridors, agrarian surplus distribution, and regional administration.\n1. Agrarian Integration: Natural valley drainages served as the basis for agricultural production, supporting sovereign taxation and army maintenance (GS-1: Indian Geography).\n2. Geopolitical Conduit: Mountain passes, river channels, or maritime centers functioned as key transit points for trade and diplomatic routes (GS-1: Ancient & Medieval History).\n3. Contemporary Heritage and Water Security: Preservation of local monuments and sustainable management of regional aquifers amidst urban sprawl (GS-3: Environment).`,
          systemMessage: "Sovereign Scroll Vaults Ledger Entry • Offline Backup Active"
        };
      }

      setCurrentReport(clientFallback);
      playVintageSound("quill");
    } finally {
      setIsChroniclerLoading(false);
    }
  };

  // Toggle Section tabs (India / World)
  const handleSectionChange = (section: MapSection) => {
    playVintageSound("scroll");
    setActiveSection(section);
    setCustomMarker(null);
    setSelectedRiver(null);
    
    // Choose first preset location for that section
    const presets = section === "india" ? INDIA_LOCATIONS : WORLD_LOCATIONS;
    const defaultLoc = presets[0];
    handleSelectLocation(defaultLoc);
  };

  // Handle Preset Selection directly
  const handleSelectLocation = (loc: PresetLocation) => {
    setSelectedLocation(loc);
    setSelectedRiver(null);
    setCustomMarker(null);
    playVintageSound("click");

    if (loc.lat !== undefined && loc.lng !== undefined) {
      setCaliperPosition({ lat: loc.lat, lng: loc.lng });
      // Clean map focus zoom flyover!
      if (mapRef.current) {
        mapRef.current.setView([loc.lat, loc.lng], 7, { animate: true, duration: 1.2 });
      }
    }

    // Pull from preset data initially, then ask Gemini for complete 18th century scroll details!
    fetchScholarReport(
      loc.name,
      loc.coordinatesStr,
      loc.subCategoryText,
      loc.details,
      activeSection
    );
  };

  // Handle River Selection directly
  const handleSelectRiver = (river: RiverData) => {
    setSelectedRiver(river);
    setSelectedLocation(null);
    setCustomMarker(null);
    playVintageSound("scroll");

    // Center viewport on the central coordinate of the river path
    if (river.path.length > 0 && mapRef.current) {
      const midIdx = Math.floor(river.path.length / 2);
      const midPoint = river.path[midIdx];
      mapRef.current.setView([midPoint[0], midPoint[1]], 6, { animate: true, duration: 1.2 });
    }

    // Map dynamic river details to a comprehensive ChroniclerReport suitable for UPSC study
    const riverReport: ChroniclerReport = {
      locationName: river.name,
      coordinates: `${river.path[0][0].toFixed(3)}°N / ${river.path[0][1].toFixed(3)}°E (Source)`,
      archetype: "Flowing Lifeline Watercourse",
      title: `${river.name.toUpperCase()} RIVER DISPATCH`,
      poeticDescription: `${river.name} is one of the most vital rivers in UPSC geography. It originates at ${river.origin} and meanders for an extensive length of ${river.length}. It flows directly across ${river.statesOrCountriesDirect.length} territory zones: ${river.statesOrCountriesDirect.join(", ")}. It is central to agricultural safety, industrial basins, and ecological zones.`,
      importance: `Pivotal hydro-ecological stream acting as irrigation backbone, riparian demarcator, and regional transport corridor (NW networks).`,
      timeline: [
        { era: "Headwaters Source", event: river.origin },
        { era: "Total Flow Meander", event: river.length },
        { era: "Left Bank Tributaries", event: river.tributariesLeft.length > 0 ? river.tributariesLeft.join(", ") : "No prominent left bank tributaries catalogued in our atlas." },
        { era: "Right Bank Tributaries", event: river.tributariesRight.length > 0 ? river.tributariesRight.join(", ") : "No prominent right bank tributaries catalogued in our atlas." }
      ],
      associatedFeatures: {
        rivers: `${river.name} River Basin & Catchment`,
        mountains: "Surrounding alpine ridges and glacier lines that supply water flow",
        surroundingPlains: " Fertile agricultural river-delta or riparian basin plains"
      },
      trivia: `Major Hydrological Infrastructure/Dams: ${river.majorDamsProjects.join(", ")}. Ancient Context: ${river.historicSignificance}`,
      upscPrelims: `• National Status: Major drainage basin framework.\n• Left Bank Tributaries: ${river.tributariesLeft.join(", ")}\n• Right Bank Tributaries: ${river.tributariesRight.join(", ")}\n• Dam Projects & Engineering: ${river.majorDamsProjects.join(", ")}\n• UPSC Prelims Highlight: ${river.upscPrelimsBrief}`,
      upscMains: `• Direct Territory Coverage: Passes directly through ${river.statesOrCountriesDirect.length} regions: ${river.statesOrCountriesDirect.join(", ")}.\n\n• UPSC Mains Analytical Studies (Geography, Environment, Disaster Management):\n${river.upscMainsBrief}`,
      systemMessage: `Drafted from high-precision Cartographic River ledger.`
    };

    setCurrentReport(riverReport);
  };

  // Run Custom Geographical Search
  const handleGeographicalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    playVintageSound("click");
    setSearchFeedback(null);

    // Look through dataset first
    const dataset = activeSection === "india" ? INDIA_LOCATIONS : WORLD_LOCATIONS;
    const match = dataset.find(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match) {
      handleSelectLocation(match);
      setSearchFeedback(`Located: ${match.name}! Caliper aligned.`);
      setSearchQuery("");
      return;
    }

    // Look through rivers dataset too
    const matchedRiver = RIVERS_DATA.find(r => 
      r.section === activeSection &&
      (r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
       r.statesOrCountriesDirect.join(" ").toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (matchedRiver) {
      setActiveSubSection("terrain"); // Switch map layer to Rivers & Ridges
      handleSelectRiver(matchedRiver);
      setSearchFeedback(`Sextant aligned transit over: ${matchedRiver.name} Flowing Basin!`);
      setSearchQuery("");
      return;
    }

    // Dynamic search mapping request - place custom crosshairs directly on the active map's center!
    const targetLat = mapRef.current ? mapRef.current.getCenter().lat : (activeSection === "india" ? 22.5 : 30.0);
    const targetLng = mapRef.current ? mapRef.current.getCenter().lng : (activeSection === "india" ? 78.5 : 15.0);
    const generatedCoordsStr = formatLatLngToVintage(targetLat, targetLng);

    setCustomMarker({
      lat: targetLat,
      lng: targetLng,
      coordsStr: generatedCoordsStr,
      section: activeSection
    });
    setSelectedLocation(null);
    setCaliperPosition({ lat: targetLat, lng: targetLng });
    
    fetchScholarReport(
      searchQuery,
      generatedCoordsStr,
      "Imperial Search Chronicle",
      `User search exploration query for: ${searchQuery}. Uncover major milestones, rivers, high crests, strategic conflicts, and deep-seated local legends associated with this search subject area.`,
      activeSection
    );

    setSearchFeedback(`Expedition dispatched to map: "${searchQuery}" at current central coordinates...`);
    setSearchQuery("");
  };

  // Inscribe current parchment report into Expedition Journal
  const inscribeToJournal = () => {
    if (!currentReport) return;
    playVintageSound("quill");
    
    // Avoid duplicates
    if (expeditionJournal.some(j => j.locationName === currentReport.locationName)) {
      setJournalFeedback("This chronicle already rests in your ledger.");
      setTimeout(() => setJournalFeedback(null), 4000);
      return;
    }

    setExpeditionJournal([currentReport, ...expeditionJournal]);
    setJournalFeedback("Inscribed chronicle successfully into your Journal.");
    setTimeout(() => setJournalFeedback(null), 4000);
  };

  // Remove a place from Expedition Journal
  const deleteFromJournal = (name: string) => {
    playVintageSound("click");
    setExpeditionJournal(expeditionJournal.filter(item => item.locationName !== name));
  };

  // Chronicler follow-up prompt dynamic query (Gemini dynamic elaboration)
  const handleScholarElaborate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpPrompt.trim() || !currentReport) return;

    setIsElaborating(true);
    setElaborationError(null);
    playVintageSound("scroll");

    try {
      const response = await fetch("/api/gemini/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentReport.locationName,
          section: activeSection === "india" ? "Realm of India" : "The Known World",
          category: `In-depth investigation of: "${followUpPrompt}"`,
          coordinates: currentReport.coordinates,
          details: `Elaborate on the cartographical records of ${currentReport.locationName}. User seeks specific scholarly knowledge regarding: ${followUpPrompt}. Incorporate old-war details, legendary relics, trade, and precise physical watersheds.`
        })
      });

      if (!response.ok) {
        throw new Error("Unable to relay coordinates communication. (Failsafe activated)");
      }

      const parsedElaboration = await response.json();
      setCurrentReport({
        ...parsedElaboration,
        // Keep the original coordinates if the model rewrote them differently
        coordinates: currentReport.coordinates
      });
      setFollowUpPrompt("");
      playVintageSound("quill");
    } catch (err: any) {
      const rawMsg = err?.message || String(err);
      let friendlyError = "The royal archivist could not elicit further scrolls right now. Consuming local files.";
      const msgLower = rawMsg.toLowerCase();
      if (msgLower.includes("quota") || msgLower.includes("429") || msgLower.includes("resource_exhausted") || msgLower.includes("rate-limits")) {
        friendlyError = "The celestial dynamic courier (Gemini API) is overloaded (Quota reached). Appended local notes.";
      }
      
      console.warn("Dynamic chronicle elaboration failed:", friendlyError);
      setElaborationError(friendlyError);
      setTimeout(() => setElaborationError(null), 8000);

      // Append inline margin notes block to show the user we handled it cleanly:
      setCurrentReport({
        ...currentReport,
        poeticDescription: `${currentReport.poeticDescription} (Note on ${followUpPrompt}: Inscribed manually into local margins because the Gemini courier was dispatched with highest-priority matters.)`,
        systemMessage: `Drafted from local society scroll backup. [${friendlyError}]`
      });
      setFollowUpPrompt("");
    } finally {
      setIsElaborating(false);
    }
  };

  // Select dynamic list markers
  const getMarkerColor = (cat: string) => {
    switch (cat) {
      case "city": return "fill-amber-800 stroke-amber-950";
      case "fort": return "fill-red-800 stroke-red-950";
      case "river": return "fill-cyan-800 stroke-cyan-950";
      case "mountain": return "fill-slate-800 stroke-emerald-950";
      default: return "fill-amber-600 stroke-amber-900";
    }
  };

  // Choose preset categories
  const presetsToShow = activeSection === "india" ? INDIA_LOCATIONS : WORLD_LOCATIONS;

  const isOfflineVault = currentReport?.systemMessage?.toLowerCase().includes("offline") || 
                         currentReport?.systemMessage?.toLowerCase().includes("backup") ||
                         currentReport?.systemMessage?.toLowerCase().includes("failsafe") ||
                         currentReport?.systemMessage?.toLowerCase().includes("suspended") ||
                         currentReport?.systemMessage?.toLowerCase().includes("quiet");

  return (
    <div className="min-h-screen bg-[#1c140c] text-charcoal-ink p-2 md:p-6 flex flex-col justify-between select-none font-serif relative overflow-x-hidden">
      
      {/* Aesthetic Border Grids */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-[#2d1e11] opacity-70 z-40"></div>
      <div className="absolute inset-1 pointer-events-none border border-vintage-gold/20 z-40"></div>
      
      {/* Background ambience noise (Sepia overlay) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-10"></div>

      {/* Main Header Row */}
      <header className="z-20 w-full max-w-[1600px] mx-auto text-center py-4 px-6 border-b border-[#3d2715]/40 bg-[#2b1b10]/95 rounded-t-lg shadow-2xl relative">
        <div className="absolute top-2 left-6 text-vintage-gold/60 sans-imperial text-xs hidden sm:block">
          Anno Domini MDCCCLX
        </div>
        <div className="absolute top-2 right-6 text-vintage-gold/60 sans-imperial text-xs flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '60s' }} />
          <span>Epoch: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>

        {/* Title */}
        <h1 
          id="app-main-title" 
          className="sans-imperial font-extrabold text-2xl md:text-4xl text-vintage-gold tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          IMPERIAL MAPS
        </h1>
        <p className="serif-vintage text-amber-200/80 italic text-xs md:text-sm tracking-wide mt-1">
          The Interactive Cartographical Journal and Geopolitical Atlas of Nations
        </p>
        
        {/* Fine sub-divider line */}
        <div className="flex items-center justify-center gap-3 my-2">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-vintage-gold"></span>
          <span className="text-vintage-gold text-lg">✦</span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-vintage-gold"></span>
        </div>

        {/* Informative vintage notice bar */}
        <p className="text-[11px] sans-imperial text-amber-100/60 max-w-2xl mx-auto line-clamp-1">
          Click any point upon the historic parchment to commission a scholarly chronicle on local topography, ancient wars, and legendary lineages from the Royal society.
        </p>

        {/* Audio settings controller */}
        <button
          onClick={toggleSound}
          type="button"
          id="sound-toggle-btn"
          className="absolute right-6 top-10 text-vintage-gold hover:text-amber-100 transition-colors p-2 bg-[#1f120a] hover:bg-[#341d10] border border-vintage-gold/30 rounded-full mt-2"
          title={soundEnabled ? "Mute Scholastic Bell" : "Enable Classical Lute bell and Quill Soundwaves"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
        </button>
      </header>

      {/* Main Geographical Stage Grid Container */}
      <main className="z-20 w-full max-w-[1600px] mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-stretch">
        
        {/* Left Side: Map Navigation, Vector Canvas & Legend (Cols: 8) */}
        <section id="map-navigation-section" className="lg:col-span-8 flex flex-col justify-between bg-[#2d1a0e] border border-[#4a2e19] p-5 rounded-lg shadow-xl relative">
          
          {/* Section Selector Tab (India Realm vs World Known) */}
          <div className="flex border-b border-[#4d321d] pb-3 justify-between items-center gap-2">
            
            <div className="flex gap-2 flex-1">
              <button
                type="button"
                id="tab-btn-india"
                onClick={() => handleSectionChange("india")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs md:text-sm sans-imperial rounded border cursor-pointer transition-all duration-300 ${
                  activeSection === "india"
                    ? "bg-[#8a3324] text-amber-100 border-[#b8705c] shadow-[0_4px_10px_rgba(138,51,36,0.5)]"
                    : "bg-[#1f1008] text-vintage-gold/70 border-vintage-gold/20 hover:text-vintage-gold hover:bg-[#28150a]"
                }`}
              >
                <Compass className={`w-4 h-4 ${activeSection === "india" ? "animate-spin" : ""}`} style={{ animationDuration: '4s' }} />
                <span>Realm of India</span>
              </button>

              <button
                type="button"
                id="tab-btn-world"
                onClick={() => handleSectionChange("world")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs md:text-sm sans-imperial rounded border cursor-pointer transition-all duration-300 ${
                  activeSection === "world"
                    ? "bg-[#254f38] text-amber-100 border-[#6ca079] shadow-[0_4px_10px_rgba(37,79,56,0.5)]"
                    : "bg-[#1f1008] text-vintage-gold/70 border-vintage-gold/20 hover:text-vintage-gold hover:bg-[#28150a]"
                }`}
              >
                <Globe className={`w-4 h-4 ${activeSection === "world" ? "animate-pulse" : ""}`} />
                <span>The Known World</span>
              </button>
            </div>

            {/* Antique Seal Badge */}
            <div className="hidden sm:flex items-center gap-2 opacity-85">
              <div className="w-2.5 h-2.5 bg-[#822115] rounded-full border border-yellow-500 animate-pulse"></div>
              <span className="serif-vintage italic text-xs text-amber-100/70">Imperial Society Certified</span>
            </div>
          </div>

          {/* Sub-Section Menu (Political, Physical, Rivers & Topographies) */}
          <div className="grid grid-cols-3 gap-1 md:gap-2 my-3">
            <button
              onClick={() => { playVintageSound("click"); setActiveSubSection("political"); }}
              type="button"
              id="sub-political"
              className={`py-1.5 px-1 md:px-2 rounded text-[10px] md:text-xs sans-imperial font-bold tracking-wider text-center border transition-all duration-200 cursor-pointer ${
                activeSubSection === "political"
                  ? "bg-vintage-gold text-charcoal-ink border-amber-300 shadow"
                  : "bg-[#1c0f08] text-vintage-gold/60 border-vintage-gold/10 hover:text-vintage-gold hover:bg-[#2c180d]"
              }`}
            >
              Political Map
            </button>
            
            <button
              onClick={() => { playVintageSound("click"); setActiveSubSection("physical"); }}
              type="button"
              id="sub-physical"
              className={`py-1.5 px-1 md:px-2 rounded text-[10px] md:text-xs sans-imperial font-bold tracking-wider text-center border transition-all duration-200 cursor-pointer ${
                activeSubSection === "physical"
                  ? "bg-vintage-gold text-charcoal-ink border-amber-300 shadow"
                  : "bg-[#1c0f08] text-vintage-gold/60 border-vintage-gold/10 hover:text-vintage-gold hover:bg-[#2c180d]"
              }`}
            >
              Physical Elevation
            </button>
            
            <button
              onClick={() => { playVintageSound("click"); setActiveSubSection("terrain"); }}
              type="button"
              id="sub-terrain"
              className={`py-1.5 px-1 md:px-2 rounded text-[10px] md:text-xs sans-imperial font-bold tracking-wider text-center border transition-all duration-200 cursor-pointer ${
                activeSubSection === "terrain"
                  ? "bg-vintage-gold text-charcoal-ink border-amber-300 shadow"
                  : "bg-[#1c0f08] text-vintage-gold/60 border-vintage-gold/10 hover:text-vintage-gold hover:bg-[#2c180d]"
              }`}
            >
              Rivers & Ridges
            </button>
          </div>

          {/* Interactive Geographic Map Canvas (The Core Layout) */}
          <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded border-4 border-[#3a2514] overflow-hidden group parchment-texture ornamental-border flex flex-col justify-between">
            
            {/* Legend / Info Overlay top right of map */}
            <motion.div 
              className="absolute top-3 right-3 bg-parchment-light/95 border-double border-4 border-vintage-gold/50 p-2 text-[10px] rounded shadow-lg z-30 serif-vintage cursor-pointer select-none text-charcoal-ink"
              initial={{ width: "98px", height: "26px", opacity: 0.85 }}
              animate={{ 
                width: isLegendHovered ? "170px" : "98px",
                height: isLegendHovered ? "116px" : "26px",
                opacity: isLegendHovered ? 1.0 : 0.85,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              onMouseEnter={() => setIsLegendHovered(true)}
              onMouseLeave={() => setIsLegendHovered(false)}
              onClick={() => setIsLegendHovered(!isLegendHovered)}
            >
              {/* Corner Wax Seals */}
              {/* Top Left */}
              <div className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#ae2e24] via-[#7d140e] to-[#420603] border border-[#520905] shadow-[1px_1px_4px_rgba(0,0,0,0.5)] flex items-center justify-center z-40 select-none pointer-events-none transition-transform duration-300">
                <div className="absolute inset-[1.5px] rounded-full border border-white/10 [box-shadow:inset_0.5px_0.5px_2px_rgba(255,255,255,0.2)]"></div>
                <span className="text-[5px] text-amber-100 font-bold tracking-tighter opacity-85 select-none relative -top-[0.5px]">✦</span>
              </div>
              {/* Top Right */}
              <div className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#ae2e24] via-[#7d140e] to-[#420603] border border-[#520905] shadow-[1px_1px_4px_rgba(0,0,0,0.5)] flex items-center justify-center z-40 select-none pointer-events-none transition-transform duration-300">
                <div className="absolute inset-[1.5px] rounded-full border border-white/10 [box-shadow:inset_0.5px_0.5px_2px_rgba(255,255,255,0.2)]"></div>
                <span className="text-[5px] text-amber-100 font-bold tracking-tighter opacity-85 select-none relative -top-[0.5px]">IM</span>
              </div>
              {/* Bottom Left */}
              <div className="absolute -bottom-2.5 -left-2.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#ae2e24] via-[#7d140e] to-[#420603] border border-[#520905] shadow-[1px_1px_4px_rgba(0,0,0,0.5)] flex items-center justify-center z-40 select-none pointer-events-none transition-transform duration-300">
                <div className="absolute inset-[1.5px] rounded-full border border-white/10 [box-shadow:inset_0.5px_0.5px_2px_rgba(255,255,255,0.2)]"></div>
                <span className="text-[5px] text-amber-100 font-bold tracking-tighter opacity-85 select-none relative -top-[0.5px]">C</span>
              </div>
              {/* Bottom Right */}
              <div className="absolute -bottom-2.5 -right-2.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#ae2e24] via-[#7d140e] to-[#420603] border border-[#520905] shadow-[1px_1px_4px_rgba(0,0,0,0.5)] flex items-center justify-center z-40 select-none pointer-events-none transition-transform duration-300">
                <div className="absolute inset-[1.5px] rounded-full border border-white/10 [box-shadow:inset_0.5px_0.5px_2px_rgba(255,255,255,0.2)]"></div>
                <span className="text-[5px] text-amber-100 font-bold tracking-tighter opacity-85 select-none relative -top-[0.5px]">S</span>
              </div>

              {/* Inner wrapper to hide content while collapsed, preventing text overflow */}
              <div className="w-full h-full overflow-hidden relative">
                {/* Header that always stays visible */}
                <div className="flex justify-between items-center border-b border-vintage-gold/25 pb-0.5 select-none">
                  <span className="font-bold sans-imperial text-[8px] tracking-wider text-center w-full block">
                    {isLegendHovered 
                      ? (activeSection === "india" ? "CHART OF HINDOOSTAN" : "CARTOGRAPHIA GENERALIS")
                      : "✦ CHART LEGEND ✦"
                    }
                  </span>
                </div>

                {/* Collapsed indicator hint */}
                {!isLegendHovered && (
                  <div className="text-[7.5px] sans-imperial text-[#8a6c31] text-center mt-0.5 animate-pulse select-none font-bold">
                    Hover to Unroll
                  </div>
                )}

                {/* Revealable Legend Entries */}
                <motion.div 
                  className="mt-1.5 space-y-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLegendHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isLegendHovered && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-800 border border-slate-900 inline-block shrink-0"></span>
                        <span className="text-[9.5px]">Royal Cities & Citadels</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-cyan-700 inline-block shrink-0"></span>
                        <span className="text-[9.5px]">Major Watershed Rivers</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1 bg-amber-500/30 border border-amber-600/50 skew-x-12 inline-block shrink-0"></span>
                        <span className="text-[9.5px]">High Uplands & Deserts</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5 border-t border-vintage-gold/10">
                        <span className="text-vintage-gold font-bold text-[8px]">✦</span>
                        <span className="italic text-[8.5px] text-zinc-600">Click map to inspect template</span>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Map compass overlay bottom left */}
            <div className="absolute bottom-4 left-4 z-30 opacity-75 pointer-events-none select-none max-w-[80px] md:max-w-[100px]">
              <svg viewBox="0 0 100 100" className="w-full text-vintage-bronze animate-spin-slow">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Wind lines */}
                <path d="M 50 2 L 50 98 M 2 50 L 98 50 M 16 16 L 84 84 M 16 84 L 84 16" stroke="currentColor" strokeWidth="0.5" />
                {/* Points */}
                <polygon points="50,10 54,46 50,50 46,46" fill="#8a6c31" />
                <polygon points="50,90 54,54 50,50 46,54" fill="#a63f3f" />
                <polygon points="10,50 46,46 50,50 46,54" fill="#8a6c31" />
                <polygon points="90,50 54,46 50,50 54,54" fill="#8a6c31" />
                {/* Text letters */}
                <text x="47" y="18" className="sans-imperial text-[8px]" fill="#a63f3f">N</text>
                <text x="47" y="93" className="sans-imperial text-[8px]" fill="#2b241a">S</text>
                <text x="80" y="53" className="sans-imperial text-[8px]" fill="#2b241a">E</text>
                <text x="12" y="53" className="sans-imperial text-[8px]" fill="#2b241a">W</text>
              </svg>
            </div>

             {/* Real Interactive Leaflet Map Container */}
            <div className="w-full h-full relative z-10 flex-1 flex flex-col">
              <div
                id="imperial-map-stage"
                ref={mapContainerRef}
                className="w-full h-full min-h-[300px] md:min-h-[420px] text-charcoal-ink leaflet-vintage-container cursor-crosshair"
              />
              {/* Genuine Royal Map parchment overlay blend */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-25 z-20"
                style={{
                  backgroundImage: "url('/src/assets/images/aged_parchment_1779541972455.png')",
                  backgroundSize: "cover",
                }}
              />
            </div>

            {/* Bottom Coordinate Tracking Status Bar */}
            <div className="bg-[#24180d] text-vintage-gold px-3 py-1 text-[11px] sans-imperial flex justify-between items-center select-none border-t border-[#3e2917] rounded-b">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Navigational Compass Caliper: </span>
                <span className="text-amber-100 font-bold ml-1">{cursorCoordinates}</span>
              </div>
              <div className="text-amber-100/60 hidden sm:block">
                <span>Mercator Projection System v4.1</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Location Drawer */}
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="sans-imperial text-xs text-vintage-gold font-bold mb-2 tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Imperial Landmark Index ({presetsToShow.length})</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presetsToShow.map((item) => {
                  const isSelected = selectedLocation?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectLocation(item)}
                      type="button"
                      className={`text-left px-2 py-1.5 rounded border text-[10px] md:text-xs serif-vintage flex flex-col justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#612117] text-white border-yellow-600/50"
                          : "bg-[#1a0f08] text-amber-100/80 border-vintage-gold/10 hover:bg-[#2e1d12] hover:text-amber-100"
                      }`}
                    >
                      <div className="font-bold truncate">{item.name}</div>
                      <div className={`text-[8px] capitalize sans-imperial ${isSelected ? "text-amber-200" : "text-vintage-gold/70"}`}>
                        {item.category} • {item.coordinatesStr.split(" / ")[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dedicated Rivers Drawer when in Rivers & Ridges View */}
            {activeSubSection === "terrain" && (
              <div className="border-t border-[#4d321d] pt-3 animate-fadeIn">
                <h4 className="sans-imperial text-[10.5px] text-cyan-400 font-extrabold mb-2 tracking-widest flex items-center gap-1.5">
                  <span className="animate-pulse">✦</span>
                  <span>MAJOR UPSC RIVERS & HYDROLOGY SYSTEMS ({RIVERS_DATA.filter(r => r.section === activeSection).length})</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {RIVERS_DATA.filter(r => r.section === activeSection).map((river) => {
                    const isSelected = selectedRiver?.id === river.id;
                    return (
                      <button
                        key={river.id}
                        onClick={() => handleSelectRiver(river)}
                        type="button"
                        className={`text-left px-2 py-1.5 rounded border text-[10px] md:text-xs serif-vintage flex flex-col justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#0c405c] text-white border-cyan-500/50 shadow-md"
                            : "bg-[#0b141a] text-cyan-100/70 border-cyan-900/30 hover:bg-[#162730] hover:text-cyan-100"
                        }`}
                      >
                        <div className="font-bold truncate text-[11px]">{river.name}</div>
                        <div className={`text-[8px] uppercase font-mono ${isSelected ? "text-cyan-300" : "text-cyan-500"}`}>
                          {river.length} • {river.statesOrCountriesDirect.length} Zones
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Expedition Custom Search forms */}
          <div className="mt-4 border-t border-[#4d321d] pt-3">
            <form onSubmit={handleGeographicalSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2 w-4 h-4 text-vintage-gold/50" />
                <input
                  type="text"
                  placeholder="Enter custom historical site/region name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#170e08] border border-vintage-gold/30 rounded pl-9 pr-3 py-1.5 text-xs text-amber-100 placeholder-vintage-gold/40 focus:outline-none focus:border-vintage-gold"
                />
              </div>
              <button
                type="submit"
                className="bg-[#6b471a] hover:bg-[#855c27] text-amber-100 text-xs px-4 py-1.5 rounded sans-imperial font-bold tracking-wider cursor-pointer border border-[#8a6021] transition-colors"
              >
                Dispatch
              </button>
            </form>
            {searchFeedback && (
              <p className="text-[10px] italic text-vintage-gold font-light mt-1 pl-1">
                {searchFeedback}
              </p>
            )}
          </div>

        </section>

        {/* Right Side: Geopolitical Chronicle Notebook Scroll (Cols: 4) */}
        <section id="scholarly-ledger-journal" className="lg:col-span-4 flex flex-col justify-between bg-[#fbf5e6] text-[#2b241a] p-4 md:p-6 rounded-lg shadow-2xl parchment-texture ornamental-border relative min-h-[500px]">
          
          {/* Inner Ledger Frame Border */}
          <div className="absolute inset-2 pointer-events-none border border-[#8a6c31]/30 rounded"></div>

          {isChroniclerLoading ? (
            // Full Royal Chronicles Loading Stage
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center z-20">
              <div className="relative mb-5">
                <Loader2 className="w-12 h-12 text-[#99261a] animate-spin" />
                <Compass className="w-6 h-6 text-vintage-gold absolute top-3 left-3 animate-pulse" />
              </div>

              {/* Dynamic chronicler messages */}
              <h2 className="sans-imperial text-sm font-bold text-[#822115] tracking-widest animate-pulse">
                CONSULTING THE IMPERIAL LEDGERS...
              </h2>
              <p className="serif-vintage italic text-xs text-amber-900/80 max-w-xs mt-3 leading-relaxed">
                "Our royal couriers traverse the winds, deciphering faded scrolls, tracing peninsular mountains, and outlining maritime boundaries."
              </p>
              
              <div className="mt-8 space-y-1.5 w-full max-w-xs text-left">
                <div className="text-[9px] sans-imperial text-amber-800/80 flex justify-between border-b border-vintage-gold/15 pb-0.5">
                  <span>Target Coordinate:</span>
                  <span className="font-mono">{selectedLocation?.coordinatesStr || cursorCoordinates}</span>
                </div>
                <div className="text-[9px] sans-imperial text-amber-800/80 flex justify-between border-b border-vintage-gold/15 pb-0.5">
                  <span>Translative Index:</span>
                  <span>18th Century Scholarly Ledger</span>
                </div>
                <div className="text-[9px] sans-imperial text-[#99261a] italic text-center w-full animate-bounce pt-2">
                  Powered by Royal Gemini Intelligence.
                </div>
              </div>
            </div>
          ) : chroniclerError ? (
            // Error handling state
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-20">
              <Shield className="w-10 h-10 text-red-800 mb-3" />
              <h3 className="sans-imperial text-sm font-bold text-red-900">ARCHIVE REACH LOST</h3>
              <p className="serif-vintage text-xs text-red-950/80 mt-1 max-w-xs">
                {chroniclerError === "The imperial dispatch could not navigate past current ocean winds."
                  ? "The Gemini cartographer is busy drafting regional maps. Try clicking another point upon the parchment to retry."
                  : chroniclerError}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (selectedLocation) handleSelectLocation(selectedLocation);
                  else if (customMarker) {
                    fetchScholarReport(
                      "", 
                      customMarker.coordsStr, 
                      activeSubSection,
                      "Retry cartographer inspect",
                      activeSection
                    );
                  }
                }}
                className="mt-4 bg-[#8a2115] text-amber-100 text-[10px] tracking-wider sans-imperial px-4 py-1.5 rounded cursor-pointer border border-[#b53a2b]"
              >
                Resend Courier
              </button>
            </div>
          ) : currentReport ? (
            // The Rich Scholar’s Scroll Ledger Details
            <div className="flex-1 flex flex-col justify-between z-20 overflow-y-auto pr-1">
              
              {/* Cartographic society ledger classification watermark */}
              <div className="flex flex-col items-center gap-2 mb-4 w-full select-none">
                <div className="flex items-center justify-center gap-1.5 py-1 px-2.5 rounded bg-[#f5e9ce]/40 border border-[#8a6c31]/10 max-w-max mx-auto text-[8.5px] text-[#a63f3f]/80 font-mono tracking-widest uppercase font-medium shadow-sm">
                  <Compass className={`w-3 h-3 text-[#a63f3f] ${isOfflineVault ? "" : "animate-pulse"}`} />
                  <span>{currentReport.systemMessage || "Sovereign Scroll Vaults Ledger Entry"}</span>
                </div>
                {isOfflineVault && (
                  <div className="text-[10px] bg-[#fdf5df] border border-[#d6be85]/60 text-[#7a5c21] p-3 rounded-lg w-full text-center serif-vintage shadow-inner leading-relaxed">
                    <span className="font-bold uppercase tracking-wider sans-imperial text-[8.5px] text-[#99261a] block mb-1">
                      ⚠️ GUILD OF SCHOLARS DIRECTIVE
                    </span>
                    The celestial Gemini AI agency is experiencing heavy sea storms (quota constraints or high traffic). 
                    <strong className="block mt-1 text-[#8c2317]">No alarm is warranted! Our local scroll library remains fully active and is serving pristine UPSC syllabus datasets.</strong>
                  </div>
                )}
              </div>

              {/* Scroll Header */}
              <div className="border-b-2 border-double border-[#8a6c31]/50 pb-3 mb-4 text-center">
                
                {/* Visual Category Badge Icon */}
                <div className="mx-auto w-10 h-10 rounded-full bg-[#ebdcb2] border border-[#8a6c31]/40 flex items-center justify-center shadow-inner mb-2">
                  {selectedLocation?.category === "mountain" || activeSubSection === "terrain" ? (
                    <Mountain className="w-5 h-5 text-[#3b6b4c]" />
                  ) : selectedLocation?.category === "river" ? (
                    <Waves className="w-5 h-5 text-cyan-800" />
                  ) : selectedLocation?.category === "fort" ? (
                    <Shield className="w-5 h-5 text-[#a63f3f]" />
                  ) : (
                    <Feather className="w-5 h-5 text-vintage-bronze" />
                  )}
                </div>

                {/* Subtitle / Archetype Category */}
                <span className="sans-imperial text-[9px] uppercase tracking-widest text-[#a63f3f] font-bold">
                  {currentReport.archetype || selectedLocation?.subCategoryText || "Geographic Topography"}
                </span>

                {/* Title */}
                <h2 className="sans-imperial font-extrabold text-lg md:text-xl text-[#2b241a] leading-tight my-1 select-text">
                  {currentReport.title || currentReport.locationName || selectedLocation?.name}
                </h2>

                {/* Coordinates Maritime Notation */}
                <span className="mono-maritime text-[10px] px-2 py-0.5 rounded bg-[#ebdcb2]/40 border border-[#8a6c31]/25 text-amber-950 font-bold select-text">
                  {currentReport.coordinates || selectedLocation?.coordinatesStr}
                </span>

              </div>

              {/* Scroll Narrative Section */}
              <div className="space-y-4 text-xs select-text">
                
                {/* Poetic Lore */}
                <div className="bg-[#f2eacb]/40 border-l-4 border-[#8a6c31] p-3 rounded italic serif-vintage text-amber-950/90 leading-relaxed text-[13px] relative shadow-inner">
                  <span className="text-3xl text-vintage-gold/50 font-serif absolute -top-1 left-1 pointer-events-none">“</span>
                  <div className="pl-3">{currentReport.poeticDescription}</div>
                </div>

                {/* Topographical Importance */}
                <div className="space-y-1">
                  <h4 className="sans-imperial text-[10px] font-bold tracking-wider text-[#99261a] border-b border-[#8a6c31]/20 pb-0.5 uppercase flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-vintage-bronze" />
                    <span>Strategic Prominence & Geopolitics</span>
                  </h4>
                  <p className="serif-vintage leading-relaxed text-[12px] text-charcoal-ink pl-1">
                    {currentReport.importance}
                  </p>
                </div>

                {/* Surrounding topological associations */}
                <div className="bg-[#ebdcb2]/20 border border-[#8a6c31]/20 p-2.5 rounded text-[11px] grid grid-cols-1 gap-2">
                  <div className="font-bold sans-imperial text-[9px] text-[#8a6c31] border-b border-[#8a6c31]/10 pb-0.5 flex justify-between items-center">
                    <span>TOPOGRAPHICAL SYSTEM DETAILS</span>
                    <Waves className="w-3.5 h-3.5" />
                  </div>
                  
                  <div className="space-y-1">
                    {currentReport.associatedFeatures.rivers && (
                      <div className="flex gap-1 items-start">
                        <span className="text-[#0d7685] font-bold">~</span>
                        <span><strong>Watersheds & Hydrology:</strong> {currentReport.associatedFeatures.rivers}</span>
                      </div>
                    )}
                    {currentReport.associatedFeatures.mountains && (
                      <div className="flex gap-1 items-start">
                        <span className="text-[#3b6b4c] font-bold">^</span>
                        <span><strong>Ridges & Elevations:</strong> {currentReport.associatedFeatures.mountains}</span>
                      </div>
                    )}
                    {currentReport.associatedFeatures.surroundingPlains && (
                      <div className="flex gap-1 items-start">
                        <span className="text-vintage-bronze font-bold">*</span>
                        <span><strong>Terrain & Basins:</strong> {currentReport.associatedFeatures.surroundingPlains}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Historical Timeline */}
                {currentReport.timeline && currentReport.timeline.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <h4 className="sans-imperial text-[10px] font-bold tracking-wider text-[#99261a] border-b border-[#8a6c31]/20 pb-0.5 uppercase flex items-center gap-1">
                      <ScrollIcon className="w-3.5 h-3.5 text-vintage-bronze" />
                      <span>The Historical Chronicle Lines</span>
                    </h4>
                    
                    <div className="relative border-l border-[#8a6c31]/30 pl-3.5 ml-1.5 space-y-3 pt-1">
                      {currentReport.timeline.map((eventObj, idx) => (
                        <div key={idx} className="relative group/time">
                          {/* Circle dot on vertical lines */}
                          <div className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 rounded-full border border-[#8a6c31] bg-parchment-light shadow-sm flex items-center justify-center">
                            <div className="w-1 h-1 bg-[#822115] rounded-full scale-100 group-hover/time:scale-115 transition-transform"></div>
                          </div>
                          
                          <div className="sans-imperial text-[9px] text-[#a63f3f] font-semibold tracking-wider">
                            {eventObj.era}
                          </div>
                          <div className="serif-vintage text-[11.5px] text-charcoal-ink mt-0.5 leading-relaxed">
                            {eventObj.event}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* UPSC Civil Services Examination (Prelims & Mains) Prep Outpost */}
                <div className="bg-[#edd6b1]/30 border-2 border-[#99261a]/35 p-3.5 rounded-lg shadow-sm relative overflow-hidden select-text text-[#2b241a] my-2">
                  {/* Subtle landmark emblem background */}
                  <div className="absolute right-0 bottom-0 opacity-[0.06] text-[#8a2115] pointer-events-none select-none">
                    <Landmark className="w-24 h-24" />
                  </div>
                  
                  {/* UPSC Section Badge/Header */}
                  <div className="flex items-center gap-2 border-b border-[#8a2115]/25 pb-1.5 mb-2.5">
                    <BookOpen className="w-4 h-4 text-[#8a2115]" />
                    <span className="sans-imperial text-[10px] sm:text-xs font-bold tracking-widest text-[#8a2115] uppercase">
                      🎓 UPSC CSE Syllabus Corner
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* UPSC Prelims GS Paper I Section */}
                    {currentReport.upscPrelims && (
                      <div className="space-y-1">
                        <span className="sans-imperial text-[9px] tracking-wider font-extrabold text-[#7c5d26] block uppercase flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-[#7c5d26]" />
                          Prelims Core Focus (GS-I)
                        </span>
                        <div className="serif-vintage text-[11.5px] leading-relaxed text-charcoal-ink pl-1 whitespace-pre-line space-y-1">
                          {currentReport.upscPrelims}
                        </div>
                      </div>
                    )}

                    {/* UPSC Mains GS Paper I & III Section */}
                    {currentReport.upscMains && (
                      <div className="space-y-1 pt-1.5 border-t border-[#8a6c31]/15">
                        <span className="sans-imperial text-[9px] tracking-wider font-extrabold text-[#7c5d26] block uppercase flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#7c5d26]" />
                          Mains Critical Analysis Outline
                        </span>
                        <p className="serif-vintage text-[11.5px] leading-relaxed text-charcoal-ink pl-1">
                          {currentReport.upscMains}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Folklore / Secrets footnote */}
                {currentReport.trivia && (
                  <div className="bg-[#eedcaf]/20 border border-dashed border-[#8a6c31]/40 p-3 rounded mt-2 text-[#473b2b] select-text">
                    <span className="sans-imperial text-[9px] tracking-wider font-extrabold text-[#7c5d26] block mb-0.5 uppercase">
                      ⚓ Ancient Mariner Folklore & Speculations
                    </span>
                    <p className="serif-vintage text-[11px] leading-relaxed italic pl-1">
                      "{currentReport.trivia}"
                    </p>
                  </div>
                )}

              </div>

              {/* Ledger Action Buttons (Inscribe to expedition log) */}
              <div className="border-t border-[#8a6c31]/30 pt-3 mt-4 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={inscribeToJournal}
                    type="button"
                    className="flex-1 bg-[#8a2b24] hover:bg-[#a6342b] text-white py-2 px-3 rounded text-xs sans-imperial tracking-widest font-bold flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer border border-yellow-700/25"
                  >
                    <FolderHeart className="w-4 h-4" />
                    <span>Inscribe into Journal Log</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedLocation) handleSelectLocation(selectedLocation);
                      else if (customMarker) {
                        fetchScholarReport(
                          "", 
                          customMarker.coordsStr, 
                          activeSubSection,
                          "User requests fresh chronicler survey",
                          activeSection
                        );
                      }
                    }}
                    className="bg-[#241a10] hover:bg-[#34271c] text-vintage-gold py-2 px-3 rounded text-xs sans-imperial tracking-wider border border-vintage-gold/30 cursor-pointer flex items-center justify-center"
                    title="Request another scholarly revision from Gemini"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                {/* Journal State Log Feedback */}
                {journalFeedback && (
                  <p className="text-[10px] text-[#8a2b24] italic font-semibold text-center select-none animate-pulse">
                    ✦ {journalFeedback}
                  </p>
                )}

                {/* Elaboration Instruction Prompt bar (AI Prompt) */}
                <div className="space-y-1">
                  <form onSubmit={handleScholarElaborate} className="flex gap-1.5 bg-parchment-light/80 p-2.5 rounded border border-[#8a6c31]/30">
                    <div className="flex-1 flex flex-col justify-center">
                      <label className="sans-imperial text-[8px] font-extrabold tracking-widest text-[#a63f3f] mb-1">
                        INSTRUCT CONTINUES EXPLORATION IN THIS ZONE
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Examine bronze age gold mines, local wars..."
                        value={followUpPrompt}
                        onChange={(e) => setFollowUpPrompt(e.target.value)}
                        disabled={isElaborating}
                        className="bg-transparent border-b border-[#8a6c31]/30 text-xs italic text-[#2d2217] placeholder-vintage-gold/80 focus:outline-none focus:border-[#a63f3f] py-0.5"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isElaborating || !followUpPrompt.trim()}
                      className="bg-[#8a6c31] text-amber-100 p-2 rounded shadow flex items-center justify-center cursor-pointer hover:bg-[#6e5525] disabled:opacity-40 transition-colors"
                    >
                      {isElaborating ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </form>
                  {elaborationError && (
                    <p className="text-[10px] text-[#a63f3f] italic font-semibold pl-1 select-none">
                      ⚠️ {elaborationError}
                    </p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            // No focused point selected (Intro Cover Page)
            <div className="flex-1 flex flex-col justify-between z-20 h-full py-6 text-center select-none">
              
              <div className="border-b border-[#8a6c31]/20 pb-4 mb-4">
                <span className="sans-imperial text-[10px] text-[#a63f3f] tracking-widest font-extrabold">IMPERIAL ACADEMY SURVEY JOURNAL</span>
                <h2 className="title-royal sans-imperial font-extrabold text-2xl text-[#2b241a] mt-1">THE MAGNUS ATLAS</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#8a6c31] to-transparent mx-auto mt-2"></div>
              </div>

              <div className="space-y-4 my-auto relative">
                
                {/* Visual Quill Graphic placeholder */}
                <div className="mx-auto w-16 h-16 rounded-full bg-[#ebdcb2]/40 border border-[#8a6c31]/30 flex items-center justify-center">
                  <ScrollIcon className="w-8 h-8 text-[#8a6c31]" />
                </div>

                <div className="serif-vintage italic text-amber-950/80 leading-relaxed text-[13px] px-2 max-w-sm mx-auto">
                  "Herein contain the hand-drawn coordinates of coastal harbors, towering mountain ridges, navigable river systems, and political fiefdoms in both Hindoostan and the wider spheres."
                </div>
                
                <p className="sans-imperial text-[9px] tracking-wider text-[#a63f3f] font-semibold bg-[#ebdcb2]/30 border border-double border-[#8a6c31]/30 py-2.5 px-4 rounded max-w-xs mx-auto">
                  ✦ CLICK ANY CORNER OF THE ANTEBELLUM MAP PARCHMENT OR CHOOSE AN INDEX TO UNLOCK THE HISTORIC CHRONICLES. ✦
                </p>

              </div>

              {/* Quote Footer lines */}
              <div className="border-t border-[#8a6c31]/20 pt-4 mt-4">
                <p className="serif-vintage text-[11px] italic text-[#6e5c43] select-text">
                  "To map is to conquer the passage of time itself." ~ Cartographer Royal
                </p>
                <div className="text-[8px] sans-imperial text-amber-900/60 uppercase mt-2">
                  Commissioned under Privy Council Authority
                </div>
              </div>

            </div>
          )}

        </section>

      </main>

      {/* Expanded bottom layout: My Expedition journal Log (Custom persistence tracking) */}
      <footer className="z-20 w-full max-w-[1600px] mx-auto mt-6 bg-[#26150b] border border-[#4d321d] p-4 rounded-lg shadow-xl relative">
        <div className="flex items-center justify-between border-b border-[#4d321d] pb-2 mb-3">
          <h3 className="sans-imperial text-xs text-vintage-gold font-bold tracking-widest flex items-center gap-2">
            <FolderHeart className="w-4 h-4 text-red-600 animate-pulse" />
            <span>My Exploration Ledger Log ({expeditionJournal.length} Records)</span>
          </h3>
          <span className="serif-vintage italic text-[10px] text-amber-100/50">Stored in temporary cabinet memory</span>
        </div>

        {expeditionJournal.length === 0 ? (
          <p className="serif-vintage text-xs italic text-amber-100/50 text-center py-6">
            "Your expedition journal remains leaf-less. Inscribe items from the chronicle ledger to build your personalized travel records."
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {expeditionJournal.map((journalObj, idx) => (
              <div 
                key={idx} 
                className="bg-[#faf4e0] text-[#2d2417] p-3 rounded-lg border border-[#8a6c31]/30 relative flex flex-col justify-between hover:border-yellow-600 transition-colors"
              >
                {/* Delete button from journal */}
                <button
                  onClick={() => deleteFromJournal(journalObj.locationName)}
                  type="button"
                  className="absolute top-2.5 right-2.5 text-red-900/60 hover:text-red-900 transition-colors cursor-pointer"
                  title="Expurgate from journal logs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Log Header */}
                <div className="pr-5">
                  <span className="sans-imperial text-[8px] text-[#a63f3f] font-bold block select-none uppercase truncate">
                    {journalObj.archetype}
                  </span>
                  <h4 className="sans-imperial font-bold text-xs select-text line-clamp-1">
                    {journalObj.locationName}
                  </h4>
                  <div className="mono-maritime text-[8px] font-semibold text-amber-950 mt-0.5">
                    {journalObj.coordinates}
                  </div>
                </div>

                {/* Log snippet */}
                <p className="serif-vintage text-[11px] text-charcoal-ink/90 mt-2 line-clamp-2 select-text italic">
                  "{journalObj.poeticDescription}"
                </p>

                {/* Bottom re-align action button */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentReport(journalObj);
                    playVintageSound("click");
                    
                    // Match to section if available
                    const matchLoc = [...INDIA_LOCATIONS, ...WORLD_LOCATIONS].find(
                      loc => loc.name === journalObj.locationName
                    );

                    if (matchLoc) {
                      setCaliperPosition({ x: matchLoc.x, y: matchLoc.y });
                    }
                  }}
                  className="mt-3 text-left sans-imperial font-bold text-[9px] text-[#8a6c31] hover:text-[#a63f3f] transition-colors uppercase flex items-center gap-0.5"
                >
                  <span>Inscribe focus alignment</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </footer>

      {/* Standard legal credit notice at the absolute base */}
      <footer className="z-20 text-center text-[10px] text-vintage-gold/40 mt-6 select-none border-t border-[#341e0d] pt-3 flex flex-col sm:flex-row justify-between gap-1 items-center max-w-[1600px] mx-auto w-full">
        <p className="sans-imperial">Imperial Cartography Society • Privileged Access</p>
        <p className="serif-vintage italic">"Delineated, engraved and published conforming to scientific regulations."</p>
      </footer>

    </div>
  );
}
