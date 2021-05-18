import {remote} from "electron"
import path from "path"
import toast from "react-hot-toast"
import {getZealot} from "../flows/getZealot"
import {AppDispatch, State} from "../state/types"
import {CommandRegistry, LoaderRegistry} from "./registries"
import {ConfigsApi, ContextMenuApi, ToolbarApi} from "./ui-apis"
import {StorageApi} from "./storage"

export default class BrimApi {
  public commands = new CommandRegistry()
  public loaders = new LoaderRegistry()
  public toolbar: ToolbarApi
  public contextMenu: ContextMenuApi
  public configs: ConfigsApi
  public storage: StorageApi
  public toast = toast

  /*
  TODO: store is made public only to make the initial plugin architecture
    migration easier, it will eventually be private
   */
  public dispatch: AppDispatch
  public getState: () => State

  constructor() {}

  public init(d: AppDispatch, gs: () => State) {
    this.dispatch = d
    this.getState = gs

    this.toolbar = new ToolbarApi(d, gs)
    this.configs = new ConfigsApi(d, gs)
    this.storage = new StorageApi(d, gs)
    this.contextMenu = new ContextMenuApi(d, gs)
  }

  public getZealot() {
    return this.dispatch(getZealot())
  }

  public getTempDir() {
    return remote.app.getPath("temp")
  }

  public getAppConfig() {
    return {
      dataRoot: path.join(remote.app.getPath("userData"), "data"),
      zdepsDirectory: path.join(
        remote.app.getAppPath().replace("app.asar", "app.asar.unpacked"),
        "zdeps"
      )
    }
  }
}
