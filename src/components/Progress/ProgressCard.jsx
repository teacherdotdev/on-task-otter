import { useTranslation } from "../../i18n";

const ProgressCard = ({ progress }) => {
  const { t } = useTranslation();
  const {
    totalMinutes,
    history,
    totalStars,
    stars,
    activities,
    classMilestones,
    houseItems,
    houseItemsOwned,
    houseRooms,
  } = progress;
  const activeMilestone = classMilestones.find((milestone) =>
    milestone.itemIds.some((itemId) => !houseItemsOwned.includes(itemId))
  ) ?? classMilestones.at(-1);
  const milestoneItems = activeMilestone.itemIds.map((itemId) =>
    houseItems.find((item) => item.id === itemId)
  );
  const collectedItems = milestoneItems.filter((item) => houseItemsOwned.includes(item.id)).length;
  const progressToReward = (collectedItems / milestoneItems.length) * 100;
  const milestoneComplete = collectedItems === milestoneItems.length;
  const activeMilestoneIndex = classMilestones.indexOf(activeMilestone);
  const milestoneRoom = houseRooms.find((room) => room.id === activeMilestone.room);

  return (
    <section className="card history-card">
      <div className="card-heading">
        <div>
          <p className="card-label">{t("progress.label")}</p>
          <h2>{t("progress.minutes", { minutes: totalMinutes })}</h2>
        </div>

        <span className="session-count">
          {t("progress.sessions", { count: history.length })}
        </span>
      </div>

      <div className="progress-summary">
        <span>
          <b>{totalStars}</b> {t("progress.totalStars")}
        </span>

        <span>
          <b>{stars}</b> {t("progress.available")}
        </span>
      </div>

      <div className="class-goal" aria-label={t("progress.milestoneLabel", { collected: collectedItems, total: milestoneItems.length })}>
        <div className="class-goal-icon" aria-hidden="true">{activeMilestone.icon}</div>
        <div className="class-goal-copy">
          <p className="class-goal-label">{t("progress.milestoneRoom", {
            room: t(`room.${milestoneRoom.id}.name`),
            index: activeMilestoneIndex + 1,
            total: classMilestones.length,
          })}</p>
          <h3>{t(`milestone.${activeMilestone.id}`)}</h3>
          <p>
            {milestoneComplete
              ? t("progress.milestoneComplete")
              : milestoneItems.length - collectedItems === 1
              ? t("progress.milestoneRemainingOne")
              : t("progress.milestoneRemaining", { remaining: milestoneItems.length - collectedItems })}
          </p>
          <div className="class-goal-meter" aria-hidden="true">
            <span style={{ width: `${progressToReward}%` }} />
          </div>
          <small>{t("progress.piecesCollected", { collected: collectedItems, total: milestoneItems.length })}</small>
          <div className="milestone-pieces">
            {milestoneItems.map((item) => {
              const owned = houseItemsOwned.includes(item.id);
              return (
                <div className={owned ? "collected" : ""} key={item.id}>
                  <img src={item.image} alt="" />
                  <span>{t(`item.${item.id}`)}</span>
                  <b>{owned ? t("progress.collected") : `★ ${item.cost}`}</b>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {history.length ? (
        <ul>
          {history.slice(0, 5).map((session) => (
            <li key={session.id}>
              <span>
                {new Date(session.date).toLocaleDateString(undefined, { 
                  month: "short", 
                  day: "numeric" 
                })}
              </span>

              <b>{t("session.minutesShort", { minutes: session.minutes })}</b>

              <em>
                {activities[session.activity]
                  ? t(`activity.${session.activity}.label`)
                  : t("progress.focusSession")}
              </em>

              <strong>
                +{session.starsEarned} ★
              </strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">
          {t("progress.empty")}
        </p>
      )}
    </section>
  )
}

export default ProgressCard;
