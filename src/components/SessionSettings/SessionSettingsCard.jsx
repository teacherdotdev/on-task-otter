import { useState } from "react";
import { useTranslation } from "../../i18n";
import { soundThresholdOf } from "../../data/activities";

const SessionSettingsCard = ({ session, displayCountdown, children }) => {
  const { t } = useTranslation();
  const {
    timer,
    activities,
    chooseDuration,
    favoriteSessions,
    saveFavoriteSession,
    deleteFavoriteSession,
  } = session;
  const [favoriteName, setFavoriteName] = useState("");

  const {
    showCountdown,
    setShowCountdown,
    hiddenTimerMode,
    setHiddenTimerMode
  } = displayCountdown;

  const durationMinutes = timer.durationSeconds / 60;

  const handleDurationChange = (event) => {
    const minutes = Math.max(1, Math.floor(Number(event.target.value) || 1));
    chooseDuration(minutes * 60);
  };

  const saveFavorite = (event) => {
    event.preventDefault();
    const name = favoriteName.trim();
    if (!name) return;
    saveFavoriteSession(name, { showCountdown, hiddenTimerMode });
    setFavoriteName("");
  };

  const chooseFavorite = (favorite) => {
    chooseDuration(favorite.minutes * 60);
    setShowCountdown(favorite.showCountdown ?? true);
    setHiddenTimerMode(favorite.hiddenTimerMode ?? "none");
    if (Number.isFinite(favorite.soundThreshold)) session.setSoundThreshold(favorite.activity, favorite.soundThreshold);
    session.setActivity(activities[favorite.activity] ? favorite.activity : "partner");
    session.setTrackSound(favorite.trackSound ?? true);
  };

  return (
    <>
      <div className="settings-heading">
        <div>
          <h2 id="settings-title">{t("preset.title")}</h2>
        </div>
      </div>
      <label className="preset-name">
        {t("preset.name")}
        <input
          type="text"
          form="save-session-preset"
          required
          value={favoriteName}
          maxLength="50"
          placeholder={t("preset.placeholder")}
          onChange={(event) => setFavoriteName(event.target.value)}
        />
      </label>
      <fieldset className="session-duration" disabled={timer.isRunning} aria-label={t("preset.length")}>
        <div className="quick-durations" aria-label={t("preset.commonLengths")}>
          {[5, 10, 15, 20, 30].map((minutes) => (
            <button
              className={durationMinutes === minutes ? "selected" : ""}
              type="button"
              key={minutes}
              onClick={() => chooseDuration(minutes * 60)}
            >
              {t("session.minutesShort", { minutes })}
            </button>
          ))}
        </div>
        <div className="duration-inputs">
          <label>
            {t("preset.customMinutes")}
            <input
              type="number"
              name="minutes"
              min="1"
              step="1"
              inputMode="numeric"
              value={durationMinutes}
              onChange={handleDurationChange}
            />
          </label>
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
      {children}
      <form id="save-session-preset" className="save-favorite" onSubmit={saveFavorite}>
        <button className="outline" type="submit" disabled={timer.isRunning || !favoriteName.trim()}>
          {t("preset.save")}
        </button>
      </form>
      {favoriteSessions.length > 0 && (
        <section className="favorite-sessions">
          <h3>{t("preset.saved")}</h3>
          <ul>
              {favoriteSessions.map((favorite) => (
                <li key={favorite.id}>
                  <button
                    type="button"
                    disabled={timer.isRunning}
                    onClick={() => chooseFavorite(favorite)}
                  >
                    <b>{favorite.name}</b>
                    <span>{t("session.minutesShort", { minutes: favorite.minutes })} · {favorite.trackSound === false ? t("session.noSoundMeter") : (Number.isFinite(favorite.soundThreshold) ? t("preset.soundLimitDetail", { percent: soundThresholdOf(favorite.soundThreshold, favorite.activity) }) : t("session.tracksSound"))}</span>
                  </button>
                  <button
                    className="favorite-delete"
                    type="button"
                    aria-label={t("preset.deleteNamed", { name: favorite.name })}
                    onClick={() => deleteFavoriteSession(favorite.id)}
                  >
                    {t("preset.delete")}
                  </button>
                </li>
              ))}
          </ul>
        </section>
      )}

    </>

  )
}

export default SessionSettingsCard;
