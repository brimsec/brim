import {useDispatch, useSelector} from "react-redux"
import {useEffect, useRef, useState} from "react"
import onIdle from "on-idle"

import Tabs from "../../state/Tabs"
import {ipcRenderer} from "electron"
import {lakeImportPath, workspacesPath} from "app/router/utils/paths"
import useWorkspaceId from "app/router/hooks/use-workspace-id"

export default function(count: number, calcWidths: Function) {
  const trueActiveId = useSelector(Tabs.getActive)
  const tabCount = useSelector(Tabs.getCount)
  const [activeId, setActive] = useState(trueActiveId)
  const removedByClick = useRef(false)
  const dispatch = useDispatch()
  const workspaceId = useWorkspaceId()

  useEffect(() => {
    if (!removedByClick.current) calcWidths()
  }, [count])

  useEffect(() => {
    setActive(trueActiveId)
  }, [trueActiveId])

  return {
    activeId,

    onAddClick() {
      const path = workspaceId ? lakeImportPath(workspaceId) : workspacesPath()
      dispatch(Tabs.new(path))
    },

    onRemoveClick(event: MouseEvent, id: string) {
      event.stopPropagation()
      if (tabCount === 1) {
        ipcRenderer.invoke("windows:close")
      } else {
        removedByClick.current = true
        dispatch(Tabs.remove(id))
      }
    },

    onTabClick(id: string) {
      setActive(id)
      onIdle(() => dispatch(Tabs.activate(id)))
    },

    onMouseLeave() {
      if (removedByClick.current) {
        calcWidths()
        removedByClick.current = false
      }
    },

    onTabMove(indices: number[]) {
      dispatch(Tabs.order(indices))
    }
  }
}
