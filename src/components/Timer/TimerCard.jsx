import TimerControls from "./TimerControls";
import LaunchBar from "./LaunchBar";
import SoundPanel from "../NoiseMeter/SoundPanel";

// On-task mode's session controls. They live inside the otter's room: the launch
// bar under it before a session, then the timer on the wall and the sound
// meter on the floor once the session has begun.
const TimerCard = ({ timerSettings, session, noise }) => {
  const { timer } = timerSettings;
  // Kept by the app rather than here, so the session keeps its countdown
  // setting when the room floats out of the tab and back.
  const { showCountdown, hiddenTimerMode } = session.display;
  const hasStarted = timer.isRunning || timer.secondsRemaining < timer.durationSeconds;

  const launchSession = (setup) => {
    session.setDisplay({
      showCountdown: setup.showCountdown ?? true,
      // "none", "generic", "progressive"
      hiddenTimerMode: setup.hiddenTimerMode ?? "none",
    });
    session.startSession(setup);
  };

  if (!hasStarted) return <LaunchBar session={session} onLaunch={launchSession} />;

  return (
    <>
      <TimerControls timerSettings={timerSettings} showCountdown={showCountdown} hiddenTimerMode={hiddenTimerMode} />
      {noise.trackSound && !timer.isComplete && <SoundPanel noise={noise} />}
    </>
  )
}

export default TimerCard;
