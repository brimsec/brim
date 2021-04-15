import {useDispatch} from "react-redux"
import Modal from "src/js/state/Modal"
import {ActionButtonProps} from "../action-button"

export default function useColumns(): ActionButtonProps {
  const dispatch = useDispatch()

  return {
    label: "Columns",
    title: "Show or hide columns in the table",
    icon: "columns",
    click: () => dispatch(Modal.show("columns"))
  }
}
