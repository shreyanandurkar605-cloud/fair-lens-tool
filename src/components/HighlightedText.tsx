import { BiasMatch } from "@/lib/biasAnalyzer";

interface Props {
  text: string;
  matches: BiasMatch[];
}

const categoryClass: Record<string, string> = {
  gender: "bg-google-blue/15 text-google-blue border-b-2 border-google-blue",
  age: "bg-google-yellow/25 text-foreground border-b-2 border-google-yellow",
  culture: "bg-google-red/15 text-google-red border-b-2 border-google-red",
  ability: "bg-google-green/15 text-google-green border-b-2 border-google-green",
  exclusionary: "bg-google-red/15 text-google-red border-b-2 border-google-red",
};

export const HighlightedText = ({ text, matches }: Props) => {
  if (matches.length === 0) {
    return <p className="whitespace-pre-wrap leading-relaxed text-foreground">{text}</p>;
  }

  const parts: JSX.Element[] = [];
  let cursor = 0;

  matches.forEach((m, i) => {
    if (m.index > cursor) {
      parts.push(<span key={`t-${i}`}>{text.slice(cursor, m.index)}</span>);
    }
    parts.push(
      <mark
        key={`m-${i}`}
        className={`rounded px-1 py-0.5 font-medium ${categoryClass[m.category]}`}
        title={m.explanation}
      >
        {text.slice(m.index, m.index + m.length)}
      </mark>
    );
    cursor = m.index + m.length;
  });

  if (cursor < text.length) {
    parts.push(<span key="t-end">{text.slice(cursor)}</span>);
  }

  return <p className="whitespace-pre-wrap leading-relaxed text-foreground">{parts}</p>;
};
