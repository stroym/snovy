import React from "react"

export const RemoveButton = (props: {
  onClick: () => {}
}) => {

  return (
    <button className="snovy-button tag-remove-button" onClick={() => props.onClick()}>{"×"}</button>
  )

}

export const CollapseButton = (props: {
  collapsed: boolean,
  onClick: () => {}
}) => {

  return (
    <button className="snovy-button collapse-button" onClick={() => props.onClick()}>{
      props.collapsed ? "▲" : "▼"
    }</button>
  )

}