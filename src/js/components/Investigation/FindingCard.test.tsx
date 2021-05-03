import React from "react"

import FindingCard from "./FindingCard"
import brim from "../../brim"
import loginTo from "../../test/helpers/loginTo"
import provide from "../../test/helpers/provide"
import {Finding} from "src/js/state/Investigation/types"

let store
beforeEach(async () => {
  const setup = await loginTo("workspace1", "pool1")
  store = setup.store
})

const finding: Finding = {
  ts: brim.time().toTs(),
  search: {
    program: "finding card test",
    pins: [],
    spanArgs: [brim.time().toTs(), brim.time().toTs()],
    poolId: "1",
    poolName: "pool1",
    target: "events"
  }
}

test("Clicking the history submits the search", () => {
  const el = provide(
    store,
    <FindingCard poolId="1" workspaceId="1" finding={finding} />
  )
  store.clearActions()
  el.simulate("click")
})
