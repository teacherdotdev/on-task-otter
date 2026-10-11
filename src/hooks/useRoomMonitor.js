import { useCallback, useEffect, useRef, useState } from "react";
import { RoomMonitor } from "../noise/RoomMonitor";

/**
 * Judges the room every animation frame while `judging` is true, the same
 * clock Shy Safari drives its monitor from. Starting or stopping judging
 * starts the monitor afresh, so noise from before a pause, or from the class
 * talking on purpose during calibration, is forgotten.
 */
export const useRoomMonitor = ({ readLevel, goal, judging }) => {
  const monitorRef = useRef(null);
  if (!monitorRef.current) monitorRef.current = new RoomMonitor();
  const goalRef = useRef(goal);
  goalRef.current = goal;
  const [state, setState] = useState("quiet");

  const reset = useCallback(() => {
    monitorRef.current.reset();
    setState("quiet");
  }, []);

  useEffect(() => {
    if (!judging) return;
    const monitor = monitorRef.current;
    reset();
    let frame;
    const step = () => {
      monitor.observe(readLevel(), goalRef.current, performance.now());
      setState(monitor.state);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      reset();
    };
  }, [judging, readLevel, reset]);

  return { state, reset };
};
