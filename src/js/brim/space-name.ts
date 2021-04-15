// eslint-disable-next-line
const NON_PRINTABLE = /[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g // https://gist.github.com/Hihaj/ba90ccee0cde981655708ce1054f2a7a
const EDGE_SLASH = /^\/|\/$/g
const MID_SLASH = /\//g

export function createSpaceName(input: string) {
  const name = input
    .replace(NON_PRINTABLE, "")
    .replace(EDGE_SLASH, "")
    .replace(MID_SLASH, "_")
    .trim()

  return name.length === 0 ? "Untitled" : name
}
