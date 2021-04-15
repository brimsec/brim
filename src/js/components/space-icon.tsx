import React from "react"

import ArchiveBorderIcon from "../icons/archive-border-icon"
import FileBorder from "../icons/file-border"
import SubspaceBorderIcon from "../icons/subspace-border-icon"

type Props = {
  type: "archive" | "subspace" | "space"
  className?: string
}

export default function SpaceIcon({type, ...rest}: Props) {
  switch (type) {
    case "archive":
      return <ArchiveBorderIcon {...rest} />
    case "subspace":
      return <SubspaceBorderIcon {...rest} />
    default:
      return <FileBorder {...rest} />
  }
}
