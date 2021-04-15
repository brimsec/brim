import useListener from "./use-listener"

export default function useEscapeKey(callback: Function) {
  useListener(document.body, "keyup", (e: KeyboardEvent) => {
    if (e.key === "Escape") callback()
  })
}
