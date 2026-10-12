import { useTranslation } from "../../i18n";

// Shows one translated phrase that may contain links or bold words, written the
// way they are in a Markdown file: [what the reader sees](nameOfTheLink) and
// *bold words*. Each link name is looked up in the links given here.
const RichText = ({ textKey, values, links = {} }) => {
  const { tSegments } = useTranslation();

  return (
    <>
      {tSegments(textKey, values).map((segment, index) => {
        if (segment.bold) return <b key={index}>{segment.text}</b>;
        if (!segment.link) return <span key={index}>{segment.text}</span>;

        const href = links[segment.link] ?? segment.link;
        const isExternal = href.startsWith("http");

        return (
          <a
            key={index}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {segment.text}
          </a>
        );
      })}
    </>
  );
};

export default RichText;
