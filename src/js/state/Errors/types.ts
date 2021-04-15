import AppError from "../../models/app-error"

export type ErrorsState = AppError[]
export type ErrorsAction = ERROR_CREATE | ERRORS_CLEAR

export type ERROR_CREATE = {type: "ERROR_CREATE"; error: any}
export type ERRORS_CLEAR = {type: "ERRORS_CLEAR"}
