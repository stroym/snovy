import React, {useCallback, useEffect, useRef, useState} from "react";
import SelectorListItem from "./SelectorListItem";

import "react-contexify/dist/ReactContexify.css";
import {Base} from "../../model/Base";

const selectedClass = "selected";

const SelectorList = <T extends Base>(props: {
  id: string,
  onActiveChange: (active: T | undefined) => any,
  items: T[] | undefined
}) => {

  const selfRef = useRef<HTMLOListElement>(null);

  //currently selected HTML element
  const selected = useRef<Element>();

  //item corresponding to the currently selected HTML element
  const [activeItem, setActiveItem] = useState<T | undefined>();

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

  const showContextMenu = useCallback(
    (event: React.MouseEvent, item?: T) => {
      event.preventDefault();

      if (item) {
        console.log("clicked on item");
      } else {
        console.log("parent right click");
      }

    }, []
  );

  return (
    <ol id={props.id} ref={selfRef} className="snovy-list-selector" onContextMenu={showContextMenu}>
      {props.items?.map((item: T) => <SelectorListItem key={item.id} mapped={item} onClick={itemClick}
                                                       onRightClick={showContextMenu}/>)}
    </ol>
  );

};

export default SelectorList;