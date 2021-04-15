import {useState} from "react"

/*
  When using this, all the children elements of the dropzone must have a
  css rule of pointer-events: none.
*/

type DragProps = {
  onDragOver: (DragEvent) => void
  onDrop: (DragEvent) => void
  onDragEnter: (DragEvent) => void
  onDragLeave: (DragEvent) => void
}

type ReturnValue = [() => DragProps, boolean]

export default function useDropzone(dropCallback: Function): ReturnValue {
  const [dragging, setDragging] = useState(false)

  function onDragOver(e) {
    e.preventDefault()
  }

  function onDrop(e: DragEvent) {
    setDragging(false)
    dropCallback(e)
  }

  function onDragEnter(e) {
    e.preventDefault()
    setDragging(true)
  }

  function onDragLeave(e) {
    e.preventDefault()
    setDragging(false)
  }

  return [
    () => ({
      onDragOver,
      onDrop,
      onDragEnter,
      onDragLeave
    }),
    dragging
  ]
}
