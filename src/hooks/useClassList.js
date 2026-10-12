import { useEffect, useState } from "react";
import { CLASSES_KEY, loadClassList, saveData } from "../utils/storage.js";
import {
  addClass,
  currentClassOf,
  removeClass,
  renameClass,
  selectClass,
  updateCurrentClass,
} from "../utils/classList.js";

/** Every class on this computer, and which one is on screen. */
export const useClassList = () => {
  const [classList, setClassList] = useState(loadClassList);

  useEffect(() => {
    try {
      saveData(CLASSES_KEY, classList);
    } catch {
      // The app still works when browser storage is unavailable.
    }
  }, [classList]);

  /** Changes one part (progress, rewards or house) of the class on screen. */
  const setCurrentClassPart = (part) => (value) => setClassList((list) =>
    updateCurrentClass(list, (classroom) => ({
      ...classroom,
      [part]: typeof value === "function" ? value(classroom[part]) : value,
    }))
  );

  return {
    classList,
    currentClass: currentClassOf(classList),
    setProgress: setCurrentClassPart("progress"),
    setRewards: setCurrentClassPart("rewards"),
    setHouse: setCurrentClassPart("house"),
    add: (name) => setClassList((list) => addClass(list, name)),
    rename: (id, name) => setClassList((list) => renameClass(list, id, name)),
    remove: (id) => setClassList((list) => removeClass(list, id)),
    select: (id) => setClassList((list) => selectClass(list, id)),
  };
};
