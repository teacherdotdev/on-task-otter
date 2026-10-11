// The wording for each activity lives in the translations, under
// "activity.<id>.label" and "activity.<id>.detail".
//
// Each threshold is the activity's default sound limit on the 0-100 meter,
// matching Shy Safari's Volume Goal presets: on a calibrated meter, a class
// talking normally reads 50.
const activities = {
  independent: { threshold: 30 },
  partner: { threshold: 50 },
};

/** Bounds on a sound limit, as on Shy Safari's Volume Goal slider. */
const MIN_SOUND_THRESHOLD = 1;
const MAX_SOUND_THRESHOLD = 99;

/**
 * The defaults before the meter matched Shy Safari's. They meant something
 * else then — the timer only paused 18 points above them — so a saved one is
 * read as the new default rather than as a much stricter limit.
 */
const OLD_DEFAULT_THRESHOLDS = { independent: 22, partner: 48 };

/** A saved sound limit, or the activity's default when there is none. */
const soundThresholdOf = (value, activityId) =>
  Number.isFinite(value) && value !== OLD_DEFAULT_THRESHOLDS[activityId]
    ? value
    : activities[activityId]?.threshold ?? activities.partner.threshold;

export { activities, MIN_SOUND_THRESHOLD, MAX_SOUND_THRESHOLD, soundThresholdOf };
