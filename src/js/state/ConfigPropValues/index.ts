import {createSlice, PayloadAction} from "@reduxjs/toolkit"
export type ConfigPropValuesState = {
  [configName: string]: {
    [propName: string]: any
  }
}

const slice = createSlice({
  name: "$configPropValues",
  initialState: {},
  reducers: {
    set: (
      state,
      action: PayloadAction<{configName: string; propName: string; value: any}>
    ) => {
      const {configName, propName, value} = action.payload
      if (!state[configName]) state[configName] = {[propName]: value}
      else state[configName][propName] = value
    },
    delete: (
      state,
      action: PayloadAction<{configName: string; propName: string}>
    ) => {
      const {configName, propName} = action.payload
      if (!state[configName]) return
      delete state[configName][propName]
      if (Object.keys(state[configName]).length === 0) delete state[configName]
    }
  }
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  get: (configName: string, propName?: string) => ({
    configPropValues: state
  }) => {
    if (!state[configName]) return undefined
    if (!propName) return state[configName]
    return state[configName][propName]
  },
  all: (state) => state.configPropValues
}
