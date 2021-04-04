import React from "react"
import Notebook from "../../../data/model/Notebook"

const Manager = (props: {
  notebook: Notebook | undefined
}) => {

  //todo top tab menu, manage tags, scopes, states...

  return (
    <div id="snovy-tag-manager">
      {/*<List<Tag> items={props.notebook?.tags}*/}
      {/*/>*/}
    </div>
  )

}

export default Manager