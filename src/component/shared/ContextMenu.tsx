import React, {useCallback, useEffect, useRef, useState} from "react"
import {Holder, OrphanHolder} from "../../model/Base"

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  actions: Array<Action>,
  contextChange: (action: Action) => any,
  resetContext: () => any
}) => {

  const selfRef = useRef<HTMLOListElement>(null)

  const [visible, setVisible] = useState(false)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick)
      props.parentRef.current?.addEventListener("contextmenu", handleContextMenu)

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
        props.parentRef.current?.removeEventListener("contextmenu", handleContextMenu)
      }
    }, []
  )

  const handleOutsideClick = useCallback(
    (event) => {
      if (!selfRef.current?.contains(event.target)) {

        setVisible(false)
        props.resetContext()
      }
    }, []
  )

  const handleItemClick = useCallback(
    (action: Action) => {
      props.contextChange(action)

      setVisible(false)
      props.resetContext()
    }, []
  )

  const handleContextMenu = useCallback(
    (event: any) => {
      event.preventDefault()

      setX(event.pageX)
      setY(event.pageY)

      setVisible(true)
    },
    []
  )

  return (
    <ol className="snovy-context-menu" hidden={!visible} ref={selfRef}
        style={{
          position: "absolute",
          top: y + "px",
          left: x + "px"
        }}>
      {props.actions.map((a: Action, i: number) => <ContextMenuItem key={i} action={a} execute={handleItemClick}/>)}
    </ol>
  )

}

export const ContextMenuItem = (props: {
  action: Action,
  execute: (action: Action) => any
}) => {

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      props.execute(props.action)
    }, []
  )

  return (
    <li onClick={handleClick}>{props.action.text}</li>
  )

}

export class Action {

  text: string;
  type: ActionType;
  target?: Holder<any, any>;
  parent?: OrphanHolder<any>

  constructor(text: string, type: ActionType, target?: Holder<any, any>, parent?: OrphanHolder<any>) {
    this.text = text
    this.type = type
    this.target = target
    this.parent = parent
  }

}

export enum ActionType {
  NEW,
  EDIT,
  DELETE
}

export default ContextMenu