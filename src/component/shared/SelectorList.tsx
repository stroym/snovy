import React, {useEffect, useRef, useState} from "react"
import SelectorListItem from "./SelectorListItem"

import "react-contexify/dist/ReactContexify.css"
import {Holder} from "../../model/Base"
import ContextMenu, {Action} from "./ContextMenu"

const SelectorList = <P extends Holder<T, any>, T extends Holder<any, P>>(props: {
  id: string,
  onActiveChange: (active: T | undefined) => any,
  holder: P | undefined
}) => {

  const selfRef = useRef<HTMLOListElement>(null)

  const [activeItem, setActiveItem] = useState<T>()
  const [activeContext, setActiveContext] = useState<T | undefined | null>()
  const [actions, setActions] = useState<Array<Action>>([])

  useEffect(
    () => {
      if (props.holder && props.holder.items.length > 0) {
        setActiveItem(props.holder.itemsSortedByOrder[0])
      } else {
        setActiveItem(undefined)
      }
    }, [props.holder, props.holder?.items]
  )

  useEffect(
    () => {
      props.onActiveChange(activeItem)
    }, [activeItem]
  )

  useEffect(
    () => {
      if (props.holder) {
        setActions([
          new Action("new", () => {
            if (activeContext) {
              props.holder!.insertAt(activeContext.order + 1)
            } else {
              props.holder!.insert()
            }
          }),
          ...activeContext ? [
            new Action("edit", () => {
              //maybe open a dialog window with overview of the item
            }),
            new Action("delete", () => {
              props.holder!.deleteItem(activeContext)
            })
          ] : []
        ])
      }
    }, [activeContext]
  )

  return (
    <ol id={props.id} ref={selfRef} className="snovy-list-selector" onContextMenu={() => setActiveContext(null)}>
      {props.holder?.itemsSortedByOrder.map((item: T) =>
        <SelectorListItem key={item.id} mapped={item} active={item == activeItem}
                          onClick={(item: T) => {setActiveItem(item)}}
                          onContext={(item: T) => {setActiveContext(item)}}
        />)
      }
      <ContextMenu parentRef={selfRef} actions={actions} resetContext={() => setActiveContext(undefined)}/>
    </ol>
  )

}

export default SelectorList