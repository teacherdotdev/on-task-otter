/**
 * Deciding when the room is Too Loud.
 *
 * Getting in works like a bucket filling up. Every moment over the sound
 * limit adds to it, and the further over, the faster it fills: a room just
 * over the line takes about six seconds, a room far over it takes one.
 * Moments under the limit drain it again, so a knock at the door or a dropped
 * book leaks away before it can count.
 *
 * Getting out is deliberately quicker and simpler: three quiet seconds, by
 * the mean.
 *
 * Pure on purpose: no timers, no microphone, no React. Everything here is a
 * function of the samples and the clock.
 *
 * Ported from Shy Safari (class-noise-level/src/lib/noise/loudState.ts);
 * keep the two behaving the same.
 */

/** How full the bucket must get, in seconds of "just over the line". */
export const TOO_LOUD_AFTER_S = 6;
/** However loud the room, it takes at least this long to fill the bucket. */
export const FASTEST_TOO_LOUD_MS = 1_000;
/** How many points over the limit doubles the fill rate. */
const EXCESS_SCALE = 12;
/** Bucket drained per second spent under the limit. */
const DRAIN_PER_S = 1;
/** Longest gap between samples we will integrate across (a stalled tab). */
const MAX_STEP_MS = 250;

export const LEAVE_TOO_LOUD_MS = 3_000;

/**
 * How far back the bucket looks. Any older noise has either tipped us into
 * Too Loud already or drained away.
 */
const LOOKBACK_MS = 15_000;

/** Samples older than the lookback can never change a decision again. */
export const pruneSamples = (samples, now) => {
  const oldestUseful = now - LOOKBACK_MS;
  return samples.filter((sample) => sample.time >= oldestUseful);
};

/**
 * Bucket filled per second at `excess` points over the limit. Grows with the
 * square of the excess, so slightly over is gentle and far over is urgent,
 * but capped so even a shriek has to last a second.
 */
export const fillRate = (excess) => {
  const maxRate = (TOO_LOUD_AFTER_S * 1_000) / FASTEST_TOO_LOUD_MS;
  return Math.min(maxRate, 1 + (excess / EXCESS_SCALE) ** 2);
};

/** How full the bucket is at `now`, counting only samples since `since`. */
export const loudPressure = (samples, goal, now, since = -Infinity) => {
  const from = Math.max(since, now - LOOKBACK_MS);
  const eligible = samples.filter(
    (sample) => sample.time >= from && sample.time <= now,
  );
  let pressure = 0;
  for (let i = 0; i < eligible.length; i++) {
    const sample = eligible[i];
    const next = eligible[i + 1]?.time ?? now;
    const seconds = Math.min(next - sample.time, MAX_STEP_MS) / 1_000;
    const excess = sample.level - goal;
    pressure += excess > 0 ? fillRate(excess) * seconds : -DRAIN_PER_S * seconds;
    pressure = Math.max(0, pressure);
  }
  return pressure;
};

const quietMean = (samples, now, since) => {
  const eligible = samples.filter((sample) => sample.time >= since);
  const inWindow = eligible.filter(
    (sample) => sample.time >= now - LEAVE_TOO_LOUD_MS,
  );
  if (inWindow.length === 0) return { mean: 0, covered: false };
  const total = inWindow.reduce((sum, sample) => sum + sample.level, 0);
  const oldest = eligible[0]?.time ?? now;
  return {
    mean: total / inWindow.length,
    covered: oldest <= now - LEAVE_TOO_LOUD_MS,
  };
};

/**
 * "quiet" or "too-loud". `since` is when the state last changed. Only samples
 * from then on count: the noise that got us into Too Loud must not be allowed
 * to vote us straight back in the moment the fast three-second exit fires,
 * and the noise before a recovery must not refill the bucket.
 */
export const nextNoiseState = (current, samples, goal, now, since = -Infinity) => {
  if (current === "quiet") {
    return loudPressure(samples, goal, now, since) >= TOO_LOUD_AFTER_S
      ? "too-loud"
      : "quiet";
  }

  const window = quietMean(samples, now, since);
  return window.covered && window.mean <= goal ? "quiet" : "too-loud";
};
