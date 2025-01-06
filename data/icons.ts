export type IconOption = {
  value: string;
  label: string;
  category: string;
};

export const ICON_OPTIONS: IconOption[] = [
  // Actions & Navigation
  { value: "solar:home-bold-duotone", label: "Home", category: "Navigation" },
  { value: "solar:menu-bold-duotone", label: "Menu", category: "Navigation" },
  {
    value: "solar:settings-bold-duotone",
    label: "Settings",
    category: "Navigation",
  },
  {
    value: "solar:folder-bold-duotone",
    label: "Folder",
    category: "Navigation",
  },
  {
    value: "solar:widget-bold-duotone",
    label: "Widget",
    category: "Navigation",
  },

  // Users
  { value: "solar:user-bold-duotone", label: "User", category: "Users" },
  {
    value: "solar:users-group-rounded-bold-duotone",
    label: "Users Group",
    category: "Users",
  },
  {
    value: "solar:user-plus-bold-duotone",
    label: "Add User",
    category: "Users",
  },
  {
    value: "solar:user-check-bold-duotone",
    label: "Check User",
    category: "Users",
  },
  {
    value: "solar:user-cross-bold-duotone",
    label: "Remove User",
    category: "Users",
  },

  // Communication
  {
    value: "solar:chat-round-dots-bold-duotone",
    label: "Chat",
    category: "Communication",
  },
  {
    value: "solar:phone-bold-duotone",
    label: "Phone",
    category: "Communication",
  },
  {
    value: "solar:letter-bold-duotone",
    label: "Email",
    category: "Communication",
  },
  {
    value: "solar:bell-bing-bold-duotone",
    label: "Notification",
    category: "Communication",
  },
  {
    value: "solar:chat-square-call-bold-duotone",
    label: "Call",
    category: "Communication",
  },

  // Files & Documents
  { value: "solar:file-bold-duotone", label: "File", category: "Files" },
  {
    value: "solar:document-add-bold-duotone",
    label: "Add Document",
    category: "Files",
  },
  {
    value: "solar:file-text-bold-duotone",
    label: "Text File",
    category: "Files",
  },
  {
    value: "solar:cloud-storage-bold-duotone",
    label: "Cloud Storage",
    category: "Files",
  },
  {
    value: "solar:folder-with-files-bold-duotone",
    label: "Folder with Files",
    category: "Files",
  },

  // Media
  { value: "solar:play-bold-duotone", label: "Play", category: "Media" },
  { value: "solar:pause-bold-duotone", label: "Pause", category: "Media" },
  { value: "solar:stop-bold-duotone", label: "Stop", category: "Media" },
  {
    value: "solar:volume-loud-bold-duotone",
    label: "Volume",
    category: "Media",
  },
  { value: "solar:camera-bold-duotone", label: "Camera", category: "Media" },

  // Weather
  { value: "solar:sun-bold-duotone", label: "Sun", category: "Weather" },
  { value: "solar:moon-bold-duotone", label: "Moon", category: "Weather" },
  {
    value: "solar:cloud-rain-bold-duotone",
    label: "Rain",
    category: "Weather",
  },
  { value: "solar:cloud-bold-duotone", label: "Cloud", category: "Weather" },
  { value: "solar:wind-bold-duotone", label: "Wind", category: "Weather" },

  // Business & Analytics
  { value: "solar:chart-2-bold-duotone", label: "Chart", category: "Business" },
  {
    value: "solar:graph-new-bold-duotone",
    label: "Graph",
    category: "Business",
  },
  {
    value: "solar:wallet-money-bold-duotone",
    label: "Money",
    category: "Business",
  },
  { value: "solar:card-bold-duotone", label: "Card", category: "Business" },
  {
    value: "solar:bill-list-bold-duotone",
    label: "Invoice",
    category: "Business",
  },
  // Interface & Actions
  {
    value: "solar:minimize-square-bold-duotone",
    label: "Minimize",
    category: "Interface",
  },
  {
    value: "solar:maximize-square-bold-duotone",
    label: "Maximize",
    category: "Interface",
  },
  {
    value: "solar:arrow-right-bold-duotone",
    label: "Arrow Right",
    category: "Interface",
  },
  {
    value: "solar:arrow-left-bold-duotone",
    label: "Arrow Left",
    category: "Interface",
  },
  {
    value: "solar:refresh-bold-duotone",
    label: "Refresh",
    category: "Interface",
  },
  {
    value: "solar:sort-vertical-bold-duotone",
    label: "Sort",
    category: "Interface",
  },
  {
    value: "solar:filter-bold-duotone",
    label: "Filter",
    category: "Interface",
  },
  // Documents & Files
  {
    value: "solar:document-text-bold-duotone",
    label: "Document Text",
    category: "Documents",
  },
  {
    value: "solar:clipboard-text-bold-duotone",
    label: "Clipboard",
    category: "Documents",
  },
  {
    value: "solar:file-download-bold-duotone",
    label: "Download File",
    category: "Documents",
  },
  {
    value: "solar:file-upload-bold-duotone",
    label: "Upload File",
    category: "Documents",
  },
  {
    value: "solar:file-favourite-bold-duotone",
    label: "Favorite File",
    category: "Documents",
  },
  // Communication & Social
  {
    value: "solar:chat-round-line-bold-duotone",
    label: "Chat Line",
    category: "Communication",
  },
  {
    value: "solar:chat-square-like-bold-duotone",
    label: "Chat Like",
    category: "Communication",
  },
  {
    value: "solar:user-speak-bold-duotone",
    label: "User Speak",
    category: "Communication",
  },
  {
    value: "solar:bell-bold-duotone",
    label: "Bell",
    category: "Communication",
  },
  {
    value: "solar:mention-circle-bold-duotone",
    label: "Mention",
    category: "Communication",
  },
  // Security
  {
    value: "solar:shield-keyhole-bold-duotone",
    label: "Shield Lock",
    category: "Security",
  },
  {
    value: "solar:lock-keyhole-bold-duotone",
    label: "Lock",
    category: "Security",
  },
  {
    value: "solar:shield-user-bold-duotone",
    label: "Shield User",
    category: "Security",
  },
  {
    value: "solar:password-bold-duotone",
    label: "Password",
    category: "Security",
  },
  { value: "solar:key-bold-duotone", label: "Key", category: "Security" },
  // Devices & Hardware
  {
    value: "solar:smartphone-2-bold-duotone",
    label: "Smartphone",
    category: "Devices",
  },
  {
    value: "solar:laptop-2-bold-duotone",
    label: "Laptop",
    category: "Devices",
  },
  {
    value: "solar:printer-bold-duotone",
    label: "Printer",
    category: "Devices",
  },
  {
    value: "solar:monitor-bold-duotone",
    label: "Monitor",
    category: "Devices",
  },
  { value: "solar:tablet-bold-duotone", label: "Tablet", category: "Devices" },
  // Media & Entertainment
  {
    value: "solar:gallery-wide-bold-duotone",
    label: "Gallery",
    category: "Media",
  },
  {
    value: "solar:videocamera-record-bold-duotone",
    label: "Video Record",
    category: "Media",
  },
  {
    value: "solar:play-stream-bold-duotone",
    label: "Stream",
    category: "Media",
  },
  {
    value: "solar:microphone-3-bold-duotone",
    label: "Microphone",
    category: "Media",
  },
  {
    value: "solar:headphones-round-bold-duotone",
    label: "Headphones",
    category: "Media",
  },
  // Analytics & Data
  {
    value: "solar:chart-square-bold-duotone",
    label: "Chart Square",
    category: "Analytics",
  },
  {
    value: "solar:pie-chart-2-bold-duotone",
    label: "Pie Chart",
    category: "Analytics",
  },
  {
    value: "solar:graph-new-up-bold-duotone",
    label: "Graph Up",
    category: "Analytics",
  },
  {
    value: "solar:diagram-down-bold-duotone",
    label: "Diagram Down",
    category: "Analytics",
  },
  {
    value: "solar:chart-2-bold-duotone",
    label: "Chart",
    category: "Analytics",
  },
  // Shopping & Ecommerce
  {
    value: "solar:bag-4-bold-duotone",
    label: "Shopping Bag",
    category: "Shopping",
  },
  {
    value: "solar:cart-large-minimalistic-bold-duotone",
    label: "Cart",
    category: "Shopping",
  },
  {
    value: "solar:tag-price-bold-duotone",
    label: "Price Tag",
    category: "Shopping",
  },
  {
    value: "solar:cart-check-bold-duotone",
    label: "Cart Check",
    category: "Shopping",
  },
  { value: "solar:shop-bold-duotone", label: "Shop", category: "Shopping" },
  // Weather & Nature
  { value: "solar:sunset-bold-duotone", label: "Sunset", category: "Weather" },
  {
    value: "solar:snowflake-bold-duotone",
    label: "Snowflake",
    category: "Weather",
  },
  {
    value: "solar:cloud-storm-bold-duotone",
    label: "Storm",
    category: "Weather",
  },
  {
    value: "solar:tornado-bold-duotone",
    label: "Tornado",
    category: "Weather",
  },
  { value: "solar:stars-bold-duotone", label: "Stars", category: "Weather" },
  { value: "solar:fog-bold-duotone", label: "Fog", category: "Weather" },

  // Health & Medical
  {
    value: "solar:heart-pulse-bold-duotone",
    label: "Heart Pulse",
    category: "Health",
  },
  { value: "solar:pills-2-bold-duotone", label: "Pills", category: "Health" },
  {
    value: "solar:stethoscope-bold-duotone",
    label: "Stethoscope",
    category: "Health",
  },
  { value: "solar:dna-bold-duotone", label: "DNA", category: "Health" },
  {
    value: "solar:hospital-bold-duotone",
    label: "Hospital",
    category: "Health",
  },

  // Time & Calendar
  {
    value: "solar:clock-circle-bold-duotone",
    label: "Clock",
    category: "Time",
  },
  { value: "solar:alarm-bold-duotone", label: "Alarm", category: "Time" },
  {
    value: "solar:calendar-date-bold-duotone",
    label: "Calendar",
    category: "Time",
  },
  {
    value: "solar:stopwatch-bold-duotone",
    label: "Stopwatch",
    category: "Time",
  },
  { value: "solar:history-2-bold-duotone", label: "History", category: "Time" },

  // Development & Code
  {
    value: "solar:code-2-bold-duotone",
    label: "Code",
    category: "Development",
  },
  { value: "solar:bug-bold-duotone", label: "Bug", category: "Development" },
  {
    value: "solar:command-bold-duotone",
    label: "Command",
    category: "Development",
  },
  {
    value: "solar:code-scan-bold-duotone",
    label: "Code Scan",
    category: "Development",
  },
  {
    value: "solar:terminal-bold-duotone",
    label: "Terminal",
    category: "Development",
  },

  // Maps & Location

  {
    value: "solar:map-point-wave-bold-duotone",
    label: "Map Point",
    category: "Maps",
  },
  { value: "solar:compass-bold-duotone", label: "Compass", category: "Maps" },
  { value: "solar:route-bold-duotone", label: "Route", category: "Maps" },
  { value: "solar:radar-bold-duotone", label: "Radar", category: "Maps" },
  {
    value: "solar:map-point-search-bold-duotone",
    label: "Location Search",
    category: "Maps",
  },

  // Education & School
  { value: "solar:book-2-bold-duotone", label: "Book", category: "Education" },
  {
    value: "solar:notebook-bold-duotone",
    label: "Notebook",
    category: "Education",
  },
  {
    value: "solar:calculator-bold-duotone",
    label: "Calculator",
    category: "Education",
  },
  {
    value: "solar:backpack-bold-duotone",
    label: "Backpack",
    category: "Education",
  },
  {
    value: "solar:diploma-bold-duotone",
    label: "Diploma",
    category: "Education",
  },

  // Sport & Activity
  {
    value: "solar:basketball-bold-duotone",
    label: "Basketball",
    category: "Sports",
  },
  { value: "solar:walking-bold-duotone", label: "Walking", category: "Sports" },
  {
    value: "solar:bicycling-bold-duotone",
    label: "Cycling",
    category: "Sports",
  },
  { value: "solar:tennis-bold-duotone", label: "Tennis", category: "Sports" },
  { value: "solar:running-bold-duotone", label: "Running", category: "Sports" },

  // Design & Creative
  { value: "solar:palette-bold-duotone", label: "Palette", category: "Design" },
  { value: "solar:pen-2-bold-duotone", label: "Pen", category: "Design" },
  { value: "solar:brush-bold-duotone", label: "Brush", category: "Design" },
  { value: "solar:layers-bold-duotone", label: "Layers", category: "Design" },
  { value: "solar:ruler-pen-bold-duotone", label: "Ruler", category: "Design" },

  // Office & Work
  {
    value: "solar:case-minimalistic-bold-duotone",
    label: "Briefcase",
    category: "Office",
  },
  {
    value: "solar:printer-2-bold-duotone",
    label: "Office Printer",
    category: "Office",
  },
  {
    value: "solar:presentation-graph-bold-duotone",
    label: "Presentation",
    category: "Office",
  },
  {
    value: "solar:graph-bold-duotone",
    label: "Business Graph",
    category: "Office",
  },
  {
    value: "solar:chart-bold-duotone",
    label: "Office Chart",
    category: "Office",
  },
  // Music & Sound
  {
    value: "solar:vinyl-record-bold-duotone",
    label: "Vinyl",
    category: "Music",
  },
  {
    value: "solar:music-note-2-bold-duotone",
    label: "Music Note",
    category: "Music",
  },
  { value: "solar:radio-bold-duotone", label: "Radio", category: "Music" },
  { value: "solar:podcast-bold-duotone", label: "Podcast", category: "Music" },
  {
    value: "solar:soundwave-bold-duotone",
    label: "Sound Wave",
    category: "Music",
  },
  // Food & Kitchen
  { value: "solar:chef-hat-bold-duotone", label: "Chef Hat", category: "Food" },
  { value: "solar:cup-hot-bold-duotone", label: "Hot Cup", category: "Food" },
  {
    value: "solar:wineglass-triangle-bold-duotone",
    label: "Wine",
    category: "Food",
  },
  { value: "solar:tea-cup-bold-duotone", label: "Tea Cup", category: "Food" },
  { value: "solar:bottle-bold-duotone", label: "Bottle", category: "Food" },
  // Network & Connection
  {
    value: "solar:wifi-router-bold-duotone",
    label: "WiFi Router",
    category: "Network",
  },
  { value: "solar:signal-bold-duotone", label: "Signal", category: "Network" },
  {
    value: "solar:bluetooth-circle-bold-duotone",
    label: "Bluetooth",
    category: "Network",
  },
  { value: "solar:usb-bold-duotone", label: "USB", category: "Network" },
  {
    value: "solar:server-path-bold-duotone",
    label: "Server",
    category: "Network",
  },
  // Transport
  { value: "solar:bus-bold-duotone", label: "Bus", category: "Transport" },
  { value: "solar:wheel-bold-duotone", label: "Wheel", category: "Transport" },
  {
    value: "solar:transmission-bold-duotone",
    label: "Transmission",
    category: "Transport",
  },
  { value: "solar:tram-bold-duotone", label: "Tram", category: "Transport" },
  {
    value: "solar:electric-refueling-bold-duotone",
    label: "Electric Charging",
    category: "Transport",
  },
  // Tools & Settings
  { value: "solar:tuning-2-bold-duotone", label: "Tuning", category: "Tools" },
  { value: "solar:wrench-bold-duotone", label: "Wrench", category: "Tools" },
  { value: "solar:widget-6-bold-duotone", label: "Widget", category: "Tools" },
  {
    value: "solar:tuning-square-2-bold-duotone",
    label: "Settings Square",
    category: "Tools",
  },
  {
    value: "solar:settings-minimalistic-bold-duotone",
    label: "Minimal Settings",
    category: "Tools",
  },
  {
    value: "solar:airbuds-case-bold-duotone",
    label: "Airbuds Case",
    category: "Devices",
  },
  {
    value: "solar:gamepad-bold-duotone",
    label: "Gamepad",
    category: "Devices",
  },
  { value: "solar:ssd-square-bold-duotone", label: "SSD", category: "Devices" },
  {
    value: "solar:keyboard-bold-duotone",
    label: "Keyboard",
    category: "Devices",
  },
  { value: "solar:mouse-bold-duotone", label: "Mouse", category: "Devices" },
  {
    value: "solar:star-fall-2-bold-duotone",
    label: "Falling Star",
    category: "Astronomy",
  },
  {
    value: "solar:planet-bold-duotone",
    label: "Planet",
    category: "Astronomy",
  },
  {
    value: "solar:rocket-2-bold-duotone",
    label: "Rocket",
    category: "Astronomy",
  },
  { value: "solar:ufo-2-bold-duotone", label: "UFO", category: "Astronomy" },
  {
    value: "solar:satellite-bold-duotone",
    label: "Satellite",
    category: "Astronomy",
  },
  {
    value: "solar:bone-broken-bold-duotone",
    label: "Broken Bone",
    category: "Medical",
  },
  {
    value: "solar:dropper-bold-duotone",
    label: "Dropper",
    category: "Medical",
  },
  {
    value: "solar:test-tube-bold-duotone",
    label: "Test Tube",
    category: "Medical",
  },
  { value: "solar:virus-bold-duotone", label: "Virus", category: "Medical" },
  {
    value: "solar:syringe-bold-duotone",
    label: "Syringe",
    category: "Medical",
  },
  {
    value: "solar:washing-machine-bold-duotone",
    label: "Washing Machine",
    category: "Home",
  },
  { value: "solar:armchair-bold-duotone", label: "Armchair", category: "Home" },
  { value: "solar:sofa-bold-duotone", label: "Sofa", category: "Home" },
  { value: "solar:bed-bold-duotone", label: "Bed", category: "Home" },
  { value: "solar:fridge-bold-duotone", label: "Fridge", category: "Home" },
  {
    value: "solar:confetti-bold-duotone",
    label: "Confetti",
    category: "Celebrations",
  },
  {
    value: "solar:balloon-bold-duotone",
    label: "Balloon",
    category: "Celebrations",
  },
  { value: "solar:gift-bold-duotone", label: "Gift", category: "Celebrations" },
  {
    value: "solar:crown-bold-duotone",
    label: "Crown",
    category: "Celebrations",
  },
  {
    value: "solar:medal-star-bold-duotone",
    label: "Medal",
    category: "Celebrations",
  },
  {
    value: "solar:jar-of-pills-bold-duotone",
    label: "Pill Jar",
    category: "Medical",
  },
  {
    value: "solar:medical-kit-bold-duotone",
    label: "Medical Kit",
    category: "Medical",
  },
  {
    value: "solar:first-aid-bold-duotone",
    label: "First Aid",
    category: "Medical",
  },
  { value: "solar:pulse-bold-duotone", label: "Pulse", category: "Medical" },
  {
    value: "solar:thermometer-bold-duotone",
    label: "Thermometer",
    category: "Medical",
  },
  {
    value: "solar:mask-happly-bold-duotone",
    label: "Happy Mask",
    category: "Emojis",
  },
  { value: "solar:ghost-bold-duotone", label: "Ghost", category: "Emojis" },
  {
    value: "solar:emoji-funny-circle-bold-duotone",
    label: "Funny Face",
    category: "Emojis",
  },
  {
    value: "solar:sleeping-circle-bold-duotone",
    label: "Sleeping",
    category: "Emojis",
  },
  {
    value: "solar:buildings-2-bold-duotone",
    label: "Buildings",
    category: "Architecture",
  },
  { value: "solar:city-bold-duotone", label: "City", category: "Architecture" },
  {
    value: "solar:garage-bold-duotone",
    label: "Garage",
    category: "Architecture",
  },
  {
    value: "solar:incognito-bold-duotone",
    label: "Incognito",
    category: "Security",
  },
  {
    value: "solar:scanner-bold-duotone",
    label: "Scanner",
    category: "Security",
  },
  {
    value: "solar:face-scan-bold-duotone",
    label: "Face Scan",
    category: "Security",
  },
  {
    value: "solar:skateboard-bold-duotone",
    label: "Skateboard",
    category: "Sports",
  },
  {
    value: "solar:swimming-bold-duotone",
    label: "Swimming",
    category: "Sports",
  },
  { value: "solar:bowling-bold-duotone", label: "Bowling", category: "Sports" },
  {
    value: "solar:stretching-bold-duotone",
    label: "Stretching",
    category: "Sports",
  },
  {
    value: "solar:magic-stick-bold-duotone",
    label: "Magic Stick",
    category: "Misc",
  },
  { value: "solar:boxing-bold-duotone", label: "Boxing", category: "Sports" },
  { value: "solar:flag-2-bold-duotone", label: "Flag", category: "Misc" },
  {
    value: "solar:emoji-funny-square-bold-duotone",
    label: "Funny Square",
    category: "Emojis",
  },
];

export const getIconsByCategory = (category: string) => {
  return ICON_OPTIONS.filter((icon) => icon.category === category);
};

export const searchIcons = (query: string) => {
  const searchTerm = query.toLowerCase();
  return ICON_OPTIONS.filter(
    (icon) =>
      icon.label.toLowerCase().includes(searchTerm) ||
      icon.value.toLowerCase().includes(searchTerm) ||
      icon.category.toLowerCase().includes(searchTerm)
  );
};

export const getAllCategories = () => {
  return Array.from(new Set(ICON_OPTIONS.map((icon) => icon.category))).sort();
};
