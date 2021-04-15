import {NOTICE_CLEAR, NOTICE_DISMISS, NOTICE_SET} from "./types"
import AppError from "../../models/app-error"

export default {
  set: (error: any): NOTICE_SET => ({
    type: "NOTICE_SET",
    error: error instanceof AppError ? error.toBrimError() : error
  }),
  clear: (): NOTICE_CLEAR => ({type: "NOTICE_CLEAR"}),
  dismiss: (): NOTICE_DISMISS => ({type: "NOTICE_DISMISS"})
}
