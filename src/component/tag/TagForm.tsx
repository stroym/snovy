import React, {forwardRef, useEffect, useRef, useState} from "react"
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
    const [useScope, setUseScope] = useState(true)

    const createTag = () => {
      if (tagText || scopeText) {
        props.onConfirm(tagText, tagColour, scopeText, scopeColour, exclusive)
      }
    }

    const setBoth = (colour: string) => {
      setScopeColour(colour)
      setTagColour(colour)
    }

    const onBoth = (toggle: boolean) => {
      setUseScope(toggle)
      toggle && setTagColour(scopeColour)
    }

    return (
      <form ref={ref} id="snovy-tag-create-form" className="snovy-form">
        <TagFormItem
          placeholder="Scope name..." colour={scopeColour} getColour={useScope ? setBoth : setScopeColour}
          getText={setScopeText} useCheck={{toggled: exclusive, toggle: setExclusive}}
        />
        <TagFormItem
          placeholder="Tag name..." colour={tagColour} getColour={useScope ? setBoth : setTagColour}
          getText={setTagText} disableColour={exclusive} useCheck={{toggled: useScope, toggle: onBoth}}
        />
        <ConfirmButton onClick={() => createTag()}/>
      </form>
    )

  }
)

const TagFormItem = (props: {
  colour: string,
  placeholder?: string,
  getColour: (colour: string) => void,
  getText: (text: string) => void,
  useCheck?: { toggled: boolean, toggle: (setExclusive: boolean) => void }
  disableColour?: boolean
}) => {

  const selfRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , flip] = useHideOnOutsideClick(selfRef, [pickerRef])

  const [colourInt, setColourInt] = useState(props.colour)

  useEffect(
    () => {
      setColourInt(props.colour)
    }, [props.colour]
  )

  const getColour = (colour: string) => {
    getInputColour(colour)
    flip()
  }

  const getInputColour = (colour: string) => {
    setColourInt(colour)
    props.getColour(colour)
  }

  return (
    <span className="tag-form-item">
      <span className="coloured-wrapper">
        <ColourButton
          ref={selfRef} onMouseDown={flip} style={{backgroundColor: colourInt}} disabled={props.disableColour}
        />
        <Input placeholder={props.placeholder} getText={props.getText}/>
        {props.useCheck &&
        <CheckButton toggle={props.useCheck.toggled} onClick={() => props.useCheck!.toggle(!props.useCheck!.toggled)}/>
        }
      </span>
      {visible &&
      <ColourPicker ref={pickerRef} getColour={getColour} getInputColour={getInputColour}/>
      }
    </span>
  )

}

export default TagForm