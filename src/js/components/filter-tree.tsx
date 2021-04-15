import classNames from "classnames"
import {remote} from "electron"
import {initial, isEqual, map, tail, take} from "lodash"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {submitSearch} from "../flows/submitSearch/mod"
import BookIcon from "../icons/book-svg-icon"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Search from "../state/Search"
import Url from "../state/Url"
import {SearchRecord} from "../types"
import EmptySection from "./common/empty-section"
import FilterNode from "./filter-node"
import {createInvestigationTree, InvestigationNode} from "./FilterTree/helpers"
import usePopupMenu from "./hooks/use-popup-menu"

const getPins = (node?: InvestigationNode): string[] => {
  const result = map(node?.getPath(), (n) => {
    return n.model.filter
  })

  // don't include root, or final path element as pin
  return tail(initial(result))
}

const nodeIsActivePin = (node: InvestigationNode, prevPins: string[]) => {
  const selected = [...getPins(node), node.model.filter]
  return isEqual(selected, take(prevPins, selected.length))
}

const nodeIsActive = (
  node: InvestigationNode,
  prevPins: string[],
  prevProgram: string
) => {
  return (
    node &&
    node.model.filter === prevProgram &&
    isEqual(prevPins, getPins(node))
  )
}

const reconstructSearch = (node: InvestigationNode): SearchRecord => {
  return {
    ...node.model.finding.search,
    program: node.model.filter,
    pins: getPins(node)
  }
}

type Props = {
  node: InvestigationNode
  i: number
  workspaceId: string
  spaceId: string
}

function NodeRow({node, i, workspaceId, spaceId}: Props) {
  const dispatch = useDispatch()
  const last = useSelector(Url.getSearchParams)
  const prevPins = last.pins
  const prevProgram = last.program
  const menu = usePopupMenu([
    {
      label: "Delete underlying entry",
      click: () => {
        const multiTs = node
          .all(() => true)
          .map((node) => node.model.finding.ts)
        dispatch(Investigation.deleteFindingByTs(workspaceId, spaceId, multiTs))
      }
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () =>
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete All History",
            message: `Are you sure you want to delete all history entries for this space?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0)
              dispatch(
                Investigation.clearSpaceInvestigation(workspaceId, spaceId)
              )
          })
    }
  ])

  function onNodeClick() {
    dispatch(Search.restore(reconstructSearch(node)))
    dispatch(submitSearch({history: true, investigation: false}))
  }

  const className = classNames("filter-tree-node", {
    pinned: nodeIsActivePin(node, prevPins),
    active: nodeIsActive(node, prevPins, prevProgram)
  })

  return (
    <div key={i} className={className}>
      <div
        className="filter-tree-parent"
        onClick={onNodeClick}
        onContextMenu={() => menu.open()}
      >
        <FilterNode filter={node.model.filter} />
      </div>
      <div className="filter-tree-children">
        {node.children.map((node, i) => (
          <NodeRow
            node={node}
            workspaceId={workspaceId}
            spaceId={spaceId}
            i={i}
            key={i}
          />
        ))}
      </div>
    </div>
  )
}

export default function FilterTree() {
  const currentWorkspaceId = useSelector(Current.getWorkspaceId)
  const currentSpaceId = useSelector(Current.getSpaceId)
  const investigation = useSelector(
    Investigation.getInvestigation(currentWorkspaceId, currentSpaceId)
  )
  const tree = createInvestigationTree(investigation)

  if (tree.children.length === 0)
    return (
      <EmptySection
        icon={<BookIcon />}
        message="As you search through your data, your history will appear here."
      />
    )

  return (
    <div className="filter-tree">
      {tree.children.map((node, i) => (
        <NodeRow
          workspaceId={currentWorkspaceId}
          spaceId={currentSpaceId}
          node={node}
          i={i}
          key={i}
        />
      ))}
    </div>
  )
}
