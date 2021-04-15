import React from "react"
import ReactDOM from "react-dom"
import {useDispatch, useSelector} from "react-redux"
import {CSSTransition} from "react-transition-group"
import {XColumnChooserMenu} from "src/js/components/column-chooser-menu"
import lib from "src/js/lib"
import Modal from "src/js/state/Modal"

export default function ColumnsModal() {
  const dispatch = useDispatch()
  const modal = useSelector(Modal.getName)
  if (modal !== "columns") return null

  const onClose = () => dispatch(Modal.hide())
  const style = {
    right: 0,
    top: 0,
    height: lib.win.getHeight()
  }
  return ReactDOM.createPortal(
    <CSSTransition
      in={true}
      classNames="dim-portal-overlay"
      timeout={{enter: 200}}
      onClick={onClose}
      appear
    >
      {/* Don't reuse portal-overlay, it's a relic of the past */}
      <div className="portal-overlay">
        <div className="portal-item" style={style}>
          <XColumnChooserMenu onClose={onClose} />
        </div>
      </div>
    </CSSTransition>,
    lib.doc.id("context-menu-root")
  )
}
