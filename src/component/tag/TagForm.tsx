import React, {forwardRef, useRef, useState} from "react"
import Scope from "../../model/coloured/Scope"
import {CheckButton, ColourButton, ConfirmButton} from "../inputs/Button"
import {useColoured, useHideOnOutsideClick} from "../../util/Hooks"
import {Input} from "../inputs/Input"
import ColourPicker from "../inputs/ColourPicker"

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

    const createTag = () => {
      if (tagText || scopeText) {
        props.onConfirm(tagText, tagColour, scopeText, scopeColour, exclusive)
      }
    }

    return (
      <form ref={ref} id="snovy-tag-create-form" className="snovy-form">
        <TagFormItem
          key="scope-item"
          defaultColour={scopeColour} getColour={setScopeColour} getText={setScopeText}
          scope={{exclusive, setExclusive}}
        />
        <TagFormItem key="tag-item" defaultColour={tagColour} getColour={setTagColour} getText={setTagText}/>
        <ConfirmButton onClick={() => createTag()}/>
      </form>
    )

  }
)

const TagFormItem = (props: {
  defaultColour: string,
  getColour: (colour: string) => void,
  getText: (text: string) => void,
  scope?: { exclusive: boolean, setExclusive: (set: boolean) => void }
}) => {

  const selfRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , flip] = useHideOnOutsideClick(selfRef, [pickerRef])

  const [colour, setColour] = useState(props.defaultColour)

  const getColour = (colour: string) => {
    getInputColour(colour)
    flip()
  }

  const getInputColour = (colour: string) => {
    setColour(colour)
    props.getColour(colour)
  }

  return (
    <span className="tag-form-item">
      <span className="coloured-wrapper">
        <ColourButton ref={selfRef} onMouseDown={flip} style={{backgroundColor: colour}}/>
        <Input placeholder="New scope name..." getText={props.getText}/>
        {props.scope &&
        <CheckButton toggle={props.scope.exclusive} onClick={() => props.scope!.setExclusive(!props.scope!.exclusive)}/>
        }
      </span>
      {visible &&
      <ColourPicker ref={pickerRef} getColour={getColour} getInputColour={getInputColour}/>
      }
    </span>
  )

}

export default TagForm