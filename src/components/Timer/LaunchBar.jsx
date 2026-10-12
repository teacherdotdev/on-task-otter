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
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsideClick);
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
        <label className="launch-field launch-minutes">
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

        <label className="launch-field launch-sound">
          <Icon name="mic" />
          <select aria-label={t("noise.acceptableVolume")} value={sound} onChange={(event) => setSound(event.target.value)}>
            {Object.keys(activities).map((id) => (
              <option key={id} value={id}>{t(`activity.${id}.label`)}</option>
            ))}
            <option value="off">{t("session.soundOff")}</option>
          </select>
        </label>

        <button
          className="launch-field launch-toggle"
          type="button"
          aria-pressed={showCountdown}
          onClick={() => setShowCountdown((shown) => !shown)}
        >
          <Icon name="clock" />
          {t("session.countdown")}
        </button>

        <button className="launch-start" type="submit">
          <Icon name="play" /> {t("session.startShort")}
        </button>
      </form>
    </section>
  );
};

export default LaunchBar;
