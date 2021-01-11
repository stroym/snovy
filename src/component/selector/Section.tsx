import React from "react";
import {Item, Menu, Separator, Submenu, useContextMenu} from "react-contexify";
import Section from "../../model/Section";

import "react-contexify/dist/ReactContexify.css";

const {show} = useContextMenu({
  id: "blobbb"
});

export default class SectionSelector extends React.Component<SectionProps> {

  constructor(props: SectionProps) {
    super(props);

    this.show = this.show.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  show() {
    useContextMenu({
      id: "blobbb"
    });
  }

  handleItemClick(event: any) {
    console.log(event);
  }

  render() {
    return (
      <div id="snovy-selector-section" className="snovy-list-selector" onContextMenu={show}>
        {this.props.sections.map(function (s: Section) {
          return (<li key={s.id}>{s.name}</li>);
        })}
        <Menu id="blobbb" animation={false}>
          <Item onClick={this.handleItemClick}>
            Item 1
          </Item>
          <Item onClick={this.handleItemClick}>
            Item 2
          </Item>
          <Separator/>
          <Item disabled>Disabled</Item>
          <Separator/>
          <Submenu label="Submenu">
            <Item onClick={this.handleItemClick}>
              Sub Item 1
            </Item>
            <Item onClick={this.handleItemClick}>Sub Item 2</Item>
          </Submenu>
        </Menu>
      </div>
    );
  }

}

type SectionProps = {
  selected: Section
  sections: Section[]
}