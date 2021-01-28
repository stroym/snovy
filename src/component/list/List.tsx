import React, {useEffect, useRef, useState} from "react"
import ListItem from "./ListItem"
import {Item} from "../../model/Base"
import ContextMenu from "../context_menu/ContextMenu"
import ContextMenuItem from "../context_menu/ContextMenuItem"

//TODO mutliselect
const List = <T extends Item>(props: {
  id?: string,
  defaultSelection?: boolean,
  onActiveChange: (active: T | undefined) => any,
  onContextChange: (active: T | null | undefined) => any,
  contextChildren?: Array<React.ReactElement<typeof ContextMenuItem>>
  items: Array<T> | undefined
}) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const [activeItem, setActiveItem] = useState<T | undefined>(props.defaultSelection && props.items && props.items.length > 0 ? props.items[0] : undefined)
  const [activeContext, setActiveContext] = useState<T | undefined | null>()

  useEffect(
    () => {
      console.log("mount list")
    }, []
  )

  // useEffect(
  //   () => {
  //     if (props.defaultSelection && props.items && props.items.length > 0) {
  //       setActiveItem(props.items[0])
  //     }
  //   }, [props.items]
  // )

  useEffect(
    () => {
      props.onActiveChange(activeItem)
    }, [activeItem]
  )

  useEffect(
    () => {
      props.onContextChange(activeContext)
    }, [activeContext]
  )

  return (
    <div id={props.id} ref={selfRef} className={"snovy-list".concat(props.items ? "" : " disabled")}
         onContextMenu={() => setActiveContext(null)}>
      {props.items?.map((item: T) =>
        <ListItem key={item.id} mapped={item} active={item == activeItem} activeContext={item == activeContext}
                  onClick={(item: T) => {setActiveItem(item)}} onContext={(item: T) => {setActiveContext(item)}}
        />)
      }
      <ContextMenu parentRef={selfRef} resetContext={() => setActiveContext(undefined)}>
        {props.contextChildren}
      </ContextMenu>
    </div>
  )

}

export default List