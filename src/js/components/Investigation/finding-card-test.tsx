import React from "react"

import FindingCard from "./finding-card"
import brim from "../../brim"
import loginTo from "../../test/helpers/login-to"
import provide from "../../test/helpers/provide"
import {Finding} from "src/js/state/Investigation/types"

let store
beforeEach(async () => {
  const setup = await loginTo("workspace1", "space1")
  store = setup.store
})

const finding: Finding = {
  ts: brim.time().toTs(),
  search: {
    program: "finding card test",
    pins: [],
    spanArgs: [brim.time().toTs(), brim.time().toTs()],
    spaceId: "1",
    spaceName: "space1",
    target: "events"
  }
}

test("Clicking the history submits the search", () => {
  const el = provide(
    store,
    <FindingCard spaceId="1" workspaceId="1" finding={finding} />
  )
  store.clearActions()
  el.simulate("click")
})
