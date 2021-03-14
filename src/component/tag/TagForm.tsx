import React, {forwardRef, useEffect, useState} from "react"
import Scope from "../../data/model/Scope"
import {CheckButton, ConfirmButton} from "../inputs/Button"
import {useColored} from "../../util/Hooks"
import ColorPicker from "../inputs/ColorPicker"
import ComboBox from "../combo_box/ComboBox"
import Input from "../inputs/Input"
import FocusTrap from "focus-trap-react"

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

    //TODO move the (optional) show button here inside a fragment?
    return (
      <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}}>
        <form ref={ref} id="snovy-tag-create-form" className="snovy-form" tabIndex={-1}>
          <TagFormItem
            color={{value: scopeColor, get: setScopeColor}}
            check={{toggled: unique, toggle: setUnique, descriptor: "Exclusive"}}
          >
            <ComboBox
              onItemSelect={selectScope} items={props.scopes.map(it => it.toString())} selectedItem={scopeText}
              placeholder="Scope" tabIndex={0}
              newItem={{getInputValue: makeScope, name: "scope"}}
              options={{slideDropdown: true, unboundDropdown: true}}
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
            <Input placeholder="Tag" getText={setTagText} defaultValue={tagText}/>
          </TagFormItem>
          <ConfirmButton defaultValue="Add & tag" onClick={() => createTag()}/>
        </form>
      </FocusTrap>
    )

  }
)

const TagFormItem = (props: {
  color: { value: string, get: (color: string) => void }
  check?: { toggled: boolean | undefined, toggle: (setToggle: boolean) => void, descriptor?: string }
  disableColor?: boolean,
  children: React.ReactElement<typeof Input | typeof ComboBox>
}) => {

  return (
    <span className="tag-form-item">
      <ColorPicker
        getColor={props.color.get} getColorFromInput={color => props.color.get("#" + color)}
        selectedColor={props.color.value}
        colors={["#ff0000", "#ffa500", "#00ff00", "#40e0d0", "#0000ff", "#800080", "#ffffff", "#000000"]}
      />
      {props.children}
      {props.check &&
      <label>
        <CheckButton toggle={props.check.toggled} onClick={() => props.check!.toggle(!props.check!.toggled)}/>
        <div className="label-text">{props.check.descriptor}</div>
      </label>
      }
    </span>
  )

}

export default TagForm