import React, {useCallback, useRef} from "react";
import {Base} from "../../model/Base";

// class SelectorListItem<T extends Base> extends React.Component<ListItemProps<T>> {
//
//   constructor(props: ListItemProps<T>) {
//     super(props);
//
//     this.handleClick = this.handleClick.bind(this);
//   }
//
//   handleClick() {
//     this.props.clicked(this.props.mapped);
//   }
//
//   render() {
//     return (
//       <li className={"snovy-list-item"} onClick={this.handleClick}>{this.props.mapped.name}</li>
//     );
//   }
// }

const SelectorListItem = <T extends Base>(props: {
  mapped: T,
  clicked: (clicked: T, li: HTMLLIElement) => any
}) => {

  const selfRef = useRef<HTMLLIElement>(null);

  const handleClick = useCallback(
    () => {
      props.clicked(props.mapped, selfRef.current!);
    },
    []
  );

  return (
    <li className={"snovy-list-item"} ref={selfRef} onClick={handleClick}>{props.mapped.name}</li>
  );
};

export default SelectorListItem;