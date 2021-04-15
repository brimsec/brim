import useLayoutUpdate from "app/core/hooks/use-layout-update"
import React, {useLayoutEffect, useRef, useState} from "react"
import styled from "styled-components"

const PADDING = 2

type SpotlightProps = {
  width: number
  x: number
  height: number
  animate: boolean
}

const Spotlight = styled.div<SpotlightProps>`
  z-index: -1;
  position: absolute;
  background: white;
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
  transform: translateX(${(p) => p.x}px);
  transition: ${(p) => (p.animate ? "all 300ms" : "none")};
  border-radius: 4px;
`

function useSpotlight(ref): [SpotlightProps, (i: number, a: boolean) => void] {
  const init = {x: 0, width: 0, height: 0, animate: false}
  const [props, setProps] = useState<SpotlightProps>(init)

  const moveTo = (index: number, animate: boolean) => {
    const node = ref.current
    if (node) {
      const {x: parentX} = node.getBoundingClientRect()
      const child = node.querySelectorAll("button")[index]
      if (child) {
        const {x: childX, width, height} = child.getBoundingClientRect()
        const x = childX - parentX - PADDING
        setProps({x, width, height, animate})
      }
    }
  }

  return [props, moveTo]
}

const BG = styled.div`
  display: inline-flex;
  background: rgba(0, 0, 0, 0.03);
  box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  height: 22px;
  position: relative;
  padding: ${PADDING}px;
`

type Props = {
  children: JSX.Element[]
  value: string
  onChange
}

export default function SwitchButton({value, onChange, children}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const index = children.findIndex((c) => c.props.value === value)
  const [props, moveTo] = useSpotlight(ref)

  useLayoutEffect(() => moveTo(index, false), [])
  useLayoutUpdate(() => moveTo(index, true), [value, children])

  return (
    <BG ref={ref}>
      <Spotlight {...props} />
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          onClick: () => {
            child.props.value !== value && onChange(child.props.value)
          }
        })
      })}
    </BG>
  )
}
