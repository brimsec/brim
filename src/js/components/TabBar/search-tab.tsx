import React, {HTMLProps} from "react"
import classNames from "classnames"

import CloseButton from "../close-button"
import RampLeft from "../../icons/ramp-left.svg"
import RampRight from "../../icons/ramp-right.svg"

type Props = {
  title: string
  removeTab: Function
  active: boolean
  isNew: boolean
} & HTMLProps<HTMLDivElement>

const SearchTab = React.forwardRef<HTMLDivElement, Props>(function SearchTab(
  {title, active, removeTab, isNew, ...rest},
  ref
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={classNames("tab", {active, "is-new": isNew})}
    >
      <div className="tab-content">
        <p className="title">{title}</p>
        <CloseButton onClick={removeTab} />
      </div>
      <RampRight />
      <RampLeft />
    </div>
  )
})

export default SearchTab
