import { exportClassroomSave, importClassroomSave, SAVE_FILE_APP_NAME } from "./storage.js";
import { activities, MAX_SOUND_THRESHOLD, MIN_SOUND_THRESHOLD } from "../data/activities";

const isFiniteNonNegativeNumber = (value) => {
  return Number.isFinite(value) && value >= 0;
};

const isStringArray = (value) => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

const createSaveFile = (data) => {
  return exportClassroomSave(data);
};

const getSaveFileName = () => {
  return `On-task-Otter-Classroom-Save-${new Date().toISOString().slice(0, 10)}.json`;
};

const downloadSaveFile = (data, filename = getSaveFileName()) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return filename;
};

const validateSaveFile = (data, validIds) => {
  if (
    !data
    || data.app !== SAVE_FILE_APP_NAME
    || data.version !== 1
    || !data.data
  ) {
    throw new Error("Invalid classroom save file");
  }

  const settings = data.data.onTaskOtterSettings;
  const progress = data.data.onTaskOtterProgress;
  const rewards = data.data.onTaskOtterRewards;
  const house = data.data.onTaskOtterHouse;
  const validHistory = Array.isArray(progress?.history) && progress.history.every((session) =>
    session &&
    isFiniteNonNegativeNumber(session.minutes) &&
    isFiniteNonNegativeNumber(session.pointsEarned) &&
    typeof session.date === "string" &&
    validIds.activities.includes(session.activity)
  );

  const validSettings =
    settings &&
    validIds.activities.includes(settings.activity) &&
    Number.isFinite(settings.preferredMinutes) &&
    settings.preferredMinutes > 0 &&
    (settings.otterName === undefined || typeof settings.otterName === "string") &&
    (settings.trackSound === undefined || typeof settings.trackSound === "boolean") &&
    (settings.soundThresholds === undefined || (
      Number.isFinite(settings.soundThresholds.independent) &&
      settings.soundThresholds.independent >= MIN_SOUND_THRESHOLD &&
      settings.soundThresholds.independent <= MAX_SOUND_THRESHOLD &&
      Number.isFinite(settings.soundThresholds.partner) &&
      settings.soundThresholds.partner >= MIN_SOUND_THRESHOLD &&
      settings.soundThresholds.partner <= MAX_SOUND_THRESHOLD
    )) &&
    (settings.favoriteSessions === undefined || (
      Array.isArray(settings.favoriteSessions) &&
      settings.favoriteSessions.every((favorite) =>
        favorite &&
        (typeof favorite.id === "number" || typeof favorite.id === "string") &&
        typeof favorite.name === "string" &&
        favorite.name.length > 0 &&
        Number.isFinite(favorite.minutes) &&
        favorite.minutes > 0 &&
        (favorite.trackSound === undefined || typeof favorite.trackSound === "boolean") &&
        validIds.activities.includes(favorite.activity)
      )
    ));

  const validProgress =
    progress &&
    isFiniteNonNegativeNumber(progress.points) &&
    isFiniteNonNegativeNumber(progress.totalPoints) &&
    Number.isInteger(progress.completedSessions) &&
    progress.completedSessions >= 0 &&
    validHistory;

  const validRewards =
    rewards &&
    isStringArray(rewards.unlocked) &&
    rewards.unlocked.every((id) => validIds.accessories.includes(id)) &&
    isStringArray(rewards.equipped) &&
    rewards.equipped.every((id) => rewards.unlocked.includes(id));

  const validHouse =
    house &&
    validIds.rooms.includes(house.activeRoom) &&
    isStringArray(house.houseItemsOwned) &&
    house.houseItemsOwned.every((id) => validIds.houseItems.includes(id));

  if (
    !validSettings 
    || !validProgress 
    || !validRewards 
    || !validHouse
  ) {
    throw new Error("Invalid classroom save file");
  }

  data.data.onTaskOtterRewards = {
    unlocked: [...new Set(rewards.unlocked)],
    equipped: [...new Set(rewards.equipped)],
  };
  data.data.onTaskOtterSettings = {
    ...settings,
    otterName: settings.otterName ?? "Otter",
    favoriteSessions: settings.favoriteSessions ?? [],
    soundThresholds: settings.soundThresholds ?? {
      independent: activities.independent.threshold,
      partner: activities.partner.threshold,
    },
  };
  data.data.onTaskOtterHouse = {
    activeRoom: house.activeRoom,
    houseItemsOwned: [...new Set(house.houseItemsOwned)],
  };

  return data;
};

const restoreSaveFile = (data) => {
  importClassroomSave(data);
};

export { restoreSaveFile, validateSaveFile, createSaveFile, downloadSaveFile };
