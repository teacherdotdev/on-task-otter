// The otter wears one hat and one pair of glasses at a time. Each accessory's
// name lives in the translations, under "accessory.<id>", and its drawing in
// src/components/Otter/AccessoryArt.jsx.
export const accessorySlots = ["hat", "glasses"];

export const accessories = [
  { id: "beanie", slot: "hat", cost: 35 },
  { id: "party-hat", slot: "hat", cost: 40 },
  { id: "graduation-cap", slot: "hat", cost: 100 },
  { id: "crown", slot: "hat", cost: 150 },
  { id: "round-glasses", slot: "glasses", cost: 25 },
  { id: "lab-goggles", slot: "glasses", cost: 45 },
  { id: "heart-glasses", slot: "glasses", cost: 60 },
  { id: "star-glasses", slot: "glasses", cost: 90 },
];

// Accessories the shop no longer sells, with what they cost. A class that
// bought one gets those stars back.
export const retiredAccessories = { "bow-tie": 50, "baseball-cap": 50, glasses: 30 };

export const slotOf = (id) => accessories.find((item) => item.id === id)?.slot;

/** Takes an accessory off, or puts it on in place of whatever was in its slot. */
export const toggleWorn = (equipped, id) =>
  equipped.includes(id)
    ? equipped.filter((worn) => worn !== id)
    : [...equipped.filter((worn) => slotOf(worn) !== slotOf(id)), id];
