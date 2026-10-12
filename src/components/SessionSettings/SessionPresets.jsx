import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import Icon from "../Icon/Icon";
import NoiseCard from "../NoiseMeter/NoiseCard";
import { useTranslation } from "../../i18n";
import { soundThresholdOf } from "../../data/activities";

const QUICK_MINUTES = [5, 10, 15, 20, 30];

const presetDetail = (t, preset) => `${t("session.minutesShort", { minutes: preset.minutes })} · ${
  preset.trackSound === false
    ? t("session.noSoundMeter")
    : Number.isFinite(preset.soundThreshold)
      ? t("preset.soundLimitDetail", { percent: soundThresholdOf(preset.soundThreshold, preset.activity) })
      : t("session.tracksSound")
}`;

// The form edits the classroom's current session settings (length, sound
// limit) and saves a snapshot of them under a name. Editing a
// saved preset first loads it into those settings.
const PresetForm = ({ session, noise, editing, onClose }) => {
  const { t } = useTranslation();
  const { timer, chooseDuration, saveFavoriteSession, updateFavoriteSession, deleteFavoriteSession } = session;
  const [name, setName] = useState(editing?.name ?? "");
  const [showCountdown, setShowCountdown] = useState(editing?.showCountdown ?? true);
  const [hiddenTimerMode, setHiddenTimerMode] = useState(editing?.hiddenTimerMode ?? "none");
  const durationMinutes = timer.durationSeconds / 60;
  const isCustom = !QUICK_MINUTES.includes(durationMinutes);
  // The custom box stays empty while a quick length is chosen.
  const [customMinutes, setCustomMinutes] = useState(isCustom ? String(durationMinutes) : "");

  const handleCustomChange = (event) => {
    setCustomMinutes(event.target.value);
    if (event.target.value === "") return;
    const minutes = Math.max(1, Math.floor(Number(event.target.value) || 1));
    chooseDuration(minutes * 60);
  };

  const save = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (editing) updateFavoriteSession(editing.id, trimmed, { showCountdown, hiddenTimerMode });
    else saveFavoriteSession(trimmed, { showCountdown, hiddenTimerMode });
    onClose();
  };

  return (
    <form className="preset-form" onSubmit={save}>
      <p className="card-label">{t("preset.label")}</p>
      <h2 id="preset-title">{editing ? t("preset.editTitle") : t("preset.title")}</h2>

      <label className="preset-name">
        {t("preset.name")}
        <input
          type="text"
          required
          autoFocus
          value={name}
          maxLength="50"
          placeholder={t("preset.placeholder")}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <div className="preset-columns">
        <section className="preset-column">
          <h3><Icon name="clock" /> {t("preset.timer")}</h3>
          <fieldset className="session-duration" disabled={timer.isRunning}>
            <legend>{t("preset.lengthInMinutes")}</legend>
            <div className="duration-segments" role="group" aria-label={t("preset.commonLengths")}>
              {QUICK_MINUTES.map((minutes) => (
                <button
                  className={durationMinutes === minutes ? "selected" : ""}
                  type="button"
                  key={minutes}
                  aria-pressed={durationMinutes === minutes}
                  onClick={() => { chooseDuration(minutes * 60); setCustomMinutes(""); }}
                >
                  {minutes}
                </button>
              ))}
              <input
                className={isCustom ? "duration-custom selected" : "duration-custom"}
                type="number"
                name="minutes"
                min="1"
                step="1"
                inputMode="numeric"
                aria-label={t("preset.customMinutes")}
                placeholder={t("preset.custom")}
                value={customMinutes}
                onChange={handleCustomChange}
              />
            </div>
          </fieldset>
          <label className="checkbox-option countdown-option">
            <input type="checkbox" checked={showCountdown} onChange={(event) => setShowCountdown(event.target.checked)} />
            {t("session.showCountdown")}
          </label>
          {!showCountdown && <label className="hidden-countdown-choice">
            {t("preset.whileHidden")}
            <select value={hiddenTimerMode} onChange={(event) => setHiddenTimerMode(event.target.value)}>
              <option value="none">{t("preset.noMessages")}</option>
              <option value="generic">{t("preset.genericMessages")}</option>
              <option value="progress">{t("preset.progressMessages")}</option>
            </select>
          </label>}
        </section>

        <section className="preset-column">
          <h3>
            <label className="preset-column-toggle">
              <input type="checkbox" checked={noise.trackSound} onChange={(event) => noise.setTrackSound(event.target.checked)} />
              <Icon name="mic" /> {t("noise.track")}
            </label>
          </h3>
          <NoiseCard noise={noise} embedded />
        </section>
      </div>

      <footer className="preset-form-actions">
        {editing && (
          <button
            className="favorite-delete"
            type="button"
            aria-label={t("preset.deleteNamed", { name: editing.name })}
            onClick={() => { deleteFavoriteSession(editing.id); onClose(); }}
          >
            {t("preset.delete")}
          </button>
        )}
        <button className="plain-button" type="button" onClick={onClose}>{t("preset.cancel")}</button>
        <button className="primary" type="submit" disabled={timer.isRunning || !name.trim()}>
          {editing ? t("preset.saveChanges") : t("preset.save")}
        </button>
      </footer>
    </form>
  );
};

const SessionPresets = ({ session, noise }) => {
  const { t } = useTranslation();
  const { timer, activities, chooseDuration, favoriteSessions } = session;
  // null while closed, "new" for a fresh preset, otherwise the preset being edited.
  const [openPreset, setOpenPreset] = useState(null);
  const close = () => setOpenPreset(null);

  useEffect(() => {
    if (!openPreset) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [openPreset]);

  const editPreset = (preset) => {
    if (!timer.isRunning) chooseDuration(preset.minutes * 60);
    const activity = activities[preset.activity] ? preset.activity : "partner";
    if (Number.isFinite(preset.soundThreshold)) session.setSoundThreshold(activity, preset.soundThreshold);
    session.setActivity(activity);
    session.setTrackSound(preset.trackSound ?? true);
    setOpenPreset(preset);
  };

  return (
    <>
      <section className="preset-bar" aria-labelledby="preset-bar-title">
        <h2 id="preset-bar-title">{t("preset.saved")}</h2>
        <ul>
          {favoriteSessions.map((preset) => (
            <li key={preset.id}>
              <button className="preset-chip" type="button" onClick={() => editPreset(preset)}>
                <b>{preset.name}</b>
                <span>{presetDetail(t, preset)}</span>
              </button>
            </li>
          ))}
          <li>
            <button className="preset-chip preset-chip-new" type="button" onClick={() => setOpenPreset("new")}>
              <Icon name="plus" /> {t("preset.new")}
            </button>
          </li>
        </ul>
        {favoriteSessions.length === 0 && <p className="preset-bar-hint">{t("preset.hint")}</p>}
      </section>

      {openPreset && (
        <Modal
          isOpen
          onClose={close}
          className="preset-modal"
          ariaLabelledBy="preset-title"
          closeLabel={t("preset.close")}
        >
          <PresetForm
            session={session}
            noise={noise}
            editing={openPreset === "new" ? null : openPreset}
            onClose={close}
          />
        </Modal>
      )}
    </>
  );
};

export default SessionPresets;
