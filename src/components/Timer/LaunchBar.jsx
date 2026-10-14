import { useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// Saved presets fold into one button, however many there are. The list opens
// upward, because the bar sits at the bottom of the screen; picking a preset
// starts it straight away.
const PresetMenu = ({ presets, onChoose }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const container = useRef(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnOutsideClick = (event) => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    // The bar may be in the floating window rather than the tab.
    const view = container.current?.ownerDocument.defaultView ?? window;
    view.addEventListener("keydown", closeOnEscape);
    view.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      view.removeEventListener("keydown", closeOnEscape);
      view.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [open]);

  return (
    <div className="launch-presets" ref={container}>
      <button
        className="launch-field launch-presets-button"
        type="button"
        aria-expanded={open}
        aria-controls="launch-preset-menu"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <Icon name="bookmark" />
        {t("session.presets")}
        <Icon name="chevronDown" />
      </button>

      {open && (
        <ul className="launch-preset-menu" id="launch-preset-menu" aria-label={t("session.favorites")}>
          {presets.map((preset) => (
            <li key={preset.id}>
              <button type="button" onClick={() => { setOpen(false); onChoose(preset); }}>
                <Icon name="play" />
                <b>{preset.name}</b>
                <span>{t("session.minutesShort", { minutes: preset.minutes })}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Up to 5 minutes the length steps one minute at a time, then by fives.
const stepMinutes = (minutes, direction) => {
  if (direction > 0) return minutes < 5 ? minutes + 1 : Math.floor(minutes / 5) * 5 + 5;
  return minutes <= 5 ? Math.max(1, minutes - 1) : Math.ceil(minutes / 5) * 5 - 5;
};

// A captioned row of buttons, exactly one of them chosen.
const Segments = ({ label, options, value, onChange }) => (
  <div className="launch-group">
    <span className="launch-caption" aria-hidden="true">{label}</span>
    <div className="launch-segments" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

// Before a focus session starts, the room keeps the screen: a presets menu and
// a quick start sit in one slim bar under it.
const LaunchBar = ({ session, onLaunch }) => {
  const { t } = useTranslation();
  const { timer, activities, favoriteSessions } = session;
  const [minutes, setMinutes] = useState(timer.durationSeconds / 60);
  // "off", or the activity whose sound limit applies.
  const [sound, setSound] = useState(session.trackSound ? session.activity : "off");
  const [showCountdown, setShowCountdown] = useState(true);

  const launchFavorite = (favorite) => onLaunch({
    minutes: favorite.minutes,
    activity: activities[favorite.activity] ? favorite.activity : "partner",
    trackSound: favorite.trackSound ?? true,
    showCountdown: favorite.showCountdown ?? true,
    hiddenTimerMode: favorite.hiddenTimerMode,
    soundThreshold: favorite.soundThreshold,
  });

  return (
    <section className="launch-bar" aria-label={t("session.label")}>
      {favoriteSessions.length > 0 && (
        <PresetMenu presets={favoriteSessions} onChoose={launchFavorite} />
      )}

      <form
        className="launch-quick"
        aria-label={t("session.quickStart")}
        onSubmit={(event) => {
          event.preventDefault();
          onLaunch({
            minutes,
            activity: sound === "off" ? session.activity : sound,
            trackSound: sound !== "off",
            showCountdown,
          });
        }}
      >
        <div className="launch-group">
          <span className="launch-caption" aria-hidden="true">{t("session.length")}</span>
          <div className="launch-stepper">
            <button
              type="button"
              aria-label={t("session.shorter")}
              disabled={minutes <= 1}
              onClick={() => setMinutes((current) => stepMinutes(current, -1))}
            >
              <Icon name="minus" />
            </button>
            <label>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                aria-label={t("session.minutes")}
                value={minutes}
                onChange={(event) => setMinutes(Math.max(1, Math.floor(Number(event.target.value) || 1)))}
              />
              <span aria-hidden="true">{t("session.min")}</span>
            </label>
            <button
              type="button"
              aria-label={t("session.longer")}
              onClick={() => setMinutes((current) => stepMinutes(current, 1))}
            >
              <Icon name="plus" />
            </button>
          </div>
        </div>

        <Segments
          label={t("session.soundMeter")}
          value={sound}
          onChange={setSound}
          options={[
            ...Object.keys(activities).map((id) => ({ value: id, label: t(`activity.${id}.label`) })),
            { value: "off", label: t("session.off") },
          ]}
        />

        <Segments
          label={t("session.countdown")}
          value={showCountdown}
          onChange={setShowCountdown}
          options={[
            { value: true, label: t("session.show") },
            { value: false, label: t("session.hide") },
          ]}
        />

        <button className="launch-start" type="submit">
          <Icon name="play" /> {t("session.startShort")}
        </button>
      </form>
    </section>
  );
};

export default LaunchBar;
