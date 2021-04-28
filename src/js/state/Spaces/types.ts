import {Ts} from "../../brim"

export type SpacesState = {
  // workspaceId
  [key: string]: {
    // spaceId
    [key: string]: Space
  }
}

export type SpacesAction =
  | SPACES_SET
  | SPACES_DETAIL
  | SPACES_RENAME
  | SPACES_INGEST_PROGRESS
  | SPACES_INGEST_WARNING_APPEND
  | SPACES_INGEST_WARNING_CLEAR
  | SPACES_REMOVE
  | SPACES_INGEST_SNAPSHOT
  | SPACES_WORKSPACE_REMOVE
export type Space = {
  name: string
  id: string
  min_time: Ts
  max_time: Ts
  storage_kind: "filestore" | "archivestore"
  ingest: SpaceIngest
  parent_id?: string
  size: number
}

type SpaceIngest = {
  warnings: string[]
  progress: number | null
  snapshot: number | null
}

export type SPACES_SET = {
  type: "$SPACES_SET"
  workspaceId: string
  spaces: Partial<Space>[]
}

export type SPACES_DETAIL = {
  type: "$SPACES_DETAIL"
  workspaceId: string
  space: Partial<Space>
}

export type SPACES_RENAME = {
  type: "$SPACES_RENAME"
  workspaceId: string
  spaceId: string
  newName: string
}

export type SPACES_INGEST_PROGRESS = {
  type: "$SPACES_INGEST_PROGRESS"
  workspaceId: string
  spaceId: string
  value: number | null
}

export type SPACES_INGEST_WARNING_APPEND = {
  type: "$SPACES_INGEST_WARNING_APPEND"
  warning: string
  spaceId: string
  workspaceId: string
}

export type SPACES_INGEST_WARNING_CLEAR = {
  type: "$SPACES_INGEST_WARNING_CLEAR"
  spaceId: string
  workspaceId: string
}

export type SPACES_REMOVE = {
  type: "$SPACES_REMOVE"
  workspaceId: string
  spaceId: string
}

export type SPACES_WORKSPACE_REMOVE = {
  type: "$SPACES_WORKSPACE_REMOVE"
  workspaceId: string
}

export type SPACES_INGEST_SNAPSHOT = {
  type: "$SPACES_INGEST_SNAPSHOT"
  workspaceId: string
  spaceId: string
  count: number
}
