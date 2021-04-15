import {SPACES_DETAIL, SPACES_INGEST_SNAPSHOT, SPACES_REMOVE} from "./types"
import actions from "./actions"

export default function actionsFor(workspaceId: string, spaceId: string) {
  return {
    setIngestProgress: (value: number | null) => {
      return actions.setIngestProgress(workspaceId, spaceId, value)
    },
    appendIngestWarning: (warning: string) => {
      return actions.appendIngestWarning(workspaceId, spaceId, warning)
    },
    clearIngestWarnings: () => {
      return actions.clearIngestWarnings(workspaceId, spaceId)
    },
    setIngestSnapshot: (count: number): SPACES_INGEST_SNAPSHOT => ({
      type: "$SPACES_INGEST_SNAPSHOT",
      workspaceId,
      spaceId,
      count
    }),
    remove: (): SPACES_REMOVE => ({
      type: "$SPACES_REMOVE",
      workspaceId,
      spaceId
    }),
    create: (): SPACES_DETAIL => ({
      type: "$SPACES_DETAIL",
      workspaceId,
      space: {id: spaceId}
    })
  }
}
