import React, {forwardRef, useState} from "react"
import Scope from "../../model/coloured/Scope"
import {CheckButton, ColourButton, ConfirmButton} from "../Button"
import {useColoured} from "../../util/Hooks"

interface FormProps {
  initialValue?: string
  scope?: Scope,
  onConfirm: (tagText: string, tagColour: string, scopeText: string, scopeColour: string, scopeExclusive: boolean) => void
}

//TODO allow for creating with scope using ::/:
class Stringer {

  name: string
  scopeName?: string

  constructor(str: string) {
    const parts = str.split(":")
    this.name = parts.pop()!
    this.scopeName = parts.pop()
  }

}

const TagForm = forwardRef<HTMLFormElement, FormProps>(
  function TagSelector(props: FormProps, ref: React.Ref<HTMLFormElement>) {

    const [scopeText, scopeColour, setScopeText, setScopeColour] = useColoured()
    const [tagText, tagColour, setTagText, setTagColour] = useColoured()
    const [exclusive, setExclusive] = useState(false)

    //TODO wrap colour, input and checkbox in its own object to better manage where the colour picker spawns
    return (
      <form ref={ref} id="snovy-tag-create-form" className="snovy-form">
        <span className="coloured-wrapper">
          <ColourButton getColour={(str: string) => {setScopeColour(str)}} defaultColour={scopeColour}/>
          <input
            type="text" placeholder="New scope name..." autoComplete="false"
            onChange={(e) => setScopeText(e.target.value)}
          />
          <CheckButton toggle={exclusive} onClick={() => setExclusive(!exclusive)}/>
        </span>
        <span className="coloured-wrapper">
          <ColourButton getColour={(str: string) => {setTagColour(str)}} defaultColour={tagColour}/>
          <input
            type="text" placeholder="New tag Name..." defaultValue={props.initialValue} autoComplete="false"
            onChange={(e) => setTagText(e.target.value)}
          />
        </span>
        <ConfirmButton onClick={() => props.onConfirm(tagText, tagColour, scopeText, scopeColour, exclusive)}/>
      </form>
    )
  }
)

export default TagForm