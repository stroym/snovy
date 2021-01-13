import React, {useCallback, useRef} from "react";
import {Base} from "../../model/Base";

const SelectorListItem = <T extends Base>(props: {
  mapped: T,
  onClick: (item: T, element: HTMLLIElement) => any,
  onRightClick: (event: React.MouseEvent, item: T) => any
}) => {

  const selfRef = useRef<HTMLLIElement>(null);

  const handleClick = useCallback(
    () => {
      props.onClick(props.mapped, selfRef.current!);
    }, []
  );

  const handleRightClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      props.onRightClick(event, props.mapped);
    }, []
  );

  return (
    <li className={"snovy-list-item"} ref={selfRef} onClick={handleClick}
        onContextMenu={handleRightClick}>
      {props.mapped.name}
    </li>
  );

};

export default SelectorListItem;