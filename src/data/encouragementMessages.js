// Which set of encouragements suits where the class is in a session. The
// messages themselves live in the translations, under "encouragement.<type>".
const getProgressMessageType = (progress) => {
  if (progress < 0.25) return "beginning";

  if (progress < 0.75) return "middle";

  return "ending";
};

export { getProgressMessageType };
