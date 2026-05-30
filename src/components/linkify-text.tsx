"use client";

interface LinkifyTextProps {
  text: string;
  className?: string;
}

const URL_REGEX = /(https?:\/\/[^\s<]+[^\s<.,:;!?)}\]])/g;

export function LinkifyText({ text, className }: LinkifyTextProps) {
  const parts = text.split(URL_REGEX);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                e.stopPropagation();
                window.open(part, "_blank", "noopener,noreferrer");
              }}
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
}
