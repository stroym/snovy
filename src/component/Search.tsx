import React from "react"
import Select from "react-select"

const options = [
  {value: "text", label: "Text"},
  {value: "title", label: "Title"},
  {value: "tags", label: "Tags"}
]

const values = [
  {value: "a", label: "a"},
  {value: "b", label: "b"},
  {value: "c", label: "c"}
]

export default class Search extends React.Component<{}, SearchState> {

  constructor(props: {}) {
    super(props)

    this.state = {
      filter: options[0]
    }

    this.handleOptions = this.handleOptions.bind(this)
  }

  //TODO another select for mode selection: some (or) + all (and) - mainly tags, contains/equals (text/title)
  // or a custom search solution, depends on how will this works with tags
  // search scopes (section, notebook, all notebooks)?
  // custom MenuList (show notebook, section, and matching things) unless this gets replaced by another solution
  // OR what's most likely to happen is moving this into a sidebar where the results can be displayed in a nicer fashion
  render() {
    return (
      <span id="snovy-search">
        <Select id="search" className="react-select-container" classNamePrefix="react-select"
                placeholder="Search by criteria..." options={values}
                isClearable isSearchable isMulti={this.state.filter === options[2]}
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null
                }}
        />
        <Select id="options" className="react-select-container" classNamePrefix="react-select"
                placeholder="Select search criteria..." options={options} defaultValue={options[0]}
                onChange={this.handleOptions}
        />
      </span>
    )
  }

  handleOptions(value: any): void {
    this.setState({
      filter: value
    })
    console.log(value)
  }

}

type SearchState = {
  filter: { value: string, label: string }
}