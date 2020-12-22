import React from "react";
import Select from "react-select";

export const menuStyle = {
  menu: (provided: any, state: any) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    height: "100%"
  }),
  menuList: (provided: any, state: any) => ({
    border: "1px solid black"
  })
};

export default class Search extends React.Component {

  //TODO radio group to specify search scope
  render() {
    return (
      <span id="snovy-search">
        <Select id="search" className="react-select" placeholder="Search by text or tags..." isSearchable
                styles={menuStyle}/>
      </span>
    );
  }

}