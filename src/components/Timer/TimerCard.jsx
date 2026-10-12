import { useState } from "react";
import TimerControls from "./TimerControls";
import LaunchBar from "./LaunchBar";
import SoundPanel from "../NoiseMeter/SoundPanel";

// Focus mode's session controls. They live inside the otter's room: the launch
// bar under it before a session, then the timer on the wall and the sound
// meter on the floor once the session has begun.
const TimerCard = ({ timerSettings, session, noise }) => {
  const { timer } = timerSettings;
  const [showCountdown, setShowCountdown] = useState(true);

  // "none", "generic", "progressive"
  const [hiddenTimerMode, setHiddenTimerMode] = useState("none");
  const hasStarted = timer.isRunning || timer.secondsRemaining < timer.durationSeconds;

  const launchSession = (setup) => {
    setShowCountdown(setup.showCountdown ?? true);
    setHiddenTimerMode(setup.hiddenTimerMode ?? "none");
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
