import React, {forwardRef, useEffect, useRef, useState} from "react"
import Scope from "../../data/model/Scope"
import {CheckButton, ColorButton, ConfirmButton} from "../inputs/Button"
import {useColored, useHideOnOutsideClick} from "../../util/Hooks"
import {Input} from "../inputs/Input"
import ColorPicker from "../inputs/ColorPicker"
import ComboBox from "../combo_box/ComboBox"

interface FormProps {
  initialValue?: string
  scopes: Array<Scope>
  onConfirm: (tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeExclusive: boolean) => void
}

const TagForm = forwardRef<HTMLFormElement, FormProps>(
  function TagForm(props: FormProps, ref: React.Ref<HTMLFormElement>) {

    const [scopeText, scopeColor, setScopeText, setScopeColor] = useColored()
    const [tagText, tagColor, setTagText, setTagColor] = useColored()

    const [unique, setUnique] = useState(false)
    const [useScope, setUseScope] = useState(true)

    useEffect(
      () => {
        if (props.initialValue) {
          let tagName: string

          if (props.initialValue.includes(":")) {
            const parts = props.initialValue.split(":").filter(it => !it.isBlank())
            tagName = parts.pop()!
            const scopeName = parts.pop()!

            const existing = props.scopes.find(it => it.title == scopeName)

            if (existing) {
              setScopeText(existing.title)
              setScopeColor(existing.color)
              setUnique(existing.unique)
            } else {
              setScopeText(scopeName)
              setUnique(props.initialValue.includes("::"))
            }
          } else {
            tagName = props.initialValue
          }

          setTagText(tagName)
        }
      }, [props.initialValue]
    )

    useEffect(
      () => {
        if (useScope) {
          setScopeColor(scopeColor)
          setTagColor(scopeColor)
        }
      }, [scopeColor]
    )

    const makeScope = (title: string) => {
      selectScope(title)
    }

    const selectScope = (str: string | undefined) => {
      const sc = props.scopes.find(it => it.title == str)

      if (sc) {
        setScopeText(sc.title)
        setScopeColor(sc.color)
        setUnique(sc.unique)
      } else {
        setScopeText(str)
        setScopeColor(undefined)
        setUnique(false)
      }
    }

    const createTag = () => {
      if (tagText) {
        props.onConfirm(tagText, tagColor, scopeText ?? "", scopeColor, unique)
      }
    }

    return (
      <form ref={ref} id="snovy-tag-create-form" className="snovy-form">
        <TagFormItem
          color={{value: scopeColor, get: setScopeColor}}
          check={{toggled: unique, toggle: setUnique, descriptor: "Exclusive"}}
        >
          <ComboBox<string>
            onSelect={selectScope} items={props.scopes.map(it => it.toString())} selection={scopeText}
            placeholder="Scope name..."
            newItem={{getInputValue: makeScope, name: "scope"}}
          />
        </TagFormItem>
        <TagFormItem
          color={{value: tagColor, get: setTagColor}}
          check={{
            toggled: useScope, toggle: toggle => {
              setUseScope(toggle)
              if (toggle) {
                setTagColor(scopeColor)
              }
            }, descriptor: "Unify"
          }}
        >
          <Input placeholder="Tag name..." getText={setTagText} defaultValue={tagText} autoFocus/>
        </TagFormItem>
        <ConfirmButton onClick={() => createTag()}/>
      </form>
    )

  }
)

const TagFormItem = (props: {
  color: { value: string, get: (color: string) => void }
  check?: { toggled: boolean | undefined, toggle: (setToggle: boolean) => void, descriptor?: string }
  disableColor?: boolean,
  children: React.ReactElement<typeof Input | typeof ComboBox>
}) => {

  const selfRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , flip] = useHideOnOutsideClick(selfRef, [pickerRef])

  const getColor = (color: string) => {
    props.color.get(color)
    flip()
  }

  return (
    <span className="tag-form-item">
      <span className="colored-wrapper">
        <ColorButton
          ref={selfRef} onMouseDown={flip} style={{backgroundColor: props.color.value}} disabled={props.disableColor}
        />
        {props.children}
        {props.check &&
        <label>
          {props.check.descriptor}
          <CheckButton toggle={props.check.toggled} onClick={() => props.check!.toggle(!props.check!.toggled)}/>
        </label>
        }
      </span>
      {visible &&
      <ColorPicker ref={pickerRef} getColor={getColor}/>
      }
    </span>
  )

}

export default TagForm