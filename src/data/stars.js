// How many stars a class earns for each minute of a finished focus session.
// The teacher sets it once and every class earns at the same rate.
const DEFAULT_STARS_PER_MINUTE = 1;
const MIN_STARS_PER_MINUTE = 1;
const MAX_STARS_PER_MINUTE = 10;

/** A saved rate as a whole number of stars in range, or the default when there is none. */
const starsPerMinuteOf = (value) =>
  Number.isFinite(value)
    ? Math.min(MAX_STARS_PER_MINUTE, Math.max(MIN_STARS_PER_MINUTE, Math.round(value)))
    : DEFAULT_STARS_PER_MINUTE;

export { DEFAULT_STARS_PER_MINUTE, MIN_STARS_PER_MINUTE, MAX_STARS_PER_MINUTE, starsPerMinuteOf };
