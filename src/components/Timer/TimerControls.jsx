import EncouragementMessage from "./EncouragementMessage";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// The session timer sits in the bottom-left corner of the otter's room.
const TimerControls = ({ timerSettings, showCountdown, hiddenTimerMode }) => {
  const { t } = useTranslation();
  const { timer, noiseTone, formatTime, needsTeacherResume, resumeAfterNoise, resetTimer } = timerSettings;

  const message = <EncouragementMessage mode={hiddenTimerMode} timer={timer} noiseTone={noiseTone}/>

  return (
    <section className="scene-timer" aria-label={t("session.label")}>
      <div className={`timer-display ${showCountdown ? "" : "time-hidden"}`} aria-live="off">
        {showCountdown ? formatTime(timer.secondsRemaining) : message}
      </div>

      {needsTeacherResume && <p className="timer-caption">{t("session.waiting")}</p>}

      <div className="scene-timer-buttons">
        <button
          className="scene-timer-main"
          type="button"
          onClick={needsTeacherResume ? resumeAfterNoise : timer.toggle}
          disabled={timer.isComplete}
        >
          {!timer.isComplete && <Icon name={timer.isRunning ? "pause" : "play"} />}
          {/* The timer only shows once a session has begun, so a stopped one is paused. */}
          {timer.isRunning
            ? t("session.pause")
            : timer.isComplete
            ? t("session.complete")
            : t("session.resume")}
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
