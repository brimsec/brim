import {isEmpty} from "lodash"
import React from "react"

import {FormError} from "../../brim/form"
import classNames from "classnames"

type Props = {errors: FormError[]; className?: string}

export default function FormErrors({errors, className}: Props) {
  if (isEmpty(errors)) return null
  const hasInputFocus = errors.some((err) => err.label && err.input)
  return (
    <div className={classNames("errors", className)}>
      <h4>Form Errors</h4>
      {hasInputFocus && <p>Click name to focus input.</p>}
      <ul>
        {errors.map(({label, message, input}, i) => (
          <li key={i}>
            <a onClick={() => input.focus()}>{label}</a> {message}
          </li>
        ))}
      </ul>
    </div>
  )
}
