import {upperFirst} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {BrimError} from "../errors/types"
import NetworkErrorNotice from "./network-error-notice"
import Notice from "../state/Notice"
import NoticeBanner from "./notice-banner"
import useEscapeKey from "./hooks/use-escape-key"

export default function ErrorNotice() {
  const error = useSelector(Notice.getError)
  const visible = useSelector(Notice.getVisible)

  return (
    <NoticeBanner show={visible}>
      <ErrorMessage error={error} />
    </NoticeBanner>
  )
}

function ErrorMessage({error}: {error: BrimError}) {
  const Component = getComponent(error)
  const dispatch = useDispatch()
  useEscapeKey(() => dispatch(Notice.dismiss()))
  return <Component error={error} />
}

function getComponent(error: BrimError) {
  if (error.type === "NetworkError") return NetworkErrorNotice
  else if (error) return Default
  else return None
}

function None() {
  return null
}

function Default({error}: {error: BrimError}) {
  const dispatch = useDispatch()
  const msg = upperFirst(error.message)
  const details = error.details
  return (
    <>
      <p>
        {msg} <a onClick={() => dispatch(Notice.dismiss())}>Dismiss</a>
      </p>
      {details && details.length > 0 && (
        <div className="error-details">
          {details
            .flatMap((s) => s.split("\n"))
            .map((string, i) => (
              <p key={i}>{string}</p>
            ))}
        </div>
      )}
    </>
  )
}
