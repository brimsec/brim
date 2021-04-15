import ast from "./ast"
import dateTuple from "./date-tuple"
import form from "./form"
import interop from "./interop"
import program from "./program"
import randomHash from "./random-hash"
import relTime from "./rel-time"
import space from "./space"
import span from "./span"
import syntax from "./syntax"
import tab from "./brim-tab"
import time from "./time"
import workspace from "./workspace"

export type Ts = {
  ns: number
  sec: number
}

export type BrimSpace = ReturnType<typeof space>
export type BrimWorkspace = ReturnType<typeof workspace>

export type Span = [Ts, Ts]

export default {
  program,
  ast,
  syntax,
  space,
  time,
  relTime,
  span,
  dateTuple,
  form,
  interop,
  randomHash,
  tab,
  workspace
}
