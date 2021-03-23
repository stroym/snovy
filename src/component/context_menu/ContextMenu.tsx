import React, {useContext, useRef} from "react"
import ContextMenuItem from "./ContextMenuItem"
import {useContextMenu} from "../../util/Hooks"
import {isArray} from "../../util/Utils"
import OptionsContext from "../../util/OptionsContext"

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  children: Array<React.ReactElement<typeof ContextMenuItem> | undefined> | React.ReactElement<typeof ContextMenuItem>,
  onFinish: () => void
}) => {

  if (isArray(props.children) && props.children.isEmpty()) {
    return null
  }

  const selfRef = useRef<HTMLDivElement>(null)

  const theme = useContext(OptionsContext).theme

  const {visible, setVisible, position} = useContextMenu(selfRef, props.parentRef)

  return (
    <>
      {visible &&
      <div
        className="snovy-context-menu" ref={selfRef}
        onClick={() => {
          props.onFinish()
          setVisible(false)
        }}
        style={{backgroundColor: theme.primary, color: theme.textPrimary, ...position}}
      >
        {props.children}
      </div>
      }
    </>
  )

}

export default ContextMenu