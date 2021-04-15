import {createContext, useContext} from "react"
import {TreeController} from "../types"

export const TreeListContext = createContext<TreeController>(null)

export const useTreeListContext = () => useContext(TreeListContext)
