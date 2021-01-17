import React, {useCallback, useEffect, useRef, useState} from "react";
import {HolderItem} from "../../model/Base";
import ContextMenu, {Action, ActionType} from "./ContextMenu";

const SelectorListItem = <T extends HolderItem<any>>(props: {
  mapped: T,
  onClick: (item: T, element: HTMLLIElement) => any,
  onContext: (action: Action) => any
}) => {

  const selfRef = useRef<HTMLLIElement>(null);

  //TODO actually make editability work
  const [editable, setEditable] = useState<boolean>(false);

  const handleClick = useCallback(
    () => {
      props.onClick(props.mapped, selfRef.current!);
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

  const actions = [
    new Action("new", ActionType.NEW, props.mapped),
    new Action("rename", ActionType.EDIT, props.mapped),
    new Action("delete", ActionType.DELETE, props.mapped)
  ];

  //TODO use input if I manage to remove contextmenu from here
  return (
    <li className={"snovy-list-item"} ref={selfRef} onClick={handleClick} onDoubleClick={makeEditable}
        suppressContentEditableWarning contentEditable={editable}>
      {props.mapped.name}
      <ContextMenu parentRef={selfRef} actions={actions} contextChange={props.onContext}/>
    </li>
  );

};

export default SelectorListItem;