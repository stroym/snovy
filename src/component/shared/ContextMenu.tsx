import React, {useCallback, useEffect, useRef, useState} from "react";

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  actions: Array<Action>
}) => {

  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const selfRef = useRef<HTMLOListElement>(null);

  const handleOutsideClick = useCallback(
    (event) => {
      if (!selfRef.current?.contains(event.target)) {
        setVisible(false);
      }
    }, []
  );

  const handleItemClick = useCallback(
    () => {
      setVisible(false);
    }, []
  );

  const handleContextMenu = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();

      setX(event.pageX);
      setY(event.pageY);

      setVisible(true);
    },
    []
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    props.parentRef.current?.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      props.parentRef.current?.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return (
    <ol className="snovy-context-menu" hidden={!visible} ref={selfRef}
        style={{
          position: "absolute",
          top: y + "px",
          left: x + "px"
        }}>
      {props.actions.map((a, i: number) => <ContextMenuItem key={i} action={a} afterAction={handleItemClick}/>)}
    </ol>
  );

};

export const ContextMenuItem = (props: {
  action: Action,
  afterAction: () => any
}) => {

  const handleClick = useCallback(
    () => {
      props.action.execute();
      props.afterAction();
    }, []
  );

  return (
    <li onClick={handleClick}>{props.action.text}</li>
  );

};

export class Action {
  text: string;
  execute: (...params: any) => any

  constructor(text: string, action: (...params: any) => any) {
    this.text = text;
    this.execute = action;
  }

}

export default ContextMenu;