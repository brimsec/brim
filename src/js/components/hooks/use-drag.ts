const on = document.addEventListener
const off = document.removeEventListener

export default function useDrag(handler: Function) {
  return (args: any = {}) => {
    let startX = 0
    let startY = 0

    function onMouseDown(event: React.MouseEvent) {
      startX = event.clientX
      startY = event.clientY
      handler({
        event,
        args,
        dx: 0,
        dy: 0,
        type: "down"
      })
      on("mousemove", onMove)
      on("mouseup", onUp)
    }

    function onMove(event: MouseEvent) {
      const res = handler({
        event,
        args,
        dx: event.clientX - startX,
        dy: event.clientY - startY,
        type: "move"
      })
      if (res === false) {
        off("mousemove", onMove)
        off("mouseup", onUp)
      }
    }

    function onUp(event: MouseEvent) {
      handler({
        event,
        args,
        dx: event.clientX - startX,
        dy: event.clientY - startY,
        type: "up"
      })
      off("mousemove", onMove)
      off("mouseup", onUp)
    }

    return {
      onMouseDown
    }
  }
}
