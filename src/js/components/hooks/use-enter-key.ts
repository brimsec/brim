import useListener from "./use-listener"

export default function useEnterKey(callback: Function) {
  useListener(document.body, "keyup", (e: KeyboardEvent) => {
    if (e.key === "Enter") callback()
  })
}
