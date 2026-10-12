import EncouragementMessage from "./EncouragementMessage";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// The session timer hangs on the wall of the otter's room, like a classroom clock.
const TimerControls = ({ timerSettings, showCountdown, hiddenTimerMode }) => {
  const { t } = useTranslation();
  const { timer, noiseTone, formatTime, needsTeacherResume, resumeAfterNoise, resetTimer } = timerSettings;

  const message = <EncouragementMessage mode={hiddenTimerMode} timer={timer} noiseTone={noiseTone}/>

  return (
    <section className="scene-timer" aria-label={t("session.label")}>
      <div className={`timer-display ${showCountdown ? "" : "time-hidden"}`} aria-live="off">
        {showCountdown ? formatTime(timer.secondsRemaining) : message}
      </div>

      <p className="timer-caption">
        {needsTeacherResume
          ? t("session.waiting")
          : timer.isRunning
          ? t("session.building")
          : showCountdown
          ? t("session.lengthCaption", { minutes: timer.durationSeconds / 60 })
          : t("session.label")}
      </p>

      <div className="scene-timer-buttons">
        <button
          className="scene-timer-main"
          type="button"
          onClick={needsTeacherResume ? resumeAfterNoise : timer.toggle}
          disabled={timer.isComplete}
        >
          {!timer.isComplete && <Icon name={timer.isRunning ? "pause" : "play"} />}
          {timer.isRunning
            ? t("session.pause")
            : timer.isComplete
            ? t("session.complete")
            : needsTeacherResume
            ? t("session.resume")
            : t("session.startShort")}
        </button>

        <button
          className="scene-timer-reset"
          type="button"
          aria-label={t("session.reset")}
          title={t("session.reset")}
          onClick={resetTimer}
        >
          <Icon name="reset" />
        </button>
      </div>
    </section>
  )
}

export default TimerControls;
