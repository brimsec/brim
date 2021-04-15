import React from "react"

import {getKey} from "../../lib/finding"
import {useFindings} from "./use-findings"
import AnimateChildren from "../animate-children"
import FindingCard from "./finding-card"
import EmptySection from "../common/empty-section"
import BookIcon from "../../icons/book-svg-icon"
import {useSelector} from "react-redux"
import Current from "../../state/Current"

export default React.memo<{}>(function InvestigationLinear() {
  const findings = useFindings()
  const workspaceId = useSelector(Current.getWorkspaceId)
  const spaceId = useSelector(Current.getSpaceId)

  const cards = []

  findings.forEach((f) => {
    cards.push(
      <FindingCard
        key={getKey(f)}
        finding={f}
        workspaceId={workspaceId}
        spaceId={spaceId}
      />
    )
  })

  if (cards.length === 0)
    return (
      <EmptySection
        icon={<BookIcon />}
        message="As you search through your data, your history will appear here."
      />
    )

  return <AnimateChildren>{cards}</AnimateChildren>
})
