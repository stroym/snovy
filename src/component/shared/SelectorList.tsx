import React, {useCallback, useEffect, useRef, useState} from "react";
import SelectorListItem from "./SelectorListItem";

import "react-contexify/dist/ReactContexify.css";
import {HolderItem} from "../../model/Base";
import ContextMenu, {Action, ActionType} from "./ContextMenu";

const selectedClass = "selected";

//TODO pass holder instead of items, probably
const SelectorList = <T extends HolderItem<any>>(props: {
  id: string,
  onActiveChange: (active: T | undefined) => any,
  onContextChange: (action: Action) => any,
  items: T[]
}) => {

  const selfRef = useRef<HTMLOListElement>(null);

  //select first item when new items are received
  useEffect(
    () => {
      if (props.items.length > 0) {
        setActiveItem(props.items[0]);
        props.onActiveChange(props.items[0]);
      } else {
        props.onActiveChange(undefined);
      }
    }, [props.items]
  );

  const itemClick = useCallback(
    (item: T) => {
      setActiveItem(item);
      props.onActiveChange(item);
    }, []
  );

  const itemContext = useCallback(
    (item: T) => {
      setActiveContext(item);
    }, []
  );

  const [activeItem, setActiveItem] = useState<T>();
  const [activeContext, setActiveContext] = useState<T>();
  const [actions, setActions] = useState<Array<Action>>([]);

  useEffect(
    () => {
      if (activeContext) {
        setActions([
          new Action("new", ActionType.NEW, activeContext),
          new Action("rename", ActionType.EDIT, activeContext),
          new Action("delete", ActionType.DELETE, activeContext)
        ]);
      } else {
        setActions([]);
        // console.log("probably parent click, buddy");
      }

    }, [activeContext]
  );

  const onContextAction = useCallback(
    () => {
      setActiveContext(undefined);
    }, []
  );

  //TODO pass parent into list?
  // return last contexted item
  // return action

  return (
    <ol id={props.id} ref={selfRef} className="snovy-list-selector">
      {props.items.map((item: T) => <SelectorListItem key={item.id} mapped={item} active={item == activeItem}
                                                      onClick={itemClick} onContext={itemContext}/>)}
      <ContextMenu parentRef={selfRef} actions={actions} contextChange={props.onContextChange}
                   resetContext={onContextAction}/>
    </ol>
  );

};

export default SelectorList;