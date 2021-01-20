import React, {useEffect, useRef, useState} from "react"

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  actions: Array<Action>,
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

  const handleOutsideClick = (event: any) => {
    if (!selfRef.current?.contains(event.target)) {
      setVisible(false)
      props.resetContext()
    }
  }

  const handleItemClick = () => {
    setVisible(false)
    props.resetContext()
  }

  const handleContextMenu = (event: any) => {
    event.preventDefault()

    setX(event.pageX)
    setY(event.pageY)

    setVisible(true)
  }

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
  execute: () => any
}) => {

  const handleClick = () => {
    props.action.execute()
    props.execute()
  }

  return (
    <li onClick={handleClick}>{props.action.text}</li>
  )

}

export class Action {

  text: string
  execute: (...args: any) => any

  constructor(text: string, execute: (...args: any) => any) {
    this.text = text
    this.execute = execute
  }

}

export default ContextMenu