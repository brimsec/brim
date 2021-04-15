import {MenuItemConstructorOptions} from "electron/main"
import {BrimSpace} from "src/js/brim"
import {popNotice} from "src/js/components/pop-notice"
import deleteSpace from "src/js/flows/delete-space"
import deleteSpaces from "src/js/flows/delete-spaces"
import {showContextMenu, showMessageBox} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Modal from "src/js/state/Modal"
import Spaces from "src/js/state/Spaces"

const showSpaceContextMenu = (space: BrimSpace) => (dispatch, getState) => {
  const workspaceId = Current.getWorkspaceId(getState())
  const spaceIds = Spaces.ids(workspaceId)(getState())
  const template = [
    {
      label: "Rename",
      click: () => {
        dispatch(Modal.show("space", {workspaceId, spaceId: space.id}))
      }
    },
    {
      label: "Delete",
      click: () => {
        showMessageBox({
          type: "warning",
          title: "Delete Space",
          message: `Are you sure you want to delete ${space.name}?`,
          buttons: ["OK", "Cancel"]
        }).then(({response}) => {
          if (response === 0)
            dispatch(deleteSpace(space.id)).then(() => {
              popNotice(`Deleted space "${space.name}"`)
            })
        })
      }
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () => {
        showMessageBox({
          type: "warning",
          title: "Delete All Spaces",
          message: `Are you sure you want to delete all spaces for this workspace?`,
          buttons: ["OK", "Cancel"]
        }).then(({response}) => {
          if (response === 0)
            dispatch(deleteSpaces(spaceIds)).then(() => {
              popNotice("Deleted all spaces")
            })
        })
      }
    }
  ] as MenuItemConstructorOptions[]

  showContextMenu(template)
}

export default showSpaceContextMenu
