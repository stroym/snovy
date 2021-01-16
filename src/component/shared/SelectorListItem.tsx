import React, {useCallback, useRef, useState} from "react";
import {Base} from "../../model/Base";
import ContextMenu, {Action} from "./ContextMenu";

const SelectorListItem = <T extends Base>(props: {
  mapped: T,
  onClick: (item: T, element: HTMLLIElement) => any
}) => {

  const selfRef = useRef<HTMLLIElement>(null);

  const handleClick = useCallback(
    () => {
      props.onClick(props.mapped, selfRef.current!);
    }, []
  );

  const [actions, setActions] = useState<[{ text: string, action: () => any }]>([
    new Action("item", () => "")
  ]);

  return (
    <li className={"snovy-list-item"} ref={selfRef} onClick={handleClick}>
      {props.mapped.name}
      <ContextMenu actions={actions} parentRef={selfRef}/>
    </li>
  );

};

export default SelectorListItem;