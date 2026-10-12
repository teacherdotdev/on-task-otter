import { exportClassroomSave, importClassroomSave, SAVE_FILE_APP_NAME, SAVE_FILE_VERSION } from "./storage.js";
import { classFromSingleClassroom, firstClassList, updateOutfit } from "./classList.js";
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

const isValidSettings = (settings, validIds) =>
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

const isValidClass = (classroom, validIds) => {
  const { progress, rewards, house } = classroom ?? {};
  const validHistory = Array.isArray(progress?.history) && progress.history.every((session) =>
    session &&
    isFiniteNonNegativeNumber(session.minutes) &&
    isFiniteNonNegativeNumber(session.starsEarned) &&
    typeof session.date === "string" &&
    validIds.activities.includes(session.activity)
  );

  const validProgress =
    progress &&
    isFiniteNonNegativeNumber(progress.stars) &&
    isFiniteNonNegativeNumber(progress.totalStars) &&
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

  return typeof classroom.id === "string"
    && typeof classroom.name === "string"
    && validProgress
    && validRewards
    && validHouse;
};

/**
 * Version 1 files were made before a teacher could keep several classes. Their
 * one classroom becomes the first class.
 */
const SINGLE_CLASSROOM_SAVE_KEYS = [
  "onTaskOtterSettings",
  "onTaskOtterProgress",
  "onTaskOtterRewards",
  "onTaskOtterHouse",
];

const upgradeSingleClassroomSave = (save) => ({
  ...save,
  version: SAVE_FILE_VERSION,
  data: {
    onTaskOtterSettings: save.data.onTaskOtterSettings,
    onTaskOtterClasses: firstClassList(classFromSingleClassroom({
      progress: save.data.onTaskOtterProgress,
      rewards: save.data.onTaskOtterRewards,
      house: save.data.onTaskOtterHouse,
    })),
  },
});

const validateSaveFile = (file, validIds) => {
  if (
    !file
    || file.app !== SAVE_FILE_APP_NAME
    || ![1, SAVE_FILE_VERSION].includes(file.version)
    || !file.data
    || (file.version === 1 && !SINGLE_CLASSROOM_SAVE_KEYS.every((key) => file.data[key]))
  ) {
    throw new Error("Invalid classroom save file");
  }

  const data = file.version === 1 ? upgradeSingleClassroomSave(file) : file;
  const settings = data.data.onTaskOtterSettings;
  const classList = data.data.onTaskOtterClasses;
  if (Array.isArray(classList?.classes)) classList.classes = classList.classes.map(updateOutfit);

  if (
    !isValidSettings(settings, validIds)
    || !Array.isArray(classList?.classes)
    || classList.classes.length === 0
    || !classList.classes.every((classroom) => isValidClass(classroom, validIds))
  ) {
    throw new Error("Invalid classroom save file");
  }

  data.data.onTaskOtterSettings = {
    ...settings,
    otterName: settings.otterName ?? "Otter",
    favoriteSessions: settings.favoriteSessions ?? [],
    soundThresholds: settings.soundThresholds ?? {
      independent: activities.independent.threshold,
      partner: activities.partner.threshold,
    },
  };
  data.data.onTaskOtterClasses = {
    currentId: classList.classes.some((classroom) => classroom.id === classList.currentId)
      ? classList.currentId
      : classList.classes[0].id,
    classes: classList.classes.map((classroom) => ({
      ...classroom,
      rewards: {
        unlocked: [...new Set(classroom.rewards.unlocked)],
        equipped: [...new Set(classroom.rewards.equipped)],
      },
      house: {
        activeRoom: classroom.house.activeRoom,
        houseItemsOwned: [...new Set(classroom.house.houseItemsOwned)],
      },
    })),
  };

  return data;
};

const restoreSaveFile = (data) => {
  importClassroomSave(data);
};

export { restoreSaveFile, validateSaveFile, createSaveFile, downloadSaveFile };
