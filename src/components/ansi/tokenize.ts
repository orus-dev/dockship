import { ANSI_REGEX, applyAnsiCodes, StyleState } from "./parser";

export type Token = {
  text: string;
  style: StyleState;
};

export function tokenizeAnsi(input: string): Token[] {
  const tokens: Token[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let style: StyleState = {};

  while ((match = ANSI_REGEX.exec(input))) {
    const index = match.index;

    if (index > lastIndex) {
      tokens.push({
        text: input.slice(lastIndex, index),
        style,
      });
    }

    const codes = match[1].split(";").map(Number);
    style = applyAnsiCodes(codes, style);

    lastIndex = ANSI_REGEX.lastIndex;
  }

  if (lastIndex < input.length) {
    tokens.push({
      text: input.slice(lastIndex),
      style,
    });
  }

  return tokens;
}
