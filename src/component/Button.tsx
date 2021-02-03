import React from "react"

const Button = (props: {
  className?: string,
  onClick: (e: React.MouseEvent) => void,
  icon: string
}) => {

  return (
    <button type="button" className={"snovy-button".concat(props.className ? " " + props.className : "")}
            onClick={(e) => props.onClick(e)}
    >
      {props.icon}
    </button>
  )

}

export const AddButton = (props: {
  onClick: (e: React.MouseEvent) => void
}) => {

  return (
    <Button className={"snovy-add-button"} onClick={props.onClick} icon={"+"}/>
  )

}

export const RemoveButton = (props: {
  onClick: () => void
}) => {

  return (
    <Button className={"snovy-remove-button"} onClick={props.onClick} icon={"×"}/>
  )

}

export const CollapseButton = (props: {
  collapsed?: boolean,
  onClick: () => void
}) => {

  return (
    <Button className={"snovy-collapse-button"} onClick={props.onClick} icon={props.collapsed ? "▲" : "▼"}/>
  )

}

// export const ColourButton = (props: {
//   onClick: () => any
// }) => {
//
//   return (
//     <Button className={"collapse-button"} onClick={props.onClick} icon={"▲" : "▼"}/>
//   )
//
// }