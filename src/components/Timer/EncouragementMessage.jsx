import { getProgressMessageType } from "../../data/encouragementMessages";
import { useState } from "react";
import { useTranslation } from "../../i18n";

const EncouragementMessage = ({ mode, timer, noiseTone }) => {
  const { t, tList } = useTranslation();
  const [genericIndex] = useState(() =>
    Math.floor(Math.random() * tList("encouragement.generic").length)
  );

  if (mode === "none") return null;

  if (noiseTone === "loud") {
    return <p>{t("encouragement.loud")}</p>;
  }

  if (mode === "generic") {
    return <p>{tList("encouragement.generic")[genericIndex]}</p>;
  }

  const totalSeconds = timer.durationSeconds;
  const elapsedSeconds = totalSeconds - timer.secondsRemaining;
  const progress = elapsedSeconds / totalSeconds;

  const type = getProgressMessageType(progress);

  return (
    <p>
      {tList(`encouragement.${type}`)[0]}
    </p>
  );
};

export default EncouragementMessage;
