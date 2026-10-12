// A teacher can keep several classes on one computer. Each class earns its own
// stars and keeps its own otter outfit and rooms; timer settings and session
// presets belong to the teacher and are shared by every class.
//
// The list is saved as { currentId, classes: [{ id, name, progress, rewards, house }] }.

import { accessorySlots, retiredAccessories, slotOf } from "../data/accessories.js";

/** Long enough for "Period 3 — Year 9 Science". */
export const MAX_CLASS_NAME_LENGTH = 40;

export const newClassId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const cleanClassName = (name) =>
  String(name ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_CLASS_NAME_LENGTH);

/** A class that has not earned anything yet. An empty name shows as "My class". */
export const emptyClass = (name = "") => ({
  id: newClassId(),
  name: cleanClassName(name),
  progress: { stars: 0, totalStars: 0, completedSessions: 0, history: [] },
  rewards: { unlocked: [], equipped: [] },
  house: { activeRoom: "living", houseItemsOwned: [] },
});

/**
 * Turns one classroom saved before classes existed into a class. Those saves
 * counted "points"; the class now earns stars, one per minute just like before.
 */
export const classFromSingleClassroom = ({ progress, rewards, house }, name = "") => {
  const history = Array.isArray(progress?.history) ? progress.history : [];
  return {
    ...emptyClass(name),
    progress: {
      stars: progress?.stars ?? progress?.points ?? 0,
      totalStars: progress?.totalStars ?? progress?.totalPoints ?? 0,
      completedSessions: progress?.completedSessions ?? history.length,
      history: history.map(({ pointsEarned, ...session }) => ({
        ...session,
        starsEarned: session.starsEarned ?? pointsEarned ?? session.minutes,
      })),
    },
    rewards: {
      unlocked: rewards?.unlocked ?? [],
      equipped: rewards?.equipped ?? [],
    },
    house: {
      activeRoom: house?.activeRoom ?? "living",
      houseItemsOwned: house?.houseItemsOwned ?? [],
    },
  };
};

/**
 * Brings a class's otter outfit up to date with the shop: stars come back for
 * retired accessories, and the otter keeps on one hat and one pair of glasses.
 */
export const updateOutfit = (classroom) => {
  const { unlocked, equipped } = classroom?.rewards ?? {};
  const stars = classroom?.progress?.stars;
  if (!Array.isArray(unlocked) || !Array.isArray(equipped) || !Number.isFinite(stars)) return classroom;

  const refund = unlocked.reduce((total, id) => total + (retiredAccessories[id] ?? 0), 0);
  const worn = accessorySlots
    .map((slot) => equipped.findLast((id) => slotOf(id) === slot))
    .filter(Boolean);
  if (refund === 0 && worn.length === equipped.length) return classroom;

  return {
    ...classroom,
    progress: { ...classroom.progress, stars: stars + refund },
    rewards: { unlocked: unlocked.filter((id) => !(id in retiredAccessories)), equipped: worn },
  };
};

export const firstClassList = (firstClass = emptyClass()) => ({
  currentId: firstClass.id,
  classes: [firstClass],
});

export const currentClassOf = (list) =>
  list.classes.find((item) => item.id === list.currentId) ?? list.classes[0];

export const isClassList = (list) =>
  Array.isArray(list?.classes)
  && list.classes.length > 0
  && list.classes.every((item) => typeof item?.id === "string" && typeof item.name === "string"
    && item.progress && item.rewards && item.house);

export const addClass = (list, name) => {
  const cleaned = cleanClassName(name);
  if (!cleaned) return list;
  return { ...list, classes: [...list.classes, emptyClass(cleaned)] };
};

/** A blank new name keeps the old one. */
export const renameClass = (list, id, name) => {
  const cleaned = cleanClassName(name);
  if (!cleaned) return list;
  return {
    ...list,
    classes: list.classes.map((item) => item.id === id ? { ...item, name: cleaned } : item),
  };
};

/**
 * Deleting the class on screen moves to the class after it (or before it, if
 * it was last). Deleting the only class leaves a fresh, empty one in its place.
 */
export const removeClass = (list, id) => {
  const index = list.classes.findIndex((item) => item.id === id);
  if (index === -1) return list;

  const classes = list.classes.filter((item) => item.id !== id);
  if (classes.length === 0) return firstClassList();

  const currentId = list.currentId === id
    ? classes[Math.min(index, classes.length - 1)].id
    : list.currentId;
  return { currentId, classes };
};

export const selectClass = (list, id) =>
  list.classes.some((item) => item.id === id) ? { ...list, currentId: id } : list;

/** Applies `change` to the class on screen. */
export const updateCurrentClass = (list, change) => {
  const current = currentClassOf(list);
  return {
    ...list,
    classes: list.classes.map((item) => item.id === current.id ? change(item) : item),
  };
};
