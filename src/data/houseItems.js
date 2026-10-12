import { roomPosition as layoutPosition } from "./roomLayouts";

// Each item's artwork is its own file, named by item id.
const itemArtwork = import.meta.glob("../assets/room-items/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});
const artworkFor = (id) => {
  const url = itemArtwork[`../assets/room-items/${id}.svg`];
  if (!url) throw new Error(`Missing artwork: src/assets/room-items/${id}.svg`);
  return url;
};

// Each room's picker icon is its own file, named by room id.
const roomIconArtwork = import.meta.glob("../assets/room-icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});
const roomIconFor = (id) => {
  const url = roomIconArtwork[`../assets/room-icons/${id}.svg`];
  if (!url) throw new Error(`Missing artwork: src/assets/room-icons/${id}.svg`);
  return url;
};

const cartoonRoom = (name, symbol, wall, floor) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540">
    <rect width="900" height="540" fill="${wall}"/>
    <path d="M0 360h900v180H0z" fill="${floor}"/>
    <path d="M0 360h900" stroke="#735342" stroke-width="12"/>
    <rect x="105" y="84" width="190" height="190" rx="18" fill="#c4e4ed" stroke="#29453e" stroke-width="12"/>
    <path d="M200 84v190M105 180h190" stroke="#29453e" stroke-width="10"/>
    <circle cx="608" cy="118" r="48" fill="#ffe486"/>
    <path d="M525 358c0-116 74-176 170-176s170 60 170 176" fill="#f7f1e5" stroke="#29453e" stroke-width="12"/>
    <rect x="570" y="279" width="250" height="85" rx="28" fill="#e98769" stroke="#29453e" stroke-width="12"/>
    <circle cx="650" cy="320" r="18" fill="#f8d97a"/><circle cx="744" cy="320" r="18" fill="#f8d97a"/>
    <text x="450" y="447" text-anchor="middle" font-family="Arial, sans-serif" font-size="106" font-weight="bold" fill="#29453e">${symbol}</text>
    <text x="450" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#29453e">${name}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const roomPriceCounts = {};
const nextRoomPrice = (room) => {
  const pricePosition = roomPriceCounts[room] || 0;
  roomPriceCounts[room] = pricePosition + 1;
  const retiredMobileOffset = room === "bedroom" && pricePosition >= 5 ? 1 : 0;
  return 30 + (pricePosition + retiredMobileOffset) * 5;
};

// The plainest piece in each room costs next to nothing, so a class can buy
// something for a room almost as soon as they start.
const starterItems = new Set(["window-curtains", "nightstand", "kitchen-utensils", "bath-mat", "work-rug"]);
const starterPrice = 5;
// A starter still takes its place in the room's price ladder, so the rest of
// the room keeps its prices.
const priceFor = (id, room) => {
  const roomPrice = nextRoomPrice(room);
  return starterItems.has(id) ? starterPrice : roomPrice;
};

// These items are drawn sitting on another item, so a class can only buy one
// once the piece it rests on is in the room.
const sitsOn = {
  "cloud-pillows": "sunny-sofa",
  "record-player": "book-nook",
  "moon-lamp": "nightstand",
  "soft-blanket": "cozy-bed",
  "cake-stand": "sunny-table",
  "place-settings": "dining-table",
  "dinner-feast": "dining-table",
  "rubber-duck": "bubble-bath",
  "desk-lamp": "office-desk",
  "coffee-maker": "filing-cabinet",
};

// Each item's name lives in the translations, under "item.<id>".
const item = (id, _cost, room, symbol, _color, sceneType = "floor") => ({
  id,
  cost: priceFor(id, room),
  room,
  symbol,
  sceneType,
  sitsOn: sitsOn[id] ?? null,
  image: artworkFor(id),
  roomImage: artworkFor(id),
  roomPosition: layoutPosition(room, id),
});

export const houseItems = [
  item("sunny-sofa", 15, "living", "🛋️", "#efac64", "furniture"),
  item("story-lamp", 20, "living", "💡", "#e98769", "lamp"),
  item("leafy-plant", 25, "living", "🪴", "#83b68b", "plant"),
  item("rainbow-rug", 30, "living", "🌈", "#d88cbe", "rug"),
  item("book-nook", 35, "living", "📚", "#7198d2", "furniture"),
  item("window-curtains", 40, "living", "🪟", "#ae92c4", "curtain"),
  item("cloud-pillows", 45, "living", "☁️", "#98c4d8", "soft"),
  item("family-photo", 50, "living", "🖼️", "#f0b867", "wall"),
  item("record-player", 55, "living", "🎵", "#6fa89a", "surface"),
  item("tea-table", 60, "living", "🫖", "#d98573", "table"),

  item("cozy-bed", 65, "bedroom", "🛏️", "#8aa5d1", "furniture"),
  item("star-rug", 70, "bedroom", "⭐", "#e9bd62", "rug"),
  item("nightstand", 75, "bedroom", "🗄️", "#cf9668", "furniture"),
  item("moon-lamp", 80, "bedroom", "🌙", "#8d83bd", "lamp"),
  item("soft-blanket", 85, "bedroom", "🧣", "#df92a4", "soft"),
  item("art-wall", 95, "bedroom", "🎨", "#e58969", "wall"),
  item("comfy-chair", 100, "bedroom", "🪑", "#8eb179", "furniture"),
  item("toy-basket", 105, "bedroom", "🧸", "#f0b95f", "floor"),
  item("closet", 110, "bedroom", "🚪", "#bd91c6", "furniture"),

  item("fruit-bowl", 115, "kitchen", "🍎", "#e88b64", "surface"),
  item("tea-kettle", 120, "kitchen", "🫖", "#6fa7b0", "surface"),
  item("mixing-bowls", 125, "kitchen", "🥣", "#d18fbd", "surface"),
  item("cookie-jar", 130, "kitchen", "🍪", "#d3a066", "surface"),
  item("sunny-table", 135, "kitchen", "🍽️", "#eeaf5e", "table"),
  item("wall-clock", 140, "kitchen", "🕰️", "#87aa81", "wall"),
  item("herb-garden", 145, "kitchen", "🌿", "#75aa7d", "surface"),
  item("recipe-board", 150, "kitchen", "📝", "#e58369", "wall"),
  item("happy-toaster", 155, "kitchen", "🍞", "#7198d2", "surface"),
  item("cake-stand", 160, "kitchen", "🍰", "#d97dac", "surface"),
  item("dining-table", 165, "kitchen", "🍽️", "#b9825d", "table"),
  item("place-settings", 170, "kitchen", "🍴", "#87aeb8", "surface"),
  item("kitchen-utensils", 175, "kitchen", "🥄", "#d3a066", "wall"),
  item("dinner-feast", 180, "kitchen", "🥘", "#d9795f", "surface"),

  item("bubble-bath", 215, "bathroom", "🛁", "#88bbd5", "furniture"),
  item("soft-towels", 220, "bathroom", "🧺", "#d59aae", "wall"),
  item("round-mirror", 225, "bathroom", "🪞", "#82b8b3", "wall"),
  item("toothbrush-cup", 230, "bathroom", "🪥", "#e3a15f", "surface"),
  item("bath-mat", 235, "bathroom", "▰", "#9b91c5", "rug"),
  item("soap-set", 240, "bathroom", "🧼", "#7aaf8e", "surface"),
  item("wash-basket", 245, "bathroom", "🧺", "#d28877", "floor"),
  item("shower-curtain", 250, "bathroom", "🚿", "#80abc7", "curtain"),
  item("rubber-duck", 255, "bathroom", "🦆", "#edbb59", "surface"),
  item("bathroom-plant", 260, "bathroom", "🪴", "#83b68b", "plant"),
  item("face-masks", 265, "bathroom", "🧖", "#a3c9ae", "surface"),
  item("skin-care", 270, "bathroom", "🧴", "#dfa0ae", "surface"),

  item("office-desk", 275, "office", "🖥️", "#b9825d", "furniture"),
  item("desk-chair", 280, "office", "🪑", "#7198d2", "furniture"),
  item("bookcase", 285, "office", "📚", "#d3a066", "furniture"),
  item("desk-lamp", 290, "office", "💡", "#e9bd62", "lamp"),
  item("office-plant", 295, "office", "🪴", "#83b68b", "plant"),
  item("wall-calendar", 300, "office", "📅", "#e58369", "wall"),
  item("filing-cabinet", 305, "office", "🗄️", "#8d83bd", "furniture"),
  item("work-rug", 310, "office", "▰", "#d88cbe", "rug"),
  item("wall-art", 315, "office", "🖼️", "#f0b867", "wall"),
  item("coffee-maker", 320, "office", "☕", "#6fa7b0", "surface"),
];

/** Whether the piece an item sits on (if any) is already in the room. */
export const hasSupport = (item, ownedIds) => !item.sitsOn || ownedIds.includes(item.sitsOn);

export const classMilestones = [
  {
    id: "plant-corner",
    icon: "🌱",
    room: "living",
    itemIds: ["leafy-plant", "window-curtains", "rainbow-rug"],
  },
  {
    id: "reading-nook",
    icon: "📚",
    room: "living",
    itemIds: ["book-nook", "story-lamp", "cloud-pillows"],
  },
  {
    id: "celebration-space",
    icon: "🎉",
    room: "living",
    itemIds: ["record-player", "tea-table", "family-photo"],
  },
  {
    id: "sweet-dreams",
    icon: "🌙",
    room: "bedroom",
    itemIds: ["cozy-bed", "soft-blanket", "moon-lamp"],
  },
  {
    id: "stargazing-corner",
    icon: "⭐",
    room: "bedroom",
    itemIds: ["star-rug", "moon-lamp", "comfy-chair"],
  },
  {
    id: "creative-sleepover",
    icon: "🎨",
    room: "bedroom",
    itemIds: ["art-wall", "toy-basket", "closet"],
  },
  {
    id: "cheerful-breakfast",
    icon: "🍞",
    room: "kitchen",
    itemIds: ["sunny-table", "fruit-bowl", "happy-toaster"],
  },
  {
    id: "class-dinner",
    icon: "🍽️",
    room: "kitchen",
    itemIds: ["dining-table", "place-settings", "kitchen-utensils", "dinner-feast"],
  },
  {
    id: "class-bake-off",
    icon: "🍰",
    room: "kitchen",
    itemIds: ["mixing-bowls", "cookie-jar", "recipe-board", "cake-stand"],
  },
  {
    id: "fresh-and-ready",
    icon: "🫧",
    room: "bathroom",
    itemIds: ["soft-towels", "round-mirror", "soap-set"],
  },
  {
    id: "spa-day",
    icon: "🧖",
    room: "bathroom",
    itemIds: ["face-masks", "skin-care", "soft-towels", "bubble-bath"],
  },
  {
    id: "garden-bath",
    icon: "🌿",
    room: "bathroom",
    itemIds: ["bathroom-plant", "bath-mat", "shower-curtain", "rubber-duck"],
  },
];

export const houseRooms = [
  { id: "living", wall: "#e6e2c3", floor: "#d0a074", icon: roomIconFor("living"), image: cartoonRoom("Living Room", "HOME", "#d9e9db", "#caa27a") },
  { id: "bedroom", wall: "#e4cfcc", floor: "#bf8e68", icon: roomIconFor("bedroom"), image: cartoonRoom("Bedroom", "DREAM", "#ded8ee", "#b89072") },
  { id: "kitchen", wall: "#f6e2b6", floor: "#d0a074", icon: roomIconFor("kitchen"), image: cartoonRoom("Kitchen", "YUM", "#f6ddad", "#c99d75") },
  { id: "bathroom", wall: "#f4e5ca", floor: "#dab993", icon: roomIconFor("bathroom"), image: cartoonRoom("Bathroom", "SPLASH", "#d1e9ed", "#b58d6d") },
  { id: "office", wall: "#f2dcc3", floor: "#d0a074", icon: roomIconFor("office"), image: cartoonRoom("Office", "FOCUS", "#e9e2d3", "#a88161") },
];
