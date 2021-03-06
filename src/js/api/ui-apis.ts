import {AppDispatch, State} from "../state/types"
import Toolbar, {ToolbarItem} from "../state/Toolbars"
import Configs, {Config} from "../state/Configs"
import ConfigPropValues from "../state/ConfigPropValues"

export class ToolbarApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  add(toolbarId: string, item: ToolbarItem) {
    this.dispatch(Toolbar.createItem({toolbarId, item}))
  }

  update(toolbarId: string, itemId: string, item: Partial<ToolbarItem>) {
    this.dispatch(Toolbar.updateItem({toolbarId, itemId, item}))
  }
}

export class ConfigsApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  get(configName, propName): any {
    return ConfigPropValues.get(configName, propName)(this.getState())
  }

  add(config: Config) {
    this.dispatch(Configs.set(config))
  }
}
