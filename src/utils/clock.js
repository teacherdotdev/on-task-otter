/**
 * The one place the session's timer, sound meter and noise judge get their
 * animation frames and timers from.
 *
 * While On-task Otter floats, the teacher is usually looking at another tab,
 * and browsers pause a hidden tab's animation frames and slow its timers. The
 * floating window is always on screen, so while it is open it keeps time
 * instead. Anything waiting when the clock changes hands is moved across, so
 * a running loop carries on without noticing.
 */

let clockWindow = window;
const waiting = new Set();

const schedule = (task) => {
  const source = clockWindow;
  const run = () => {
    waiting.delete(task);
    task.callback();
  };
  task.cancel = task.delay === undefined
    ? () => source.cancelAnimationFrame(task.id)
    : () => source.clearTimeout(task.id);
  task.id = task.delay === undefined
    ? source.requestAnimationFrame(run)
    : source.setTimeout(run, task.delay);
};

const add = (callback, delay) => {
  const task = { callback, delay };
  waiting.add(task);
  schedule(task);
  return () => {
    if (waiting.delete(task)) task.cancel();
  };
};

/** Calls back on the next frame. Returns a function that cancels it. */
export const nextFrame = (callback) => add(callback);

/** Calls back after `delay` milliseconds. Returns a function that cancels it. */
export const after = (delay, callback) => add(callback, delay);

/** Hands the clock to `nextWindow`, or back to the tab when it is null. */
export const setClockWindow = (nextWindow) => {
  const tasks = [...waiting];
  // A floating window that has just closed has nothing left to cancel.
  tasks.forEach((task) => { try { task.cancel(); } catch { /* already gone */ } });
  clockWindow = nextWindow ?? window;
  tasks.forEach(schedule);
};
