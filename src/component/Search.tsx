import React from "react";
import Select from "react-select";

const options = [
  {value: "text", label: "Text"},
  {value: "title", label: "Title"},
  {value: "tags", label: "Tags"},
  {value: "query", label: "Query"}
];

export default class Search extends React.Component {

  constructor(props: {}) {
    super(props);
    this.handleOptions = this.handleOptions.bind(this);
  }

  //TODO another select contains/equals etc?
  //TODO either move tag searching into right sidebar or modify search select on tags options select
  render() {
    return (
      <span id="snovy-search">
        <Select id="search" className="react-select-container" classNamePrefix="react-select"
                placeholder="Search by criteria..."
                isClearable isSearchable
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                  Menu: () => null
                }}
        />
        <Select id="options" className="react-select-container" classNamePrefix="react-select"
                placeholder="Select search criteria..."
                options={options} defaultValue={options[0]}
        />
      </span>
    );
  }

  handleOptions() {

  }

}