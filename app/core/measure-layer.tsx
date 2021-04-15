import ReactDOM from "react-dom"
import doc from "src/js/lib/doc"

export default function MeasureLayer({children}) {
  return ReactDOM.createPortal(children, doc.id("measure-layer"))
}
