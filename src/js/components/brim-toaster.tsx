import {Toaster, useToasterStore} from "react-hot-toast"
import React, {useEffect, useState} from "react"
import last from "lodash/last"
import isEmpty from "lodash/isEmpty"
import styled from "styled-components"
import {toastLocator} from "../test/locators"

const HiddenToast = styled.p`
  display: none;
`

/*
  BrimToaster renders the react-hot-toaster component and also caches the most recent
  "toast" generated and renders it in a persisted, hidden dom element so that we can more
  reliably test for it's existence in our integration tests
 */
const BrimToaster = () => {
  const [lastToast, setLastToast] = useState(null)
  const {toasts} = useToasterStore()

  useEffect(() => {
    if (isEmpty(toasts)) return

    setLastToast(last(toasts))
  }, [toasts])

  return (
    <>
      <HiddenToast {...toastLocator.props}>{lastToast?.message}</HiddenToast>
      <Toaster position="bottom-center" />
    </>
  )
}

export default BrimToaster
