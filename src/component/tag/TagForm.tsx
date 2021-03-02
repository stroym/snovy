import React, {forwardRef, useEffect, useRef, useState} from "react"
import Scope from "../../data/model/Scope"
import {CheckButton, ColorButton, ConfirmButton} from "../inputs/Button"
import {useColored, useHideOnOutsideClick} from "../../util/Hooks"
import {Input} from "../inputs/Input"
import ColorPicker from "../inputs/ColorPicker"
import ComboBox from "../combo_box/ComboBox"
import Notebook from "../../data/model/Notebook"

class Helper {

  tagName?: string
  scopeName?: string

  constructor(str: string | undefined) {
    if (str) {
      if (str.includes(":")) {
        const parts = str.split(":").filter(it => !it.isBlank())
        console.log(parts)
        this.tagName = parts.pop()!
        this.scopeName = parts.pop()!
      } else {
        this.tagName = str
      }
    }
  }

}

interface FormProps {
  initialValue?: string
  notebook: Notebook
  scopes: Array<Scope>
  onConfirm: (tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeExclusive: boolean) => void
  // onConfirm: (tag: Tag, scope?: Scope) => void
}

const TagForm = forwardRef<HTMLFormElement, FormProps>(
  function TagForm(props: FormProps, ref: React.Ref<HTMLFormElement>) {

    const [scopeText, scopeColor, setScopeText, setScopeColor] = useColored()
    const [tagText, tagColor, setTagText, setTagColor] = useColored()
    const [unique, setExclusive] = useState(false)
    const [useScope, setUseScope] = useState(true)

    const [split, setSplit] = useState<Helper>()

    useEffect(
      () => {
        setSplit(new Helper(props.initialValue))
      }, [props.initialValue]
    )

    const createTag = () => {
      if (tagText) {
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
        <ScopeCreator
          placeholder="Scope name..." getText={setScopeText} scopes={props.scopes} initialValue={split?.scopeName}
          color={{value: scopeColor, get: useScope ? setBoth : setScopeColor}}
          check={{toggled: unique, toggle: setExclusive}} notebook={props.notebook}
        />
        <TagCreator
          placeholder="Tag name..." getText={setTagText} initialValue={split?.tagName}
          color={{value: tagColor, get: useScope ? setBoth : setTagColor}}
          check={{toggled: useScope, toggle: onBoth}}
        />
        <ConfirmButton onClick={() => createTag()}/>
      </form>
    )

  }
)

const ScopeCreator = (props: {
  placeholder?: string,
  initialValue?: string,
  notebook: Notebook,
  getText: (text: string) => void,
  scopes: Array<Scope>,
  color: { value: string, get: (color: string) => void }
  check?: { toggled: boolean, toggle: (setToggle: boolean) => void }
}) => {

  const selfRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , flip] = useHideOnOutsideClick(selfRef, [pickerRef])

  const [colorInt, setColorInt] = useState(props.color.value)

  const [scopes, setScopes] = useState<Array<Scope>>(props.scopes)
  const [scope, setScope] = useState<Scope | undefined>(undefined)

  useEffect(
    () => {
      setColorInt(props.color.value)
    }, [props.color]
  )

  useEffect(
    () => {
      if (props.initialValue) {
        const existing = props.scopes.find(it => it.title == props.initialValue)

        if (existing) {
          setScope(existing)
        } else {
          setScope(new Scope(props.notebook.id, props.initialValue, colorInt))
        }
      }
    }, [props.initialValue]
  )

  const getColor = (color: string) => {
    getInputColor(color)
    flip()
  }

  const getInputColor = (color: string) => {
    setColorInt(color)
    props.color.get(color)
  }

  //TODO sort scopes
  const makeScope = (title: string) => {
    const newScope = new Scope(props.notebook.id, title, colorInt)
    scopes.push(newScope)
    setScope(newScope)
  }

  return (
    <span className="tag-form-item">
      <span className="colored-wrapper">
        <ColorButton ref={selfRef} onMouseDown={flip} style={{backgroundColor: colorInt}}/>
        <ComboBox
          onSelect={setScope} items={scopes} placeholder={props.placeholder} selection={scope}
          newItem={{getInputValue: makeScope, name: "scope"}} initialValue={props.initialValue}
        />
        {props.check &&
        <label>
          Exclusive
          <CheckButton toggle={props.check.toggled} onClick={() => props.check!.toggle(!props.check!.toggled)}/>
        </label>
        }
      </span>
      {visible && <ColorPicker ref={pickerRef} getColor={getColor} getInputColor={getInputColor}/>}
    </span>
  )

}

const TagCreator = (props: {
  placeholder?: string,
  initialValue?: string,
  getText: (text: string) => void,
  color: { value: string, get: (color: string) => void }
  check?: { toggled: boolean, toggle: (setToggle: boolean) => void }
}) => {

  const selfRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , flip] = useHideOnOutsideClick(selfRef, [pickerRef])

  const [colorInt, setColorInt] = useState(props.color.value)

  useEffect(
    () => {
      setColorInt(props.color.value)
    }, [props.color]
  )

  const getColor = (color: string) => {
    getInputColor(color)
    flip()
  }

  const getInputColor = (color: string) => {
    setColorInt(color)
    props.color.get(color)
  }

  return (
    <span className="tag-form-item">
      <span className="colored-wrapper">
        <ColorButton ref={selfRef} onMouseDown={flip} style={{backgroundColor: colorInt}}/>
        <Input placeholder={props.placeholder} getText={props.getText} defaultValue={props.initialValue} autoFocus/>
        {props.check &&
        <label>
          Unify
          <CheckButton
            id="check" toggle={props.check.toggled} onClick={() => props.check!.toggle(!props.check!.toggled)}
          />
        </label>
        }
      </span>
      {visible && <ColorPicker ref={pickerRef} getColor={getColor} getInputColor={getInputColor}/>}
    </span>
  )

}

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