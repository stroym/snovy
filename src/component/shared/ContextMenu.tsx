import React from "react";

export default class ContextMenu extends React.Component<ContextProps, ContextState> {

  constructor(props: ContextProps) {
    super(props);

    this.state = {
      visible: false,
      x: 0,
      y: 0
    };
  }

  render() {
    return (
      <div className="snovy-context-menu">
        {
          this.props.actions.map((a, i: number) =>
            <div key={i++} onClick={a.action}>{a.text}</div>
          )
        }
      </div>
    );
  }

}

type ContextProps = {
  actions: { text: string, action: any }[]
}

type ContextState = {
  visible: boolean,
  x: number,
  y: number
}