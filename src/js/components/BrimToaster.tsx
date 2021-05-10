import React from "react"
import {Toaster} from "react-hot-toast"

const BrimToaster = () => {
  return (
    <Toaster position="bottom-right" toastOptions={{className: "brim-toast"}} />
  )
}

export default BrimToaster
