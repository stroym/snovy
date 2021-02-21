import React, {forwardRef, useEffect, useRef, useState} from "react"
import Scope from "../../data/model/colored/Scope"
import {CheckButton, ColorButton, ConfirmButton} from "../inputs/Button"
import {useColored, useHideOnOutsideClick} from "../../util/Hooks"
import {Input} from "../inputs/Input"
import ColorPicker from "../inputs/ColorPicker"

interface FormProps {
  initialValue?: string
  scope?: Scope,
  onConfirm: (tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeExclusive: boolean) => void
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

    const [scopeText, scopeColor, setScopeText, setScopeColor] = useColored()
    const [tagText, tagColor, setTagText, setTagColor] = useColored()
    const [unique, setExclusive] = useState(false)
    const [useScope, setUseScope] = useState(true)

    const createTag = () => {
      if (tagText || scopeText) {
        props.onConfirm(tagText, tagColor, scopeText, scopeColor, unique)
      }
    }

    const setBoth = (color: string) => {
      setScopeColor(color)
      setTagColor(color)
    }

    const onBoth = (toggle: boolean) => {
      setUseScope(toggle)
      toggle && setTagColor(scopeColor)
    }

    return (
      <form ref={ref} id="snovy-tag-create-form" className="snovy-form">
        <TagFormItem
          placeholder="Scope name..." color={scopeColor} getColor={useScope ? setBoth : setScopeColor}
          getText={setScopeText} useCheck={{toggled: unique, toggle: setExclusive}}
        />
        <TagFormItem
          placeholder="Tag name..." color={tagColor} getColor={useScope ? setBoth : setTagColor}
          getText={setTagText} disableColor={unique} useCheck={{toggled: useScope, toggle: onBoth}}
        />
        <ConfirmButton onClick={() => createTag()}/>
      </form>
    )

  }
)

const TagFormItem = (props: {
  color: string,
  placeholder?: string,
  getColor: (color: string) => void,
  getText: (text: string) => void,
  useCheck?: { toggled: boolean, toggle: (setExclusive: boolean) => void }
  disableColor?: boolean
}) => {

  const selfRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , flip] = useHideOnOutsideClick(selfRef, [pickerRef])

  const [colorInt, setColorInt] = useState(props.color)

  useEffect(
    () => {
      setColorInt(props.color)
    }, [props.color]
  )

  const getColor = (color: string) => {
    getInputColor(color)
    flip()
  }

  const getInputColor = (color: string) => {
    setColorInt(color)
    props.getColor(color)
  }

  return (
    <span className="tag-form-item">
      <span className="colored-wrapper">
        <ColorButton
          ref={selfRef} onMouseDown={flip} style={{backgroundColor: colorInt}} disabled={props.disableColor}
        />
        <Input placeholder={props.placeholder} getText={props.getText}/>
        {props.useCheck &&
        <CheckButton toggle={props.useCheck.toggled} onClick={() => props.useCheck!.toggle(!props.useCheck!.toggled)}/>
        }
      </span>
      {visible &&
      <ColorPicker ref={pickerRef} getColor={getColor} getInputColor={getInputColor}/>
      }
    </span>
  )

}

export default TagForm