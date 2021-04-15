import React from "react"
import classNames from "classnames"

import Animate from "./Animate"

type Props = {show: boolean; children: any; className?: string}

export default function NoticeBanner({
  show,
  children,
  className,
  ...rest
}: Props) {
  const enter = {
    translateY: ["-120%", 0],
    translateX: ["-50%", "-50%"],
    scale: [0.8, 1],
    duration: 300,
    easing: "easeOutSine"
  }
  const exit = {
    opacity: [1, 0],
    scale: [1, 0.7],
    translateY: [0, "-80%"],
    easing: "easeOutSine",
    duration: 300
  }
  return (
    <Animate show={show} enter={enter} exit={exit}>
      <div
        {...rest}
        className={classNames("notice-banner", "fixed", className)}
      >
        {children}
      </div>
    </Animate>
  )
}
