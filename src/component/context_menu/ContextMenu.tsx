import React, {useRef} from "react"
import ContextMenuItem from "./ContextMenuItem"
import {useContextMenu} from "../../util/Hooks"

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  resetContext: () => void,
  children: Array<React.ReactElement<typeof ContextMenuItem>>
}) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const {visible, flip, position} = useContextMenu(selfRef, props.parentRef, props.resetContext)

  return (
    <>
      {visible &&
      <div className="snovy-context-menu" ref={selfRef} onClick={flip} style={position}>
        {props.children}
      </div>
      }
    </>
  )

}

export default ContextMenu