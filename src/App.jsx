import { useEffect, useRef, useState } from "react";
import { accessories, accessorySlots, toggleWorn } from "./data/accessories";
import { activities, soundThresholdOf } from "./data/activities";
import { hasSupport, houseItems, houseRooms } from "./data/houseItems";
import { DEFAULT_STARS_PER_MINUTE, starsPerMinuteOf } from "./data/stars";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useClassList } from "./hooks/useClassList";
import { useMicrophone } from "./hooks/useMicrophone";
import { useRoomMonitor } from "./hooks/useRoomMonitor";
import { useFullScreen } from "./hooks/useFullScreen";
import { useTimer } from "./hooks/useTimer";
import { formatTime } from "./utils/formatTime";
import { playNoiseAlert } from "./utils/playNoiseAlert";
import { playTimerCompleteAlert } from "./utils/playTimerCompleteAlert";
import Header from "./components/Header/Header";
import TimerCard from "./components/Timer/TimerCard";
import HouseCard from "./components/House/HouseCard";
import SessionPresets from "./components/SessionSettings/SessionPresets";
import SessionCompletionModal from "./components/SessionCompleteModal/SessionCompletionModal";
import ExportImportModal from "./components/ExportImport/ExportImportModal";
import ClearDataModal from "./components/ClearData/ClearDataModal";
import ClassesModal from "./components/Classes/ClassesModal";
import MicrophoneModal from "./components/Microphone/MicrophoneModal";
import SettingsSidebar from "./components/Settings/SettingsSidebar";
import Footer from "./components/Footer/Footer";
import Icon from "./components/Icon/Icon";
import LanguagePicker from "./components/Language/LanguagePicker";
import SupportButton from "./components/Support/SupportButton";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import { useRoute } from "./hooks/useRoute";
import { useTranslation } from "./i18n";
import { clearClassroomData, SETTINGS_KEY } from "./utils/storage";

const Classroom = () => {
  const { t } = useTranslation();

  // persistent classroom data
  const [settings, setSettings] = useLocalStorage(SETTINGS_KEY, {
    activity: "independent",
    preferredMinutes: 15,
    otterName: "Otter",
    favoriteSessions: [],
    soundThresholds: {
      independent: activities.independent.threshold,
      partner: activities.partner.threshold,
    },
    trackSound: true,
    starsPerMinute: DEFAULT_STARS_PER_MINUTE,
  });
  // Each class earns its own stars and keeps its own otter outfit and rooms.
  const classes = useClassList();
  const {
    progress: progressData,
    rewards: rewardData,
    house: houseData,
  } = classes.currentClass;
  const {
    setProgress: setProgressData,
    setRewards: setRewardData,
    setHouse: setHouseData,
  } = classes;

  const {
    activity: savedActivity,
    preferredMinutes,
    otterName = t("otter.default"),
    favoriteSessions: savedFavoriteSessions = [],
    soundThresholds: savedSoundThresholds = {},
    trackSound = true,
    starsPerMinute: savedStarsPerMinute,
  } = settings;
  const activity = activities[savedActivity] ? savedActivity : "partner";
  const favoriteSessions = Array.isArray(savedFavoriteSessions) ? savedFavoriteSessions : [];
  const soundThresholds = {
    independent: soundThresholdOf(savedSoundThresholds.independent, "independent"),
    partner: soundThresholdOf(savedSoundThresholds.partner, "partner"),
  };
  const starsPerMinute = starsPerMinuteOf(savedStarsPerMinute);
  const { stars } = progressData;
  const { unlocked, equipped } = rewardData;
  const { activeRoom, houseItemsOwned } = houseData;

  const setActivity = (value) => setSettings(
    (current) => (
      {
        ...current, activity: typeof value === "function"
          ? value(current.activity)
          : value
      }
    ));

  const setPreferredMinutes = (value) => setSettings(
    (current) => (
      {
        ...current, preferredMinutes: typeof value === "function"
          ? value(current.preferredMinutes)
          : value
      }
    ));

  const setOtterName = (value) => setSettings(
    (current) => ({ ...current, otterName: value })
  );

  const setSoundThreshold = (activityId, value) => setSettings((current) => ({
    ...current,
    soundThresholds: {
      independent: soundThresholdOf(current.soundThresholds?.independent, "independent"),
      partner: soundThresholdOf(current.soundThresholds?.partner, "partner"),
      [activityId]: value,
    },
  }));

  const setTrackSound = (value) => setSettings((current) => ({
    ...current,
    trackSound: typeof value === "function" ? value(current.trackSound ?? true) : value,
  }));

  const setStarsPerMinute = (value) => setSettings((current) => ({
    ...current,
    starsPerMinute: starsPerMinuteOf(value),
  }));

  /** A preset is a named snapshot of the session settings as they are now. */
  const presetFromSettings = (current, name, display) => ({
    name,
    ...display,
    soundThreshold: soundThresholds[activity],
    activity: activities[current.activity] ? current.activity : "partner",
    minutes: current.preferredMinutes,
    trackSound: current.trackSound ?? true,
  });

  const saveFavoriteSession = (name, display) => setSettings((current) => ({
    ...current,
    favoriteSessions: [
      ...(Array.isArray(current.favoriteSessions) ? current.favoriteSessions : []),
      { id: Date.now(), ...presetFromSettings(current, name, display) },
    ],
  }));

  const updateFavoriteSession = (id, name, display) => setSettings((current) => ({
    ...current,
    favoriteSessions: (Array.isArray(current.favoriteSessions) ? current.favoriteSessions : [])
      .map((favorite) => favorite.id === id ? { ...favorite, ...presetFromSettings(current, name, display) } : favorite),
  }));

  const deleteFavoriteSession = (id) => setSettings((current) => ({
    ...current,
    favoriteSessions: (Array.isArray(current.favoriteSessions) ? current.favoriteSessions : [])
      .filter((favorite) => favorite.id !== id),
  }));

  const setStars = (value) => setProgressData(
    (current) => (
      {
        ...current, stars: typeof value === "function"
          ? value(current.stars)
          : value
      }
    ));
  const setTotalStars = (value) => setProgressData(
    (current) => (
      {
        ...current, totalStars: typeof value === "function"
          ? value(current.totalStars)
          : value
      }
    ));
  const setCompletedSessions = (value) => setProgressData(
    (current) => (
      {
        ...current, completedSessions: typeof value === "function"
          ? value(current.completedSessions)
          : value
      }
    ));
  const setHistory = (value) => setProgressData(
    (current) => (
      {
        ...current, history: typeof value === "function"
          ? value(current.history)
          : value
      }
    ));
  const setUnlocked = (value) => setRewardData(
    (current) => (
      {
        ...current, unlocked: typeof value === "function"
          ? value(current.unlocked)
          : value
      }
    ));
  const setEquipped = (value) => setRewardData(
    (current) => (
      {
        ...current, equipped: typeof value === "function"
          ? value(current.equipped)
          : value
      }
    ));
  const setActiveRoom = (value) => setHouseData(
    (current) => (
      {
        ...current, activeRoom: typeof value === "function"
          ? value(current.activeRoom)
          : value
      }
    ));
  const setHouseItemsOwned = (value) => setHouseData(
    (current) => (
      {
        ...current, houseItemsOwned: typeof value === "function"
          ? value(current.houseItemsOwned)
          : value
      }
    ));

  // temporary session state
  const [showComplete, setShowComplete] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);
  const [showClearData, setShowClearData] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showMicrophone, setShowMicrophone] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const openMicrophoneSetup = () => setShowMicrophone(true);
  const [appMode, setAppMode] = useState("configure");
  const fullScreen = useFullScreen();
  const isFocusFullScreen = appMode === "focus" && fullScreen.isFullScreen;

  // runtime state
  const expectation = { ...activities[activity], threshold: soundThresholds[activity] };
  const microphone = useMicrophone();
  const timer = useTimer(preferredMinutes);
  const pauseTimer = timer.pause;
  /**
   * True while the calibration popup is open. The class is being asked to
   * talk on purpose, so the room is not judged.
   */
  const [calibrating, setCalibrating] = useState(false);
  const [needsTeacherResume, setNeedsTeacherResume] = useState(false);
  // The room is only judged while the session runs: a teacher who pauses to
  // make an announcement is never blamed for their own voice.
  const monitor = useRoomMonitor({
    readLevel: microphone.readLevel,
    goal: expectation.threshold,
    judging: microphone.status === "on" && !calibrating && timer.isRunning,
  });
  const isTooLoud = monitor.state === "too-loud";

  const noiseTone = microphone.status !== "on"
    ? "neutral"
    : needsTeacherResume || isTooLoud
      ? "loud"
      : !timer.isRunning
        ? "neutral"
        : microphone.level <= expectation.threshold
          ? "good"
          : "warn";

  const noiseMessage = microphone.status !== "on"
    ? t("noise.ready")
    : needsTeacherResume
      ? t("noise.paused")
      : noiseTone === "neutral"
        ? t("noise.ready")
        : noiseTone === "good"
          ? t("noise.onTrack")
          : noiseTone === "warn"
            ? t("noise.gettingLoud")
            : t("noise.tooLoud");

  const recordedCompletion = useRef(false);
  const stopTimerAlert = useRef(null);
  const [isTimerAlertPlaying, setIsTimerAlertPlaying] = useState(false);

  useEffect(() => {
    if (!isTooLoud || !trackSound || !timer.isRunning) return;
    setNeedsTeacherResume(true);
    pauseTimer();
    playNoiseAlert();
  }, [isTooLoud, pauseTimer, timer.isRunning, trackSound]);

  useEffect(() => {
    if (timer.isComplete && microphone.status === "on") microphone.stop();
  }, [microphone.status, microphone.stop, timer.isComplete]);

  const resumeAfterNoise = () => {
    setNeedsTeacherResume(false);
    timer.resume();
  };

  const resetTimer = () => {
    microphone.stop();
    setNeedsTeacherResume(false);
    timer.reset();
  };

  useEffect(() => {
    if (!timer.isComplete) {
      recordedCompletion.current = false;
      return;
    }
    if (recordedCompletion.current) return;
    recordedCompletion.current = true;
    const completedMinutes = timer.durationSeconds / 60;
    const starsEarned = completedMinutes * starsPerMinute;
    const completedSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      minutes: completedMinutes,
      activity,
      starsEarned,
    };
    setStars((value) => value + starsEarned);
    setTotalStars((value) => value + starsEarned);
    setCompletedSessions((value) => value + 1);
    setHistory((sessions) => [completedSession, ...sessions]);
    stopTimerAlert.current = playTimerCompleteAlert();
    setIsTimerAlertPlaying(true);
    setShowComplete(true);
  }, [activity, setCompletedSessions, setHistory, setStars, setTotalStars, starsPerMinute, timer.durationSeconds, timer.isComplete]);

  const silenceTimerAlert = () => {
    stopTimerAlert.current?.();
    stopTimerAlert.current = null;
    setIsTimerAlertPlaying(false);
  };

  const closeCompletionModal = () => {
    silenceTimerAlert();
    setShowComplete(false);
  };

  useEffect(() => () => stopTimerAlert.current?.(), []);

  useEffect(() => {
    if (!showComplete) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeCompletionModal();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showComplete, closeCompletionModal]);

  const buyOrEquip = (item) => {
    if (unlocked.includes(item.id)) {
      setEquipped((items) => toggleWorn(items, item.id));
      return;
    }
    if (stars < item.cost) return;
    setStars((value) => value - item.cost);
    setUnlocked((items) => [...items, item.id]);
    setEquipped((items) => toggleWorn(items, item.id));
  }

  const chooseDuration = (seconds) => {
    timer.chooseDuration(seconds);
    setPreferredMinutes(seconds / 60);
  };

  const buyHouseItem = (item) => {
    if (houseItemsOwned.includes(item.id) || !hasSupport(item, houseItemsOwned) || stars < item.cost) return;

    setStars((value) => value - item.cost);
    setHouseItemsOwned((items) => [...items, item.id]);
  }

  // Preview mode lets a teacher walk through every room and every customization
  // at once, so they can show a class where the year is heading. Nothing chosen
  // in preview is saved: the class keeps the stars, rooms, and decorations it
  // actually earned.
  const [preview, setPreview] = useState(null);
  const isPreviewing = preview !== null;

  const startPreview = () => setPreview({
    activeRoom: houseRooms[0].id,
    houseItemsOwned: houseItems.map((item) => item.id),
    // The fanciest hat and glasses, to show what the class is working towards.
    equipped: accessorySlots.map((slot) => accessories.findLast((item) => item.slot === slot).id),
    otterName,
  });

  const stopPreview = () => setPreview(null);

  const enterFocusMode = () => {
    stopPreview();
    setAppMode("focus");
  };

  const togglePreviewId = (ids, id) =>
    ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id];

  // What the screen shows: the preview classroom while previewing, the real one
  // the rest of the time.
  const shownActiveRoom = isPreviewing
    ? preview.activeRoom
    : houseRooms.some((room) => room.id === activeRoom)
      ? activeRoom
      : houseRooms[0].id;
  const shownHouseItemsOwned = isPreviewing ? preview.houseItemsOwned : houseItemsOwned;
  const shownEquipped = isPreviewing ? preview.equipped : equipped;
  const shownUnlocked = isPreviewing ? accessories.map((item) => item.id) : unlocked;
  const shownOtterName = isPreviewing ? preview.otterName : otterName;

  const changeOtterName = (name) => {
    if (!isPreviewing) return setOtterName(name);
    setPreview((current) => ({ ...current, otterName: name }));
  };

  const chooseRoom = (room) => {
    if (!isPreviewing) return setActiveRoom(room);
    setPreview((current) => ({ ...current, activeRoom: room }));
  };

  /**
   * In preview every piece is free to place or take away again. Taking a piece
   * away also takes away whatever sits on it, so nothing is left floating.
   */
  const placeOrBuyHouseItem = (item) => {
    if (!isPreviewing) return buyHouseItem(item);
    setPreview((current) => {
      const owned = current.houseItemsOwned;
      if (!owned.includes(item.id) && !hasSupport(item, owned)) return current;
      const placed = togglePreviewId(owned, item.id);
      return {
        ...current,
        houseItemsOwned: placed.filter((id) => hasSupport(houseItems.find((piece) => piece.id === id), placed)),
      };
    });
  };

  const wearOrBuyAccessory = (item) => {
    if (!isPreviewing) return buyOrEquip(item);
    setPreview((current) => ({
      ...current,
      equipped: toggleWorn(current.equipped, item.id),
    }));
  };

  const activeRoomDetails = houseRooms.find((room) => room.id === shownActiveRoom);
  const roomDecorations = houseItems.filter(
    (item) => item.room === shownActiveRoom && shownHouseItemsOwned.includes(item.id)
  );

  const session = {
    timer,
    activity,
    activities,
    chooseDuration,
    setActivity,
    favoriteSessions,
    saveFavoriteSession,
    updateFavoriteSession,
    deleteFavoriteSession,
    trackSound,
    setTrackSound,
    setSoundThreshold,
    startSession: ({ minutes, activity: nextActivity, trackSound: shouldTrackSound, soundThreshold }) => {
      if (Number.isFinite(soundThreshold)) setSoundThreshold(nextActivity, soundThreshold);
      if (shouldTrackSound) microphone.start();
      else microphone.stop();
      chooseDuration(minutes * 60);
      setActivity(nextActivity);
      setTrackSound(shouldTrackSound);
      timer.toggle();
    },
  };

  const noise = {
    noiseMessage,
    noiseTone,
    expectation,
    microphone,
    activity,
    activities,
    setActivity,
    soundThresholds,
    trackSound,
    setTrackSound,
    setSoundThreshold,
    isTooLoud,
    openMicrophoneSetup,
  };

  const timerSettings = {
    timer,
    expectation,
    noiseTone,
    formatTime,
    needsTeacherResume,
    resumeAfterNoise,
    resetTimer,
  };

  const rewards = {
    stars,
    accessories,
    unlocked: shownUnlocked,
    equipped: shownEquipped,
    buyOrEquip: wearOrBuyAccessory,
    isPreviewing,
  };

  const house = {
    stars,
    houseRooms,
    activeRoom: shownActiveRoom,
    setActiveRoom: chooseRoom,
    activeRoomDetails,
    roomDecorations,
    houseItems,
    houseItemsOwned: shownHouseItemsOwned,
    buyHouseItem: placeOrBuyHouseItem,
    equipped: shownEquipped,
    isPreviewing,
    isCelebrating: showComplete,
    isFocusing: appMode === "focus" && timer.isRunning,
    noiseTone,
    otterName: shownOtterName,
    setOtterName: changeOtterName,
  };

  const classroomData = {
    onTaskOtterSettings: {
      ...settings,
      activity,
      otterName,
      favoriteSessions: favoriteSessions.map((favorite) => ({
        ...favorite,
        activity: activities[favorite.activity] ? favorite.activity : "partner",
      })),
      soundThresholds,
      trackSound,
      starsPerMinute,
    },
    // The save file carries every class, not only the one on screen.
    onTaskOtterClasses: classes.classList,
  };

  // A session belongs to the class that started it, so switching classes
  // starts the next one fresh.
  const switchClass = (id) => {
    if (id === classes.currentClass.id) return;
    resetTimer();
    stopPreview();
    classes.select(id);
  };

  const removeClass = (id) => {
    if (id === classes.currentClass.id) {
      resetTimer();
      stopPreview();
    }
    classes.remove(id);
  };

  const header = {
    onOpenMicrophone: openMicrophoneSetup,
    classes: {
      list: classes.classList.classes,
      currentId: classes.currentClass.id,
      select: switchClass,
      onEdit: () => setShowClasses(true),
    },
  };

  const teacherSettings = {
    isPreviewing,
    startPreview,
    stopPreview,
    starsPerMinute,
    setStarsPerMinute,
    sessionMinutes: timer.durationSeconds / 60,
    openSaveFile: () => setShowExportImport(true),
  };

  const hasSessionStarted = timer.isRunning || timer.secondsRemaining < timer.durationSeconds;
  const isLaunching = appMode === "focus" && !hasSessionStarted;

  const validSaveIds = {
    activities: [...Object.keys(activities), "presentation"],
    accessories: accessories.map((item) => item.id),
    houseItems: houseItems.map((item) => item.id),
    rooms: houseRooms.map((room) => room.id),
  };

  const eraseSavedData = () => {
    clearClassroomData();
    window.location.reload();
  };

  return (
    <main className={`app-shell mode-${appMode} ${isPreviewing ? "previewing" : ""} ${isFocusFullScreen ? "full-screen" : ""} ${isLaunching ? "launching" : ""}`}>
      {/* Everything above the footer grows to fill the screen, so the footer
          sits at the bottom of the window even when the page is short. */}
      <div className="app-content">
      {isPreviewing && (
        <div className="preview-bar" role="status">
          <b>{t("app.preview.title")}</b>
          <small>{t("app.preview.body")}</small>
          <button className="outline" type="button" onClick={stopPreview}>{t("app.preview.exit")}</button>
        </div>
      )}

      <Header header={header} />

      <nav className="mode-switcher" aria-label={t("app.mode.label")}>
        <button
          className={appMode === "configure" ? "selected" : ""}
          type="button"
          aria-pressed={appMode === "configure"}
          onClick={() => setAppMode("configure")}
        >
          {t("app.mode.configure")}
        </button>
        <button
          className={appMode === "focus" ? "selected" : ""}
          type="button"
          aria-pressed={appMode === "focus"}
          onClick={enterFocusMode}
        >
          {t("app.mode.focus")}
        </button>
      </nav>

      <HouseCard house={house} rewards={rewards} focusMode={appMode === "focus"} fullScreen={fullScreen}>
        <TimerCard timerSettings={timerSettings} session={session} noise={noise} />
      </HouseCard>

      {appMode === "configure" && <SessionPresets session={session} noise={noise} />}

      <SessionCompletionModal
        equipped={shownEquipped}
        showComplete={showComplete}
        isTimerAlertPlaying={isTimerAlertPlaying}
        onClose={closeCompletionModal}
        onSilenceAlert={silenceTimerAlert}
        duration={t("complete.duration", { minutes: timer.durationSeconds / 60 })}
      />

      {showExportImport && (
        <ExportImportModal
          classroomData={classroomData}
          validIds={validSaveIds}
          onClose={() => setShowExportImport(false)}
        />
      )}

      {showMicrophone && (
        <MicrophoneModal
          microphone={microphone}
          setCalibrating={setCalibrating}
          onClose={() => setShowMicrophone(false)}
        />
      )}

      {showClasses && (
        <ClassesModal
          classes={classes.classList.classes}
          currentId={classes.currentClass.id}
          onAdd={classes.add}
          onRename={classes.rename}
          onDelete={removeClass}
          onClose={() => setShowClasses(false)}
        />
      )}

      {showSettings && (
        <SettingsSidebar settings={teacherSettings} onClose={() => setShowSettings(false)} />
      )}

      {showClearData && (
        <ClearDataModal
          classroomData={classroomData}
          onClose={() => setShowClearData(false)}
          onConfirm={eraseSavedData}
        />
      )}
      </div>

      <Footer />

      {/* Settings sit in the page's bottom-right corner, opposite the language
          and help buttons, while the classroom is being set up. */}
      {appMode === "configure" && (
        <button
          className="settings-trigger"
          type="button"
          aria-label={t("settings.open")}
          aria-haspopup="dialog"
          aria-expanded={showSettings}
          data-tooltip={t("settings.open")}
          onClick={() => setShowSettings(true)}
        >
          <Icon name="settings" />
        </button>
      )}
    </main>
  );
};

const App = () => {
  const route = useRoute();
  const page = route === "/about"
    ? <AboutPage />
    : route === "/privacy"
      ? <PrivacyPage />
      : <Classroom />;

  return (
    <>
      {page}
      <SupportButton />
      <LanguagePicker />
    </>
  );
};

export default App;
