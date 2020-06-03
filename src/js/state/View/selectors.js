/* @flow */

import type {State} from "../types"

export default {
  getDownloadsIsOpen: (state: State) => state.view.downloadsIsOpen,

  getTimeZone: (state: State) => state.view.timeZone,

  getInvestigationView: (state: State) => {
    return state.view.investigationView
  }
}
