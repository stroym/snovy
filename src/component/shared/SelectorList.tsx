import React, {useCallback, useEffect, useRef, useState} from "react";
import SelectorListItem from "./SelectorListItem";

import "react-contexify/dist/ReactContexify.css";
import {Base} from "../../model/Base";
import ContextMenu, {Action} from "./ContextMenu";

const selectedClass = "selected";

const SelectorList = <T extends Base>(props: {
  id: string,
  onActiveChange: (active: T | undefined) => any,
  onContextChange: (context: T, action: Action) => any,
  items: T[] | undefined
}) => {

  const selfRef = useRef<HTMLOListElement>(null);

  //currently selected HTML element
  const selected = useRef<Element>();

  const [activeItem, setActiveItem] = useState<T | undefined>();
  const [activeContext, setActiveContext] = useState<T | undefined>();

  //select first item when new items are received
  useEffect(
    () => {
      if (props.items && props.items.length > 0) {
        if (selfRef.current) {
          setActiveItem(props.items[0]);

          updateSelected(selfRef.current.children[0]);
        }
      } else {
        setActiveItem(undefined);
      }
    }, [props.items]
  );

  //return selected item to parent on change
  useEffect(
    () => {
      props.onActiveChange(activeItem);
    }, [activeItem]
  );

  //TODO maybe do this without state, if possible? array of child refs, maybe?
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
      setActiveItem(item);

      updateSelected(element);
    }, []
  );

  const itemContext = useCallback(
    (item: T, action: Action) => {
      setActiveContext(item);
      props.onContextChange(item, action);
    }, []
  );

  //TODO try to make context menu called only from here, not from item

  return (
    <ol id={props.id} ref={selfRef} className="snovy-list-selector">
      {props.items?.map((item: T) => <SelectorListItem key={item.id} mapped={item}
                                                       onClick={itemClick} onContext={itemContext}/>)}
      <ContextMenu parentRef={selfRef} target={undefined} contextChange={itemContext}/>
    </ol>
  );

};

export default SelectorList;