import { useEffect, useRef, useState } from "react";
import { after } from "../utils/clock";

/** How often the countdown checks the time. Well under a second, so it never skips one. */
const TICK_MS = 250;

export const useTimer = (initialMinutes) => {
  const initialSeconds = initialMinutes * 60;
  const [durationSeconds, setDurationSeconds] = useState(initialSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const secondsRemainingRef = useRef(secondsRemaining);
  secondsRemainingRef.current = secondsRemaining;

  // The countdown works out the time left from when it will end, rather than
  // counting ticks: a browser can slow a hidden tab's timers right down, and
  // the session must still end on time.
  useEffect(() => {
    if (!isRunning) return;
    const endsAt = performance.now() + secondsRemainingRef.current * 1000;
    let cancelTick;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((endsAt - performance.now()) / 1000));
      setSecondsRemaining(seconds);
      if (seconds > 0) cancelTick = after(TICK_MS, tick);
    };
    cancelTick = after(TICK_MS, tick);
    return () => cancelTick();
  }, [isRunning]);

  useEffect(() => {
    if (secondsRemaining === 0) setIsRunning(false);
  }, [secondsRemaining]);

  const chooseDuration = (value) => {
    if (isRunning) return;
    setDurationSeconds(value);
    setSecondsRemaining(value);
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsRemaining(durationSeconds);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    if (secondsRemaining > 0) setIsRunning(true);
  };

  return {
    durationSeconds,
    secondsRemaining,
    isRunning,
    isComplete: secondsRemaining === 0,
    chooseDuration,
    pause,
    resume,
    reset,
    toggle: () => setIsRunning((running) => !running),
  };
}
