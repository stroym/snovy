import React, {useCallback, useEffect, useRef, useState} from "react";

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  target: any,
  contextChange: (item: any, action: Action) => any
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
    (action: Action) => {
      props.contextChange(props.target, action);

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

  const actions = [
    new Action("new", ActionType.NEW),
    ...props.target ? [
      new Action("rename", ActionType.EDIT),
      new Action("delete", ActionType.DELETE)
    ] : []
  ];

  return (
    <ol className="snovy-context-menu" hidden={!visible} ref={selfRef}
        style={{
          position: "absolute",
          top: y + "px",
          left: x + "px"
        }}>
      {actions.map((a: Action, i: number) => <ContextMenuItem key={i} action={a} execute={handleItemClick}/>)}
    </ol>
  );

};

export const ContextMenuItem = (props: {
  action: Action,
  execute: (action: Action) => any
}) => {

  const handleClick = useCallback(
    () => {
      props.execute(props.action);
    }, []
  );

  return (
    <li onClick={handleClick}>{props.action.text}</li>
  );

};

export class Action {

  text: string;
  type: ActionType

  constructor(text: string, type: ActionType) {
    this.text = text;
    this.type = type;
  }

}

export enum ActionType {
  NEW,
  EDIT,
  DELETE
}

export default ContextMenu;