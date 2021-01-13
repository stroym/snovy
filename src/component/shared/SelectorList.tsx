import React, {useCallback, useEffect, useRef, useState} from "react";
import SelectorListItem from "./SelectorListItem";

import "react-contexify/dist/ReactContexify.css";
import {Base} from "../../model/Base";

const activeItemClass = "selected";

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

  const updateSelected = useCallback(
    (newSelection: Element) => {
      if (selected.current) {
        selected.current.classList.remove(activeItemClass);
      }

      selected.current = newSelection;
      selected.current.classList.add(activeItemClass);
    }, []
  );

  //update selected child when child is clicked
  const itemClick = useCallback(
    (item: T, li: HTMLLIElement) => {
      setActiveItem(item);

      updateSelected(li);
    }, []
  );

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

  return (
    <ol id={props.id} ref={selfRef} className="snovy-list-selector">
      {props.items?.map((item: T) => <SelectorListItem key={item.id} clicked={itemClick} mapped={item}/>)}
    </ol>
  );

};

export default SelectorList;