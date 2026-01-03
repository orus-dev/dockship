export type StyleState = {
  color?: string;
  bold?: boolean;
  underline?: boolean;
};

export const ANSI_REGEX = /\u001b\[([0-9;]*)m/g;

const COLOR_CODES: Record<number, string> = {
  30: "black",
  31: "red",
  32: "green",
  33: "yellow",
  34: "blue",
  35: "magenta",
  36: "cyan",
  37: "white",

  90: "brightBlack",
  91: "brightRed",
  92: "brightGreen",
  93: "brightYellow",
  94: "brightBlue",
  95: "brightMagenta",
  96: "brightCyan",
  97: "brightWhite",
};

export function applyAnsiCodes(codes: number[], state: StyleState): StyleState {
  let next = { ...state };

  for (const code of codes) {
    if (code === 0) {
      next = {};
    } else if (code === 1) {
      next.bold = true;
    } else if (code === 4) {
      next.underline = true;
    } else if (COLOR_CODES[code]) {
      next.color = COLOR_CODES[code];
    }
  }

  return next;
}
