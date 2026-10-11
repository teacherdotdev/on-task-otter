import { useEffect, useRef, useState } from "react";
import { accessories } from "./data/accessories";
import { activities, soundThresholdOf } from "./data/activities";
import { houseItems, houseRooms } from "./data/houseItems";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMicrophone } from "./hooks/useMicrophone";
import { useRoomMonitor } from "./hooks/useRoomMonitor";
import { useFullScreen } from "./hooks/useFullScreen";
import { useTimer } from "./hooks/useTimer";
import { formatTime } from "./utils/formatTime";
import { playNoiseAlert } from "./utils/playNoiseAlert";
import { playTimerCompleteAlert } from "./utils/playTimerCompleteAlert";
import Header from "./components/Header/Header";
import NoiseCard from "./components/NoiseMeter/NoiseCard";
import TimerCard from "./components/Timer/TimerCard";
import HouseCard from "./components/House/HouseCard";
import SessionCompletionModal from "./components/SessionCompleteModal/SessionCompletionModal";
import ExportImportModal from "./components/ExportImport/ExportImportModal";
import ClearDataModal from "./components/ClearData/ClearDataModal";
import Footer from "./components/Footer/Footer";
import SupportButton from "./components/Support/SupportButton";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import { useRoute } from "./hooks/useRoute";
import { useTranslation } from "./i18n";
import { clearClassroomData } from "./utils/storage";

const Classroom = () => {
  const { t } = useTranslation();

  // persistent classroom data
  const [settings, setSettings] = useLocalStorage("onTaskOtterSettings", {
    activity: "independent",
    preferredMinutes: 15,
    otterName: "Otter",
    favoriteSessions: [],
    soundThresholds: {
      independent: activities.independent.threshold,
      partner: activities.partner.threshold,
    },
    trackSound: true,
  });
  const [progressData, setProgressData] = useLocalStorage("onTaskOtterProgress", {
    points: 0,
    totalPoints: 0,
    completedSessions: 0,
    history: [],
  });
  const [rewardData, setRewardData] = useLocalStorage("onTaskOtterRewards", {
    unlocked: [],
    equipped: [],
  });
  const [houseData, setHouseData] = useLocalStorage("onTaskOtterHouse", {
    activeRoom: "living",
    houseItemsOwned: [],
  });

  const {
    activity: savedActivity,
    preferredMinutes,
    otterName = t("otter.default"),
    favoriteSessions: savedFavoriteSessions = [],
    soundThresholds: savedSoundThresholds = {},
    trackSound = true,
  } = settings;
  const activity = activities[savedActivity] ? savedActivity : "partner";
  const favoriteSessions = Array.isArray(savedFavoriteSessions) ? savedFavoriteSessions : [];
  const soundThresholds = {
    independent: soundThresholdOf(savedSoundThresholds.independent, "independent"),
    partner: soundThresholdOf(savedSoundThresholds.partner, "partner"),
  };
  const { points, history = [] } = progressData;
  // Older saved classrooms may only have session history, not this total.
  const completedSessions = progressData.completedSessions ?? history.length;
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

  const saveFavoriteSession = (name, display) => setSettings((current) => ({
    ...current,
    favoriteSessions: [
      ...(Array.isArray(current.favoriteSessions) ? current.favoriteSessions : []),
      {
        id: Date.now(),
        name,
        ...display,
        soundThreshold: soundThresholds[activity],
        activity: activities[current.activity] ? current.activity : "partner",
        minutes: current.preferredMinutes,
        trackSound: current.trackSound ?? true,
      },
    ],
  }));

  const deleteFavoriteSession = (id) => setSettings((current) => ({
    ...current,
    favoriteSessions: (Array.isArray(current.favoriteSessions) ? current.favoriteSessions : [])
      .filter((favorite) => favorite.id !== id),
  }));

  const setPoints = (value) => setProgressData(
    (current) => (
      {
        ...current, points: typeof value === "function"
          ? value(current.points)
          : value
      }
    ));
  const setTotalPoints = (value) => setProgressData(
    (current) => (
      {
        ...current, totalPoints: typeof value === "function"
          ? value(current.totalPoints)
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
    const completedSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      minutes: completedMinutes,
      activity,
      pointsEarned: completedMinutes,
    };
    setPoints((value) => value + completedMinutes);
    setTotalPoints((value) => value + completedMinutes);
    setCompletedSessions((value) => value + 1);
    setHistory((sessions) => [completedSession, ...sessions]);
    stopTimerAlert.current = playTimerCompleteAlert();
    setIsTimerAlertPlaying(true);
    setShowComplete(true);
  }, [activity, setCompletedSessions, setHistory, setPoints, setTotalPoints, timer.durationSeconds, timer.isComplete]);

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

  const sessionCount = completedSessions;

  const unlockedRoomIds = houseRooms
    .filter((room, index) => {
      const earlierRooms = houseRooms.slice(0, index);
      return earlierRooms.every((earlierRoom) =>
        houseItems
          .filter((item) => item.room === earlierRoom.id)
          .every((item) => houseItemsOwned.includes(item.id))
      );
    })
    .map((room) => room.id);

  const buyOrEquip = (item) => {
    if (unlocked.includes(item.id)) {
      setEquipped(
        (items) => items.includes(item.id) 
        ? items.filter((id) => id !== item.id) 
        : [...items, item.id]
      );
      return;
    }
    if (points < item.cost) return;
    setPoints((value) => value - item.cost);
    setUnlocked((items) => [...items, item.id]);
    setEquipped((items) => [...items, item.id]);
  }

  const chooseDuration = (seconds) => {
    timer.chooseDuration(seconds);
    setPreferredMinutes(seconds / 60);
  };

  const buyHouseItem = (item) => {
    if (
      !unlockedRoomIds.includes(item.room)
      || houseItemsOwned.includes(item.id) 
      || points < item.cost
    ) return;

    setPoints((value) => value - item.cost);
    setHouseItemsOwned((items) => [...items, item.id]);
  }

  // Preview mode lets a teacher walk through every room and every customization
  // at once, so they can show a class where the year is heading. Nothing chosen
  // in preview is saved: the class keeps the points, rooms, and decorations it
  // actually earned.
  const [preview, setPreview] = useState(null);
  const isPreviewing = preview !== null;

  const startPreview = () => setPreview({
    activeRoom: houseRooms[0].id,
    houseItemsOwned: houseItems.map((item) => item.id),
    equipped: accessories.map((item) => item.id),
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
    : unlockedRoomIds.includes(activeRoom)
      ? activeRoom
      : unlockedRoomIds.at(-1);
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

  /** In preview every piece is free to place or take away again. */
  const placeOrBuyHouseItem = (item) => {
    if (!isPreviewing) return buyHouseItem(item);
    setPreview((current) => ({
      ...current,
      houseItemsOwned: togglePreviewId(current.houseItemsOwned, item.id),
    }));
  };

  const wearOrBuyAccessory = (item) => {
    if (!isPreviewing) return buyOrEquip(item);
    setPreview((current) => ({
      ...current,
      equipped: togglePreviewId(current.equipped, item.id),
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
    setCalibrating,
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
    points,
    accessories,
    unlocked: shownUnlocked,
    equipped: shownEquipped,
    buyOrEquip: wearOrBuyAccessory,
    isPreviewing,
  };

  const house = {
    points,
    houseRooms,
    activeRoom: shownActiveRoom,
    setActiveRoom: chooseRoom,
    activeRoomDetails,
    roomDecorations,
    houseItems,
    houseItemsOwned: shownHouseItemsOwned,
    buyHouseItem: placeOrBuyHouseItem,
    unlockedRoomIds: isPreviewing ? houseRooms.map((room) => room.id) : unlockedRoomIds,
    equipped: shownEquipped,
    isPreviewing,
    startPreview,
    stopPreview,
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
    },
    onTaskOtterProgress: {
      ...progressData,
      completedSessions: sessionCount,
    },
    onTaskOtterRewards: rewardData,
    onTaskOtterHouse: houseData,
  };

  const header = {
    points,
    onOpenExportImport: () => setShowExportImport(true),
  };

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
    <main className={`app-shell mode-${appMode} ${isPreviewing ? "previewing" : ""} ${isFocusFullScreen ? "full-screen" : ""}`}>
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

      {appMode === "focus" && fullScreen.isSupported && (
        <button
          className="outline full-screen-toggle"
          type="button"
          onClick={isFocusFullScreen ? fullScreen.exit : fullScreen.enter}
        >
          {isFocusFullScreen ? t("app.fullScreen.exit") : t("app.fullScreen.enter")}
        </button>
      )}

      <HouseCard house={house} rewards={rewards} focusMode={appMode === "focus"} />

      <div className="dashboard-grid focus-controls">
        <TimerCard timerSettings={timerSettings} session={session} noise={noise} focusMode={appMode === "focus"} />

        {appMode === "focus" && trackSound && !timer.isComplete && (timer.isRunning || timer.secondsRemaining < timer.durationSeconds) && <NoiseCard noise={noise} focusMode />}

      </div>

      {appMode === "configure" && <div className="clear-data-section">
        <button className="preview-trigger" type="button" onClick={isPreviewing ? stopPreview : startPreview}>
          {isPreviewing ? t("app.preview.stop") : t("app.preview.start")}
        </button>
        <button className="clear-data-trigger" type="button" onClick={() => setShowClearData(true)}>
          {t("app.eraseData")}
        </button>
      </div>}

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

      {showClearData && (
        <ClearDataModal
          classroomData={classroomData}
          onClose={() => setShowClearData(false)}
          onConfirm={eraseSavedData}
        />
      )}

      <Footer />
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
    </>
  );
};

export default App;
