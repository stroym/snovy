import React, {useCallback, useRef, useState} from "react";
import {Base} from "../../model/Base";
import ContextMenu, {Action} from "./ContextMenu";

const SelectorListItem = <T extends Base>(props: {
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

  return (
    <li className={"snovy-list-item"} ref={selfRef} onClick={handleClick} contentEditable={editable}
        onDoubleClick={() => {
          setEditable(true);
        }}>
      {props.mapped.name}
      <ContextMenu parentRef={selfRef} target={props.mapped} contextChange={props.onContext}/>
    </li>
  );

};

export default SelectorListItem;