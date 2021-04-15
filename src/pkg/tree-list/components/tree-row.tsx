import React from "react"
import {useTreeListContext} from "../hooks/use-tree-list-context"
import {Draggable, DraggableProvided} from "react-beautiful-dnd"
import {TreeItem} from "../types"

type Props = {
  provided: DraggableProvided
  style?: object
  item: TreeItem
  index: number
}

export function TreeRowContent({provided, style, item, index}: Props) {
  const ctx = useTreeListContext()
  return (
    <ctx.ItemRenderer
      item={item}
      innerRef={provided.innerRef}
      isSelected={ctx.isSelected(index)}
      itemProps={{
        ...provided.draggableProps,
        ...provided.dragHandleProps,
        style: {...style, ...provided.draggableProps.style},
        onClick: (e) => ctx.onClick(e, item, index),
        onContextMenu: (e) => ctx.onContextMenu(e, item)
      }}
    />
  )
}

export function TreeRow({data, index, style}) {
  const item = data[index]
  return (
    <Draggable draggableId={item.id} index={index} key={item.id}>
      {(provided) => (
        <TreeRowContent
          provided={provided}
          item={item}
          style={style}
          index={index}
        />
      )}
    </Draggable>
  )
}
