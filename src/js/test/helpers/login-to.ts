import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import {createZealotMock, ZealotMock} from "zealot"
import Spaces from "../../state/Spaces"
import Workspaces from "../../state/Workspaces"
import {Workspace} from "../../state/Workspaces/types"
import fixtures from "../fixtures"
import initTestStore, {TestStore} from "../init-test-store"

export default async function loginTo(
  workspaceName: string,
  spaceName: string
): Promise<{store: TestStore; workspace: Workspace; zealot: ZealotMock}> {
  const mock = createZealotMock()
  mock
    .stubPromise("version", {version: "1"}, "always")
    .stubPromise("spaces.list", [{name: "dataSpace", id: "1"}], "always")
    .stubPromise("spaces.get", {name: "dataSpace", id: "1"}, "always")
    .stubStream(
      "search",
      [
        {type: "TaskStart", task_id: 1},
        {type: "TaskEnd", task_id: 1}
      ],
      "always"
    )
  const store = initTestStore(mock.zealot)
  const workspace = fixtures(workspaceName)
  const space = fixtures(spaceName)

  store.dispatch(Workspaces.add(workspace))
  store.dispatch(Spaces.setDetail(workspace.id, space))
  store.dispatch(tabHistory.push(lakePath(space.id, workspace.id)))
  return {store, workspace, zealot: mock}
}
