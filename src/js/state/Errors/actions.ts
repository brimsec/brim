import {ERRORS_CLEAR, ERROR_CREATE} from "./types"
import AppError from "../../models/app-error"

export default {
  createError: (err: any): ERROR_CREATE => ({
    type: "ERROR_CREATE",
    error: err instanceof AppError ? err.getJSON() : err
  }),

  clearErrors: (): ERRORS_CLEAR => ({type: "ERRORS_CLEAR"})
}
