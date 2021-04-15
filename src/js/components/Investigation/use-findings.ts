import {useMemo} from "react"

import {useSelector} from "react-redux"
import Investigation from "../../state/Investigation"
import brim from "../../brim"
import Current from "../../state/Current"

export function useFindings() {
  const workspaceId = useSelector(Current.getWorkspaceId)
  const spaceId = useSelector(Current.getSpaceId)
  const findings = useSelector(
    Investigation.getInvestigation(workspaceId, spaceId)
  )
  return useMemo(() => {
    return [...findings].sort((a, b) =>
      brim.time(a.ts).toDate() < brim.time(b.ts).toDate() ? 1 : -1
    )
  }, [findings])
}
