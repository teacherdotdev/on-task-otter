// The wording for each activity lives in the translations, under
// "activity.<id>.label" and "activity.<id>.detail".
//
// Each threshold is the activity's default sound limit on the 0-100 meter: on
// a calibrated meter, a class talking normally reads 50.
const activities = {
  independent: { threshold: 25 },
  partner: { threshold: 50 },
};

/** Bounds on a sound limit, as on Shy Safari's Volume Goal slider. */
const MIN_SOUND_THRESHOLD = 1;
const MAX_SOUND_THRESHOLD = 99;

/**
 * Earlier defaults. The first ones meant something else — the timer only
 * paused 18 points above them — so a saved one is read as the new default
 * rather than as a much stricter limit; independent work's 30 is now 25.
 */
const OLD_DEFAULT_THRESHOLDS = { independent: [22, 30], partner: [48] };

/** A saved sound limit, or the activity's default when there is none. */
const soundThresholdOf = (value, activityId) =>
  Number.isFinite(value) && !OLD_DEFAULT_THRESHOLDS[activityId]?.includes(value)
    ? value
    : activities[activityId]?.threshold ?? activities.partner.threshold;

export { activities, MIN_SOUND_THRESHOLD, MAX_SOUND_THRESHOLD, soundThresholdOf };
