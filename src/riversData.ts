export interface RiverData {
  id: string;
  name: string;
  section: "india" | "world";
  path: [number, number][]; // Line coordinates [Lat, Lng]
  origin: string;
  length: string;
  statesOrCountriesDirect: string[];
  upscPrelimsBrief: string;
  upscMainsBrief: string;
  tributariesLeft: string[];
  tributariesRight: string[];
  majorDamsProjects: string[];
  historicSignificance: string;
}

export const RIVERS_DATA: RiverData[] = [
  {
    id: "ganges",
    name: "Sacred Ganga",
    section: "india",
    path: [
      [30.99, 78.93], // Gangotri source
      [30.15, 78.60], // Devprayag
      [29.94, 78.16], // Haridwar
      [26.44, 80.33], // Kanpur
      [25.43, 81.88], // Prayagraj (Confluence with Yamuna)
      [25.31, 83.00], // Varanasi
      [25.59, 85.13], // Patna
      [24.80, 87.90], // Farakka Barrage
      [23.80, 89.40], // Padma passage
      [22.40, 90.10]  // Bay of Bengal mouth
    ],
    origin: "Gangotri Glacier (at Gaumukh, Bhagirathi River), Uttarakhand",
    length: "2,525 km",
    statesOrCountriesDirect: ["Uttarakhand", "Uttar Pradesh", "Bihar", "West Bengal", "Bangladesh (as Padma)"],
    tributariesLeft: ["Ramganga", "Gomti", "Ghaghara", "Gandak", "Bagmati", "Kosi", "Mahananda"],
    tributariesRight: ["Yamuna", "Son", "Punpun", "Damodar"],
    majorDamsProjects: ["Tehri Dam (on Bhagirathi)", "Farakka Barrage", "Haridwar Barrage"],
    historicSignificance: "Celebrated in Vedic literature as Goddess Ganga. It nurtured central ancient empires like Brihadrathas, Mauryas, Guptas, and Bengalian Palas. It flows past Varanasi, one of the oldest constantly inhabited cities globally.",
    upscPrelimsBrief: "Ganga forms at Devprayag where Bhagirathi meets Alaknanda. Key holy confluences (Panch Prayag) reside upstream. Enters plains at Haridwar. High biodiversity supports the National Aquatic Animal, the Ganges River Dolphin. National Waterway 1 (NW-1) spans between Prayagraj and Haldia.",
    upscMainsBrief: "Central to Northern India's agricultural security and food base (Ganga Plains). Core issues encompass severe pollution loads (Namami Gange program), industrial effluent, over-extraction for irrigation, climate-stressed glaciers, and complex transboundary water management disputes with Bangladesh over Farakka."
  },
  {
    id: "indus",
    name: "Mighty Indus",
    section: "india",
    path: [
      [31.25, 81.30], // Mount Kailash Source
      [32.85, 79.15], // Demchok Entry
      [34.15, 77.57], // Leh
      [34.60, 76.10], // Kargil/Batalik sector
      [35.40, 74.30], // Gilgit bend
      [34.00, 72.20], // Attock plain entry
      [32.90, 71.50], // Mianwali
      [28.93, 70.47], // Mithankot (Panjnad)
      [25.37, 68.37], // Hyderabad (Sindh)
      [23.90, 67.45]  // Arabian Sea Delta
    ],
    origin: "Sengge Zangbo Glacier near Mount Kailash & Lake Manasarovar, Tibet",
    length: "3,180 km",
    statesOrCountriesDirect: ["China (Tibet)", "India (Ladakh UT)", "Pakistan (Khyber Pakhtunkhwa, Punjab, Sindh)"],
    tributariesLeft: ["Zanskar River", "Suru", "Jhelum", "Chenab", "Ravi", "Beas", "Sutlej (confluence Panjnad)"],
    tributariesRight: ["Shyok", "Gilgit", "Kabul", "Kurram", "Gomal"],
    majorDamsProjects: ["Tarbela Dam (Pakistan)", "Nimoo Bazgo Project (Ladakh)", "Chutak Hydel Project (Suru River)", "Diau Hydroelectric station"],
    historicSignificance: "Linguistic origin of the names 'Sindhu', 'Indus', and 'India'. Hosted the oldest Urban Civilization in South Asia—The Indus Valley Civilization (Harappa, Mohenjo-daro).",
    upscPrelimsBrief: "Enters India at Demchok, flows northwest between the Ladakh and Karakoram ranges. Flows only through the Union Territory of Ladakh in India. Regulated by the historic Indus Water Treaty (1960)—India holds rights over Eastern rivers (Ravi, Beas, Sutlej), Pakistan over Western rivers (Indus, Jhelum, Chenab).",
    upscMainsBrief: "Served as a geopolitical hydro-dispute anchor. Highlights the success of the Indus Water Treaty as it survived three Indo-Pak wars. Modern concerns include rapid glacier retreat from Himalayan warming, river siltation, delta salinity ingress, and cross-border hydropower diplomatic friction."
  },
  {
    id: "brahmaputra",
    name: "Brahmaputra",
    section: "india",
    path: [
      [29.20, 84.10], // Tibet Source (Yarlung Tsangpo)
      [29.25, 89.20], // Shigatse
      [29.30, 91.10], // Lhasa southern flow
      [29.80, 94.10], // Nyingchi bend
      [29.60, 95.10], // Great Bend (Namcha Barwa Gorge)
      [28.06, 95.33], // Pasighat (Arunachal plains)
      [27.48, 94.90], // Dibrugarh
      [26.18, 91.74], // Guwahati
      [25.98, 89.97], // Dhubri (leaving India)
      [23.85, 89.80], // Jamuna (Bangladesh)
      [22.80, 90.60]  // Meghna estuary / Ganges delta
    ],
    origin: "Chemayungdung Glacier near Lake Manasarovar, Tibet",
    length: "2,900 km",
    statesOrCountriesDirect: ["China (Tibet)", "India (Arunachal Pradesh, Assam)", "Bangladesh (as Jamuna)"],
    tributariesLeft: ["Dibang", "Lohit", "Dhansiri", "Kolong", "Dihing"],
    tributariesRight: ["Subansiri", "Kameng", "Manas", "Sankosh", "Teesta"],
    majorDamsProjects: ["Zangmu Dam (Tibet)", "Ranganadi Hydroelectric Project (Arunachal)", "Kopili Dam", "National Waterway 2 (NW-2 from Sadiya to Dhubri)"],
    historicSignificance: "Mythological 'Son of Brahma'. The brave Ahoms successfully fortified the Brahmaputra banks to decisively defeat the Mughal forces in the Battle of Saraighat (1671).",
    upscPrelimsBrief: "Known as Tsangpo in Tibet, Dihang or Siang in Arunachal Pradesh, Brahmaputra in Assam, and Jamuna in Bangladesh. Confluence of Dihang, Dibang, and Lohit in Assam forms the Brahmaputra. Hosts the largest river island, Majuli, and Kaziranga National Park.",
    upscMainsBrief: "Assam's cyclical flooding and river bank erosion cycle. Extremely high sediment yield and tectonic seismicity make structural embankments vulnerable. Chinese construction of run-of-the-river dams in Tibet creates high tension regarding riparian data flows, sudden flash flood discharges, and ecological river-health degradation."
  },
  {
    id: "godavari",
    name: "Dakshin Ganga (Godavari)",
    section: "india",
    path: [
      [19.93, 73.53], // Trimbakeshwar source (Nashik)
      [19.15, 77.30], // Nanded
      [18.96, 78.33], // Pochampad / Nizamabad
      [18.60, 79.90], // Kaleshwaram
      [17.67, 80.88], // Bhadrachalam
      [17.00, 81.78], // Rajahmundry
      [16.42, 82.00]  // Bay of Bengal delta mouth
    ],
    origin: "Trimbakeshwar Range in the Western Ghats, Nashik, Maharashtra",
    length: "1,465 km",
    statesOrCountriesDirect: ["Maharashtra", "Telangana", "Andhra Pradesh"],
    tributariesLeft: ["Darna", "Kadva", "Purna", "Pranhita (Penganga/Wardha/Wainganga)", "Indravati", "Sabari"],
    tributariesRight: ["Pravara", "Mula", "Manjra", "Peddavagu", "Kinnerasani"],
    majorDamsProjects: ["Polavaram Multipurpose Project (AP)", "Sriram Sagar Project (Pochampad)", "Jayakwadi Dam (Maharashtra)", "Kaleshwaram Lift Irrigation (World's Largest)"],
    historicSignificance: "Hosts Panchavati, the sacred spot where Lord Rama, Sita, and Lakshmana resided during their exile. Rests adjacent to ancient Satavahana capital sites like Paithan.",
    upscPrelimsBrief: "Largest Peninsular river basin in India. Also designated as 'Dakshin Ganga' or 'Vriddha Ganga.' Flows on a mature, gentle gradient across Deccan Plateau. Delta harbors the precious Coringa Mangroves (famous Ramsar site).",
    upscMainsBrief: "Inter-State water allocation conflicts. The Polavaram project acts as a major link facilitating Godavari-Krishna river water transfers but is plagued by tribal resettlement, forest drainage submergence, and environmental clearances. High water diversion raises stress on lower delta wetlands."
  },
  {
    id: "narmada",
    name: "Rift Narmada",
    section: "india",
    path: [
      [22.67, 81.75], // Amarkantak source
      [23.18, 79.93], // Jabalpur
      [22.80, 78.20], // Hoshangabad
      [22.25, 76.35], // Indira Sagar
      [22.18, 75.58], // Maheshwar
      [21.83, 73.75], // Sardar Sarovar
      [21.72, 72.97], // Bharuch
      [21.60, 72.50]  // Gulf of Khambhat mouth
    ],
    origin: "Amarkantak Plateau, Anuppur District, Madhya Pradesh",
    length: "1,312 km",
    statesOrCountriesDirect: ["Madhya Pradesh", "Maharashtra", "Gujarat"],
    tributariesLeft: ["Chhar", "Burner", "Banjar", "Sher", "Shakkar", "Dudhi", "Tawa", "Ganjal"],
    tributariesRight: ["Hiran", "Tendoni", "Barna", "Kolar", "Man", "Uri", "Hatni", "Orsang"],
    majorDamsProjects: ["Sardar Sarovar Dam (Gujarat)", "Indira Sagar Dam (MP)", "Omkareshwar Dam (MP)", "Maheshwar Dam"],
    historicSignificance: "The traditional boundary line separating Northern India from the Deccan plateau. Saw ancient armies clash, notably Chalukyan Pulakeshin II routing Harsha in 618 AD.",
    upscPrelimsBrief: "Flows westward through a tectonic rift valley bounded by Vindhyas in the North and Satpuras in the South. Originates from Amarkantak Hills (source of Son river too). Does not form a delta; forms a deep, biological estuary at Gulf of Khambhat. Forms Kapildhara & Dhuandhar Falls.",
    upscMainsBrief: "The core anchor of 'Narmada Bachao Andolan' led by Medha Patkar. Shows historical policy lessons in balancing mega-development (hydropower & irrigation canals for desert Gujarat) with local tribal dislocation, rehabilitate failures, and eco-conservation of pristine riverine valleys."
  },
  {
    id: "krishna",
    name: "Krishna River",
    section: "india",
    path: [
      [17.92, 73.65], // Mahabaleshwar
      [16.85, 74.58], // Sangli
      [16.33, 75.88], // Almatti Dam
      [16.20, 77.30], // Raichur doab boundary
      [16.08, 78.86], // Srisailam
      [16.58, 79.31], // Nagarjuna Sagar
      [16.51, 80.62], // Vijayawada
      [15.70, 80.90]  // Bay of Bengal (Hamsaladeevi mouth)
    ],
    origin: "Mahabaleshwar temple hills, Western Ghats, Maharashtra",
    length: "1,400 km",
    statesOrCountriesDirect: ["Maharashtra", "Karnataka", "Telangana", "Andhra Pradesh"],
    tributariesLeft: ["Bhima", "Dindi", "Paleru", "Musi (waters Hyderabad)", "Munneru"],
    tributariesRight: ["Koyna", "Panchganga", "Dudhganga", "Ghataprabha", "Malaprabha", "Tungabhadra"],
    majorDamsProjects: ["Nagarjuna Sagar Dam", "Srisailam Dam", "Almatti Dam (Lal Bahadur Shastri)", "Prakasam Barrage"],
    historicSignificance: "Sovereignty zone of early Satavahanas, Ikshvakus, and Vijayanagara empires. Hosted Nagarjunakonda, a historical learning epicenter for Buddhist scholars.",
    upscPrelimsBrief: "Second largest east-flowing Peninsular river. Bounded by Balaghat Range in the north. The rich delta blends with Godavari's delta creating the Kolleru Lake ecosystem. Tunghabhadra tributary joins Krishna near Alampur.",
    upscMainsBrief: "Subject to long-standing legal tussles under the Krishna Water Disputes Tribunal (KWDT). Suffers from dry seasons because of intensive paddy/sugar farming in upstream Maharashtra/Karnataka. Delta experiences compaction, sinking, and saltwater intrusion due to over-channeling."
  },

  // WORLD RIVERS
  {
    id: "nile",
    name: "Imperial Nile",
    section: "world",
    path: [
      [-0.50, 32.50], // Lake Victoria source (White Nile)
      [4.85, 31.58],  // Juba
      [9.50, 31.60],  // Malakal
      [15.60, 32.53], // Khartoum (Merger of White and Blue Nile)
      [19.10, 30.40], // Dongola
      [23.97, 32.88], // Aswan (Lake Nasser)
      [25.68, 32.65], // Luxor
      [30.04, 31.23], // Cairo
      [31.30, 30.50]  // Alexandria mouth (Mediterranean)
    ],
    origin: "Lake Victoria, Uganda (White Nile) & Lake Tana, Ethiopia (Blue Nile)",
    length: "6,650 km",
    statesOrCountriesDirect: ["Uganda", "South Sudan", "Sudan", "Egypt", "Ethiopia (Blue Nile portion)", "Rwanda", "Burundi", "Tanzania", "Kenya", "DR Congo", "Eritrea"],
    tributariesLeft: ["Bahr al-Ghazal"],
    tributariesRight: ["Sobat", "Blue Nile (Abay)", "Atbara"],
    majorDamsProjects: ["Aswan High Dam (Egypt)", "Grand Ethiopian Renaissance Dam (GERD - Ethiopia)", "Sennar Dam (Sudan)", "Roseires Dam"],
    historicSignificance: "Nurtured ancient Pharaonic Egypt. Herodotus recorded: 'Egypt is the gift of the Nile.' Crucial for agricultural cycles, papyrus, and navigation.",
    upscPrelimsBrief: "Longest river globally, flows northward across the Sahara. Blue Nile provides bulk of monsoon floodwaters (rich in silt), while White Nile serves as perennial flow. Delta is a archetypal classic Arcuate Delta on Mediterranean coast.",
    upscMainsBrief: "Grand Ethiopian Renaissance Dam (GERD) hydropolitics. Egypt views Nile waters as an existential security matrix. International treaties of 1929 and 1959 are contested by upstream East African states, calling for modern, cooperative multilateral arrangements."
  },
  {
    id: "amazon",
    name: "Great Amazon",
    section: "world",
    path: [
      [-15.50, -71.50], // Andes source
      [-12.30, -73.50], // Ucayali branch
      [-3.75, -73.25],  // Iquitos
      [-3.40, -65.10],  // Tefé
      [-3.10, -60.02],  // Manaus (Meeting of Waters)
      [-2.43, -54.72],  // Santarém
      [-0.10, -49.50]   // Macapá (Atlantic mouth)
    ],
    origin: "Glacial streams on Nevado Mismi peak (Andes Range), Peru",
    length: "6,400 km",
    statesOrCountriesDirect: ["Peru", "Colombia", "Brazil", "Bolivia", "Ecuador", "Venezuela"],
    tributariesLeft: ["Putumayo", "Japurá", "Rio Negro"],
    tributariesRight: ["Ucayali", "Juruá", "Purus", "Madeira", "Tapajós", "Xingu"],
    majorDamsProjects: ["Belo Monte Dam (on Xingu tributary)", "Tucuruí Dam (on Tocantins)", "Santo Antônio (on Madeira)"],
    historicSignificance: "Named by Francisco de Orellana in 1541 after fighting fierce tribal warrior women. Remained largely isolated, sustaining pristine indigenous populations.",
    upscPrelimsBrief: "Worlds largest river by freshwater drainage volume, exceeding the next seven rivers amalgamated. Discharge volume reaches ~200,000 cubic meters per second. Features a deep estuarine mouth (no typical delta due to deep Atlantic currents).",
    upscMainsBrief: "Role of Amazon Basin ('Lungs of Planet') in regulating South American moisture transport and global carbon inventory. Deforestation and forest fires dismantle evapotranspiration feedback loops, triggering severe basin droughts, carbon source conversions, and regional climate tipping points."
  },
  {
    id: "yangtze",
    name: "Golden Yangtze",
    section: "world",
    path: [
      [34.10, 92.20],  // Tibetan plateau source
      [27.20, 100.15], // Tiger Leaping Gorge
      [26.50, 104.90], // Sichuan bend
      [29.56, 106.55], // Chongqing
      [30.82, 111.00], // Three Gorges Dam
      [30.59, 114.30], // Wuhan
      [32.06, 118.79], // Nanjing
      [31.25, 121.50]  // Shanghai outlet (East China Sea)
    ],
    origin: "Tanggula Mountains (Tibetan Plateau), Qinghai Province, China",
    length: "6,300 km",
    statesOrCountriesDirect: ["China (flows through 11 provinces/autonomous areas)"],
    tributariesLeft: ["Yalong", "Min", "Jialing", "Han"],
    tributariesRight: ["Wu", "Yuan", "Xiang", "Gan"],
    majorDamsProjects: ["Three Gorges Dam (World's Largest Hydepower)", "Xiangjiaba Dam", "Baihetan Dam", "South-to-North Water Diversion Project"],
    historicSignificance: "Cultural and economic divide between Wheat-farming Northern China and Rice-farming Southern China. Site of legendary battles, such as the Battle of Red Cliffs in 208 AD.",
    upscPrelimsBrief: "Longest river entirely inside one nation, and longest in Asia. Forms Tiger Leaping Gorge. Its watershed feeds half of China's agricultural and industrial output. Endangered species include Chinese Sturgeon.",
    upscMainsBrief: "Extreme balance of rapid development vs environmental reclamation. Host to a massive 10-year fishing ban across the main stem starting 2021. South-to-North Water Diversion (Central-and-Eastern canals) triggers major inter-basin water-security trade-offs."
  },
  {
    id: "danube",
    name: "Danube Corridor",
    section: "world",
    path: [
      [48.10, 8.15],   // Black Forest source
      [48.30, 14.28],  // Linz
      [48.20, 16.37],  // Vienna
      [48.14, 17.10],  // Bratislava
      [47.50, 19.04],  // Budapest
      [45.26, 19.83],  // Novi Sad
      [44.81, 20.46],  // Belgrade
      [44.68, 22.52],  // Iron Gates Gorge
      [43.60, 25.30],  // Rousse
      [45.20, 29.50],  // Danube Delta
      [45.15, 29.75]   // Black Sea mouth
    ],
    origin: "Confluence of Breg and Brigach streams in Black Forest, Germany",
    length: "2,850 km",
    statesOrCountriesDirect: ["Germany", "Austria", "Slovakia", "Hungary", "Croatia", "Serbia", "Romania", "Bulgaria", "Moldova", "Ukraine"],
    tributariesLeft: ["Morava", "Hron", "Tisza", "Olt", "Siret", "Prut"],
    tributariesRight: ["Iller", "Lech", "Isar", "Inn", "Drava", "Sava", "Velika Morava"],
    majorDamsProjects: ["Iron Gate I and II Hydroelectric dams (Romania/Serbia)", "Gabčíkovo Dam", "Freudenau Dam"],
    historicSignificance: "Forms the northern natural defense frontier ('Limes') of ancient Rome guarding legionnaire ports against Germanic and Dacian forces.",
    upscPrelimsBrief: "Second-longest river in Europe, flowing eastwards. Passes through four European capitals (Vienna, Bratislava, Budapest, Belgrade). Delta is a precious UNESCO World Heritage biosphere Reserve.",
    upscMainsBrief: "A pristine blueprint for multilateral transboundary river framework governance via the International Commission for the Protection of the Danube River (ICPDR). Navigates challenges with heavy metal industrial sewage discharges, microplastics, and invasive species transport."
  }
];
