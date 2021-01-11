import React, {useCallback, useEffect, useRef, useState} from "react";
import SelectorListItem from "./SelectorListItem";

import "react-contexify/dist/ReactContexify.css";
import {Base} from "../../model/Base";

interface ListProps<T extends Base> extends React.HTMLProps<HTMLOListElement> {
  selectActive: (active: T | undefined) => any,
  items: T[]
}

const SelectorList = <T extends Base>(props: ListProps<T>) => {

  // const [activeElement, setActiveElement] = useState<HTMLLIElement | undefined>();
  const [activeItem, setActiveItem] = useState<T | undefined>();

  const selected = useRef<HTMLLIElement | undefined>(undefined);

  const itemClick = useCallback(
    (item: T, li: HTMLLIElement) => {
      setActiveItem(item);
      props.selectActive(item);

      if (selected.current) {
        selected.current.classList.remove("selected");
      }

      selected.current = li;

      selected.current.classList.add("selected");
    },
    []
  );

  // const handleActive = (event: React.MouseEvent) => {
  //   if (event.target instanceof HTMLLIElement) {
  //
  //     if (selected.current) {
  //       selected.current.classList.remove("selected");
  //     }
  //
  //     selected.current = event.target;
  //
  //     selected.current.classList.add("selected");
  //
  //     console.log(event.target);
  //
  //     // setActiveElement(event.target);
  //
  //     //TODO try to get to the mapped item
  //   }
  // };

  //TODO yeah, this is not ideal...
  useEffect(
    () => {
      if (selected.current) {
        selected.current.classList.remove("selected");
      }

      if (props.items.length > 0) {
        setActiveItem(props.items[0]);

        selected.current = selfRef.current!.firstChild as HTMLLIElement;
        selected.current.classList.add("selected");
      }
    }, [props.items]
  );

  const selfRef = useRef<HTMLOListElement>(null);

  return (
    <ol id={props.id} ref={selfRef} className="snovy-list-selector">
      {props.items.map((item: T) => <SelectorListItem key={item.id} clicked={itemClick} mapped={item}/>)}
    </ol>
  );

};

export default SelectorList;