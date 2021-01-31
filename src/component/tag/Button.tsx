import React from "react"

const Button = (props: {
  className?: string,
  onClick: () => any,
  icon: string
}) => {

  return (
    <button className={"snovy-button".concat(props.className ? " " + props.className : "")}
            onClick={() => props.onClick()}
    >
      {props.icon}
    </button>
  )

}

export const RemoveButton = (props: {
  onClick: () => any
}) => {

  return (
    <Button className={"tag-remove-button"} onClick={props.onClick} icon={"×"}/>
  )

}

export const CollapseButton = (props: {
  collapsed?: boolean,
  onClick: () => any
}) => {

  return (
    <Button className={"collapse-button"} onClick={props.onClick} icon={props.collapsed ? "▲" : "▼"}/>
  )

}