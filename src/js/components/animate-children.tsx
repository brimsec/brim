import React, {HTMLProps} from "react"

function move(diff) {
  return [
    [{transform: `translateY(${diff}px)`}, {transform: "translateY(0px)"}],
    {duration: 300, easing: "ease"}
  ]
}

function enter() {
  return [
    [{opacity: 0}, {opactiy: 1}],
    {
      duration: 300,
      delay: 300,
      fill: "backwards",
      easing: "ease"
    }
  ]
}

type Props = {
  children: JSX.Element[]
} & HTMLProps<HTMLDivElement>

export default class AnimateChildren extends React.Component<Props> {
  parent: {current: null | HTMLDivElement}

  constructor(props: Props) {
    super(props)
    this.parent = React.createRef()
  }

  getSnapshotBeforeUpdate({children}: Props) {
    const cache = {}
    const parent = this.parent.current
    if (!parent) return

    React.Children.forEach(children, (child, i) => {
      const el = parent.children[i]
      const key = child.key
      cache[key] = el.getBoundingClientRect()
    })

    return cache
  }

  componentDidUpdate(_p: Props, _s: any, cache: Object) {
    const {children} = this.props
    const parent = this.parent.current
    if (!parent) return

    React.Children.forEach(children, (child, i) => {
      const el = parent.children[i]
      const key = child.key
      const curr = el.getBoundingClientRect()
      const prev = cache[key]

      if (prev) {
        const diff = prev.top - curr.top
        if (diff) animate(el, move(diff))
      } else {
        animate(el, enter())
      }
    })
  }

  render() {
    const {children, ...rest} = this.props
    return (
      <div {...rest} ref={this.parent}>
        {children}
      </div>
    )
  }
}

function animate(el: Element, args) {
  // @ts-ignore
  el.animate(...args)
}
