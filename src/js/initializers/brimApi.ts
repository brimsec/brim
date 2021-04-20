import {remote} from "electron"
import path from "path"
import toast from "react-hot-toast"
import {getZealot} from "../flows/getZealot"
import Toolbar, {ToolbarItem} from "../state/Toolbars"
import {Store} from "../state/types"
import {EventEmitter} from "events"
import Current from "../state/Current"

type Cleanup = () => any

class CommandRegistry {
  commandRegistry: EventEmitter

  constructor() {
    this.commandRegistry = new EventEmitter()
  }

  add(command: string, listener: (...args: any[]) => void): Cleanup {
    this.commandRegistry.on(command, listener)

    return () => this.commandRegistry.removeListener(command, listener)
  }

  execute(command: string, ...args: any[]): boolean {
    return this.commandRegistry.emit(command, ...args)
  }

  list(): string[] {
    return this.commandRegistry.eventNames() as string[]
  }
}

interface BrimUIContainerApi<ItemType> {
  add: (containerId: string, item: ItemType) => void
  update: (containerId: string, itemId: string, type: Partial<ItemType>) => void
}

class ToolbarApi implements BrimUIContainerApi<ToolbarItem> {
  constructor(private store: Store) {}

  add(toolbarId: string, item: ToolbarItem) {
    this.store.dispatch(Toolbar.createItem({toolbarId, item}))
  }

  update(toolbarId: string, itemId: string, item: ToolbarItem) {
    this.store.dispatch(Toolbar.updateItem({toolbarId, itemId, item}))
  }
}

// class ContextMenuApi implements BrimUIContainerApi<ContextMenuItem> {
//   constructor(private store: Store) {}
//
//   add() {}
//
//   update() {}
// }

export default class BrimApi {
  public commands = new CommandRegistry()
  public toolbar: BrimUIContainerApi<ToolbarItem>
  public toast: typeof toast

  // public contextMenu: BrimUIContainerApi<ContextMenuItem>

  // TODO: store is made public only to make the initial plugin architecture migration easier, it will eventually be private
  constructor(public store: Store) {
    this.toolbar = new ToolbarApi(store)
    this.toast = toast
    // this.contextMenu = new ContextMenuApi(store)
  }

  public getCurrent() {
    const state = this.store.getState()
    const space = Current.getSpace(state)
    const ws = Current.getWorkspace(state)
    return {
      spaceId: space.id,
      spaceName: space.name,
      workspaceId: ws.id,
      workspaceName: ws.name
    }
  }

  public getZealot() {
    return this.store.dispatch(getZealot())
  }

  public getAppConfig() {
    return {
      spacesRoot: path.join(remote.app.getPath("userData"), "data", "spaces")
    }
  }
}
