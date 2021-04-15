import * as React from "react"
import classNames from "classnames"
import createTypeEl from "./create-type-el"

export const Paragraph = createTypeEl("p", "paragraph")
export const Mono = createTypeEl("p", "mono")
export const Fieldset = createTypeEl("p", "fieldset")
export const Subscript = createTypeEl("sup", "subscript")
export const Label = createTypeEl("label", "label")
export const LinkButton = createTypeEl("a", "link-button")
export const Stats = createTypeEl("span", "stats")

type CodeProps = {
  children?: React.ReactNode
  light?: boolean
  full?: boolean
}

export const Code = ({children, full, light, ...props}: CodeProps) => (
  <pre {...props} className={classNames("code", {full, light})}>
    {children}
  </pre>
)
