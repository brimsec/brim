import React from "react"
import {zed} from "zealot"

type Props = {
  field: zed.Field
  log: zed.Record
  menuBuilder: Function
}

export default function CompoundField(_: Props) {
  return <h1>Implement compound fields</h1>
  // // @ts-ignore
  // const compound = createComplexCell(field)
  // const render = []

  // for (let i = 0; i < compound.length; ++i) {
  //   const item = new zed.Field({
  //     name: field.name,
  //     // @ts-ignore
  //     data: field.data.items && field.data.items[i]
  //   })
  //   if (item) {
  //     const menu = menuBuilder(item, log, true)
  //     render.push(<SingleField key={i} field={item} menu={menu} record={log} />)
  //   }
  //   if (i !== compound.length - 1) {
  //     render.push(<Comma key={"comma-" + i} />)
  //   }
  // }

  // return <Wrapper type={compound.container}>{render}</Wrapper>
}

// function Comma() {
//   return <Extra value="," className="separator" />
// }

// function Extra({value, className}: {value: string | null; className?: string}) {
//   return (
//     <div className={classNames("compound-field-extra", className)}>{value}</div>
//   )
// }

// type WrapperProps = {
//   type: string | null
//   children: any
// }

// function Wrapper({type, children}: WrapperProps) {
//   const [open, close] = getWrapper(type)
//   return (
//     <>
//       <Extra value={open} />
//       {children}
//       <Extra value={close} />
//     </>
//   )
// }

// function getWrapper(container) {
//   switch (container) {
//     case "set":
//       return ["{", "}"]
//     case "vector":
//       // DELETE after vector-array is merged
//       return ["[", "]"]
//     case "array":
//       return ["[", "]"]
//     default:
//       return [null, null]
//   }
// }
