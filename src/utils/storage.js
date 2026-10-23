import { classFromSingleClassroom, firstClassList, giveOtterName, isClassList, updateOutfit } from "./classList.js";

export const SAVE_FILE_APP_NAME = "On-task Otter";
export const SAVE_FILE_VERSION = 2;

export const SETTINGS_KEY = "onTaskOtterSettings";
export const CLASSES_KEY = "onTaskOtterClasses";

export const CLASSROOM_STORAGE_KEYS = [SETTINGS_KEY, CLASSES_KEY];

// Before a teacher could keep several classes, the one classroom's progress
// lived in these keys. They are moved into the first class the next time the
// page opens.
const SINGLE_CLASSROOM_KEYS = {
  progress: "onTaskOtterProgress",
  rewards: "onTaskOtterRewards",
  house: "onTaskOtterHouse",
};

const readStoredValue = (key) => {
  const value = localStorage.getItem(key);
  return value === null ? undefined : JSON.parse(value);
}

export const saveData = (key, value) => {
  if (!CLASSROOM_STORAGE_KEYS.includes(key)) {
    throw new Error("Unknown On-task Otter storage key");
  }
  localStorage.setItem(key, JSON.stringify(value));
}

const removeSingleClassroomKeys = () => {
  for (const key of Object.values(SINGLE_CLASSROOM_KEYS)) {
    localStorage.removeItem(key);
  }
}

export const clearClassroomData = () => {
  for (const key of CLASSROOM_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
  removeSingleClassroomKeys();
}

export const loadData = (key, fallback) => {
  if (!CLASSROOM_STORAGE_KEYS.includes(key)) return fallback;

  try {
    const saved = readStoredValue(key);
    return saved === undefined ? fallback : saved;
  } catch {
    return fallback;
  }
}

const readSingleClassroom = () => {
  const classroom = {};
  for (const [part, key] of Object.entries(SINGLE_CLASSROOM_KEYS)) {
    try {
      classroom[part] = readStoredValue(key);
    } catch {
      classroom[part] = undefined;
    }
  }
  return classroom;
}

/** The saved classes, or a first class holding whatever was saved before classes existed. */
export const loadClassList = () => {
  // Saves from before each class named its own otter keep the one shared name
  // in the settings.
  const sharedOtterName = loadData(SETTINGS_KEY)?.otterName;
  const saved = loadData(CLASSES_KEY);
  if (isClassList(saved)) {
    return {
      ...saved,
      classes: saved.classes.map((classroom) => updateOutfit(giveOtterName(classroom, sharedOtterName))),
    };
  }

  try {
    const list = firstClassList(updateOutfit(classFromSingleClassroom({
      ...readSingleClassroom(),
      otterName: sharedOtterName,
    })));
    saveData(CLASSES_KEY, list);
    removeSingleClassroomKeys();
    return list;
  } catch {
    // Browser storage is unavailable: the class lasts until the page closes.
    return firstClassList();
  }
}

export const exportClassroomSave = (data) => ({
  app: SAVE_FILE_APP_NAME,
  version: SAVE_FILE_VERSION,
  createdAt: new Date().toISOString(),
  data,
});

export const importClassroomSave = (save) => {
  if (!save || save.app !== SAVE_FILE_APP_NAME || save.version !== SAVE_FILE_VERSION || !save.data) {
    throw new Error("Invalid classroom save file");
  }

  for (const key of CLASSROOM_STORAGE_KEYS) {
    if (!(key in save.data)) throw new Error("Invalid classroom save file");
  }

  for (const key of CLASSROOM_STORAGE_KEYS) {
    saveData(key, save.data[key]);
  }
  removeSingleClassroomKeys();
}
