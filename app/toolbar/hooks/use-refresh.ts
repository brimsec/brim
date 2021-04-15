import createHref from "app/summary/flows/create-href"
import {useDispatch} from "react-redux"
import {useHistory} from "react-router"
import {AppDispatch} from "src/js/state/types"
import {ActionButtonProps} from "../action-button"

export default function useRefresh(): ActionButtonProps {
  const history = useHistory()
  const dispatch = useDispatch<AppDispatch>()
  return {
    label: "Refresh",
    title: "Refresh the dashboard",
    icon: "reload",
    click: () => {
      history.replace(dispatch(createHref()))
    }
  }
}
