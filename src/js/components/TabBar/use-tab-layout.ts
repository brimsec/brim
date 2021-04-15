import {useEffect, useRef} from "react"
import {useSprings} from "react-spring"

import {TabState} from "../../state/Tab/types"
import lib from "../../lib"
import useDrag from "../hooks/use-drag"
import useFirst from "../hooks/use-first"

const config = {
  tension: 500,
  friction: 50
}

function getHoverIndex(startIndex, width, dx) {
  const half = width / 2
  const midX = startIndex * width + dx + half
  return Math.floor(midX / width)
}

const interpolate = ({x, width}) => ({
  transform: x.interpolate((x) => `translateX(${x}px)`),
  width
})

function mapToSprings(ids) {
  // Springs never change order even thought the ids may change order.
  // Therefore to remember the spring, we must remember the initial order
  // the tabs were in before anyone rearranged them.
  // This map provides a record of which spring belongs to which id.
  const map = new Map()
  ids.forEach((id, i) => map.set(id, i))
  return map
}

// The are the update function for when not dragging
const idle = (springOrder: number[], width: number, first: boolean) => (
  springIndex: number
) => {
  if (springOrder.includes(springIndex)) {
    const visibleIndex = springOrder.indexOf(springIndex)
    return {x: visibleIndex * width, config, immediate: first, width}
  } else {
    // We don't know of this spring yet, the next time useEffects run, then the
    // spring will be registered.
    return {}
  }
}

// The update function for when use is dragging
const dragging = (
  springOrder: number[],
  dragSpringIndex: number,
  dragIndex: number,
  width: number,
  dx: number
) => (springIndex: number) => {
  if (dragSpringIndex === springIndex) {
    const x = dragIndex * width + dx
    return {x, width, immediate: true}
  } else {
    const x = springOrder.indexOf(springIndex) * width
    return {x, width, config, immediate: false}
  }
}

// Take the order the tabs are visibly in, then get the index of the springs
// that correspond to those tabs.
function orderSprings(
  orderedIds: string[],
  map: Map<string, number>
): number[] {
  return orderedIds.map<number>((id) => map.get(id))
}

const getIds = (tabs) => tabs.map((t) => t.id)

export default function(tabs: TabState[], width: number) {
  const first = useFirst(width === 0) // The first renders are when the with === 0
  const ids = useRef(getIds(tabs))
  const map = useRef(mapToSprings(ids.current))
  const springOrder = orderSprings(ids.current, map.current)

  // This is a terrible api, but these springs only run this passed in update
  // function when the length changes. Since we are also re-ordering them, we
  // have to keep all this state about the original order and how it maps to
  // the new order.
  const [springs, set] = useSprings(
    ids.current.length,
    // @ts-ignore
    idle(springOrder, width, first)
  ) as [any, any]
  const interuptDrag = useRef(false)

  useEffect(() => {
    // This effect is called when the tabs are reordered/added/removed
    // Keep track of the ids order so we can "move" the springs to the right
    // place.
    ids.current = getIds(tabs)
  })

  useEffect(() => {
    // This effect is only called when tabs are added/removed
    interuptDrag.current = true
    map.current = mapToSprings(ids.current)
    const springOrder = orderSprings(ids.current, map.current)
    set(idle(springOrder, width, first))
  }, [tabs.length, width, first])

  // The drag handler
  const dragBinding = useDrag(({args, dx, type}) => {
    if (type === "down") {
      // This fires once at the beginning of the drag
      interuptDrag.current = false
      args.onDown()
    }
    // If a tab is added or removed while dragging, stop this handler
    if (interuptDrag.current) return false

    // This updates the positions of the tabs when you are dragging

    const dragSpringIndex: number = map.current.get(args.id)
    const dragIndex = ids.current.indexOf(args.id)
    const dragOverIndex = getHoverIndex(dragIndex, width, dx)
    const newOrder: string[] = lib.move(ids.current, dragIndex, dragOverIndex)
    const newSpringOrder = orderSprings(newOrder, map.current)
    set(dragging(newSpringOrder, dragSpringIndex, dragIndex, width, dx))

    if (type == "up") {
      // This fires once when the drag is over
      const indices = newOrder.map((id) => ids.current.indexOf(id))
      args.onChange(indices)
      set(idle(newSpringOrder, width, false))
    }
  })

  return {
    getStyle: (id: string) => {
      const spring = springs[map.current.get(id)]
      return spring ? interpolate(spring) : {}
    },
    dragBinding
  }
}
