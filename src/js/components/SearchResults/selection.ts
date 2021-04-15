import {throttle} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import {useLayoutEffect, MouseEvent} from "react"
import Mousetrap from "mousetrap"

import Viewer from "../../state/Viewer"
import useCallbackRef from "../hooks/use-callback-ref"

function useKeybindings(multi) {
  const dispatch = useDispatch()
  const [focusParent, ref] = useCallbackRef()

  useLayoutEffect(() => {
    if (!focusParent) return

    function onDown(e) {
      e.preventDefault()
      dispatch(Viewer.selectNext())
    }

    function onShiftDown(e) {
      if (!multi) return
      e.preventDefault()
      dispatch(Viewer.selectRangeNext())
    }

    function onUp(e) {
      e.preventDefault()
      dispatch(Viewer.selectPrev())
    }

    function onShiftUp(e) {
      if (!multi) return
      e.preventDefault()
      dispatch(Viewer.selectRangePrev())
    }

    function selectAll(e) {
      if (!multi) return
      e.preventDefault()
      dispatch(Viewer.selectAll())
    }

    const bindings = new Mousetrap(focusParent)
      .bind("down", throttle(onDown, 25))
      .bind("shift+down", throttle(onShiftDown, 25))
      .bind("up", throttle(onUp, 25))
      .bind("shift+up", throttle(onShiftUp, 25))
      .bind("meta+a", selectAll)

    return () => bindings.reset()
  }, [focusParent])

  return ref
}

type Args = {multi: boolean}

export function useRowSelection({multi}: Args) {
  const parentRef = useKeybindings(multi)
  const selection = useSelector(Viewer.getSelection)
  const dispatch = useDispatch()

  function clicked(e: MouseEvent, index: number) {
    if (multi && e.metaKey) {
      dispatch(Viewer.selectMulti(index))
    } else if (multi && e.shiftKey) {
      dispatch(Viewer.selectRange(index))
    } else {
      dispatch(Viewer.select(index))
    }
  }

  return {
    parentRef,
    selection,
    clicked
  }
}
