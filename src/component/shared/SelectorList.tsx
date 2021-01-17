import React, {useCallback, useEffect, useRef} from "react";
import SelectorListItem from "./SelectorListItem";

import "react-contexify/dist/ReactContexify.css";
import {HolderItem} from "../../model/Base";
import ContextMenu, {Action, ActionType} from "./ContextMenu";

const selectedClass = "selected";

const SelectorList = <T extends HolderItem<any>>(props: {
  id: string,
  onActiveChange: (active: T | undefined) => any,
  onContextChange: (action: Action) => any,
  items: T[] | undefined
}) => {

  const selfRef = useRef<HTMLOListElement>(null);

  //currently selected HTML element
  const selected = useRef<Element>();

  //select first item when new items are received
  useEffect(
    () => {
      if (props.items && props.items.length > 0) {
        if (selfRef.current) {
          props.onActiveChange(props.items[0]);

          updateSelected(selfRef.current.children[0]);
        }
      } else {
        props.onActiveChange(undefined);
      }
    }, [props.items]
  );

  //add/remove css class to/from selected element
  const updateSelected = useCallback(
    (newSelection: Element) => {
      if (selected.current) {
        selected.current.classList.remove(selectedClass);
      }

      selected.current = newSelection;
      selected.current.classList.add(selectedClass);
    }, []
  );

  const itemClick = useCallback(
    (item: T, element: Element) => {
      props.onActiveChange(item);

      updateSelected(element);
    }, []
  );

  const itemContext = useCallback(
    (action: Action) => {
      props.onContextChange(action);
    }, []
  );

  //TODO how to handle this?
  const actions = [
    new Action("new", ActionType.NEW, props.items)
  ];

  return (
    <ol id={props.id} ref={selfRef} className="snovy-list-selector">
      {props.items?.map((item: T) => <SelectorListItem key={item.id} mapped={item}
                                                       onClick={itemClick} onContext={itemContext}/>)}
      <ContextMenu parentRef={selfRef} actions={actions} contextChange={itemContext}/>
    </ol>
  );

};

export default SelectorList;