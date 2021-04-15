import {connect} from "react-redux"
import React from "react"

import {BrimError} from "../errors/types"
import {State} from "../state/types"
import {first} from "../lib/Array"
import {reactElementProps} from "../test/integration"
import Errors from "../state/Errors"

type Props = {error: BrimError}

export function LatestError({error}: Props) {
  const message = error ? `${error.type}: ${error.message}` : ""

  return (
    <div className="latest-error" {...reactElementProps("notification")}>
      {message}
    </div>
  )
}

function stateToProps(state: State): Props {
  return {error: first(Errors.getErrors(state))}
}

export const XLatestError = connect(stateToProps, null)(LatestError)
