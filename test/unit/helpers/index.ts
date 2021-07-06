import {render} from "./render"

// re-export everything
export * from "@testing-library/react"
// override render method
export {render}
export * from "./setup-brim"
export * from "./utils"
