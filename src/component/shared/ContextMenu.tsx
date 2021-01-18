import React, {useCallback, useEffect, useRef, useState} from "react";
import {HolderItem} from "../../model/Base";

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  actions: Array<Action>,
  contextChange: (action: Action) => any,
  resetContext: () => any
}) => {

  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const selfRef = useRef<HTMLOListElement>(null);

  const handleOutsideClick = useCallback(
    (event) => {
      if (!selfRef.current?.contains(event.target)) {

        setVisible(false);
        props.resetContext();
      }
    }, []
  );

  const handleItemClick = useCallback(
    (action: Action) => {
      props.contextChange(action);

      setVisible(false);
      props.resetContext();
    }, []
  );

  const handleContextMenu = useCallback(
    (event: any) => {
      event.preventDefault();
      // event.stopPropagation();

      setX(event.pageX);
      setY(event.pageY);

      setVisible(true);
    },
    []
  );

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick);
      props.parentRef.current?.addEventListener("contextmenu", handleContextMenu);

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        props.parentRef.current?.removeEventListener("contextmenu", handleContextMenu);
      };
    }, []
  );

  return (
    <ol className="snovy-context-menu" hidden={!visible} ref={selfRef}
        style={{
          position: "absolute",
          top: y + "px",
          left: x + "px"
        }}>
      {props.actions.map((a: Action, i: number) => <ContextMenuItem key={i} action={a} execute={handleItemClick}/>)}
    </ol>
  );

};

export const ContextMenuItem = (props: {
  action: Action,
  execute: (action: Action) => any
}) => {

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      // props.action.handle();
      props.execute(props.action);
    }, []
  );

  return (
    <li onClick={handleClick}>{props.action.text}</li>
  );

};

export class Action {

  text: string;
  type: ActionType;
  target: HolderItem<any>;

  constructor(text: string, type: ActionType, target: any) {
    this.text = text;
    this.type = type;
    this.target = target;
  }

  handle() {
    console.log(this.target);
    if (this.target) {
      switch (this.type) {
        case ActionType.NEW:
          //action.target.order + 1 find a away to pass order from target
          this.target.parent.addNewItem(this.target.order + 1);
          break;
        case ActionType.EDIT:
          this.target.rename("blob");
          break;
        case ActionType.DELETE:
          this.target.parent.deleteItem(this.target);
          break;
        default:
      }
    }
  }

}

export enum ActionType {
  NEW,
  EDIT,
  DELETE
}

export default ContextMenu;