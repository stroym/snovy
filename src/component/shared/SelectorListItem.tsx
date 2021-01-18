import React, {useCallback, useEffect, useRef, useState} from "react";
import {Holder} from "../../model/Base";

const SelectorListItem = <T extends Holder<any, any>>(props: {
  mapped: T,
  active: boolean
  onClick: (item: T) => any,
  onContext: (item: T) => any
}) => {

  const selfRef = useRef<HTMLLIElement>(null);

  //TODO actually make editability work
  const [editable, setEditable] = useState<boolean>(false);

  const handleClick = useCallback(
    () => {
      props.onClick(props.mapped);
    }, []
  );

  const handleOutsideClick = useCallback(
    (event) => {
      if (!selfRef.current?.contains(event.target)) {
        setEditable(false);
      }
    }, []
  );

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick);

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []
  );

  const makeEditable = useCallback(
    () => {
      setEditable(true);
    }, []
  );

  const handleContext = () => {
    props.onContext(props.mapped);
  };

  //TODO use input if I manage to remove contextmenu from here
  return (
    <li className={props.active ? "snovy-list-item selected" : "snovy-list-item"} ref={selfRef}
        onClick={handleClick} onDoubleClick={makeEditable} onContextMenu={handleContext}
        suppressContentEditableWarning contentEditable={editable}>
      {props.mapped.name}
    </li>
  );

};

export default SelectorListItem;