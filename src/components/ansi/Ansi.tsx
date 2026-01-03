import { tokenizeAnsi } from "./tokenize";

type AnsiTextProps = {
  text: string;
  className?: string;
};

const ANSI_TW_CLASSES: Record<string, string> = {
  black: "text-black",
  red: "text-red-500",
  green: "text-emerald-500",
  yellow: "text-yellow-400",
  blue: "text-blue-400",
  magenta: "text-purple-400",
  cyan: "text-cyan-400",
  white: "text-gray-100",

  brightBlack: "text-gray-500",
  brightRed: "text-red-400",
  brightGreen: "text-emerald-400",
  brightYellow: "text-yellow-300",
  brightBlue: "text-blue-300",
  brightMagenta: "text-purple-300",
  brightCyan: "text-cyan-300",
  brightWhite: "text-white",
};

export function AnsiText({ text, className }: AnsiTextProps) {
  const tokens = tokenizeAnsi(text);

  return (
    <span className={`whitespace-pre-wrap font-mono ${className ?? ""}`}>
      {tokens.map((token, i) => {
        const classes = [
          token.style.color && ANSI_TW_CLASSES[token.style.color],
          token.style.bold && "font-semibold",
          token.style.underline && "underline",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <span key={i} className={classes}>
            {token.text}
          </span>
        );
      })}
    </span>
  );
}
