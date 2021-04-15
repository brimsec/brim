import React, {useRef} from "react"
import {Droppable, DragDropContext} from "react-beautiful-dnd"
import AutoSize from "react-virtualized-auto-sizer"
import {FixedSizeList} from "react-window"
import {useController} from "../hooks/use-controller"
import {TreeListContext} from "../hooks/use-tree-list-context"
import {TreeListProps} from "../types"
import {TreeRow, TreeRowContent} from "./tree-row"

export function TreeList(props: TreeListProps) {
  const ref = useRef()
  const items = props.root.items
  const ctl = useController(ref, props)

  return (
    <TreeListContext.Provider value={ctl}>
      <DragDropContext onDragEnd={ctl.onMove}>
        <AutoSize>
          {({height, width}) => (
            <Droppable
              droppableId="tree-list"
              mode="virtual"
              renderClone={(provided, _, rubric) => (
                <TreeRowContent
                  item={items[rubric.source.index]}
                  provided={provided}
                  index={rubric.source.index}
                />
              )}
            >
              {(provided) => (
                <FixedSizeList
                  className="list"
                  height={height}
                  width={width}
                  itemCount={items.length}
                  itemSize={props.itemHeight}
                  outerRef={provided.innerRef}
                  innerRef={ref}
                  itemData={items}
                >
                  {TreeRow}
                </FixedSizeList>
              )}
            </Droppable>
          )}
        </AutoSize>
      </DragDropContext>
    </TreeListContext.Provider>
  )
}
