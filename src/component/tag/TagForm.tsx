import React, {forwardRef, useEffect, useState} from "react"
import Scope from "../../data/model/Scope"
import {Button, ToggleButton} from "../inputs/Button"
import ColorPicker from "../inputs/ColorPicker"
import ComboBox from "../combo_box/ComboBox"
import Input from "../inputs/Input"
import FocusTrap from "focus-trap-react"
import WithLabel from "../inputs/WithLabel"

interface FormProps {
  initialValue?: string
  scopes: Array<Scope>
  onConfirm: (tagText: string, tagColor: string, scope?: { title: string, color: string, unique: boolean }) => void
}

const defaultWhite = "#ffffff"

const TagForm = forwardRef<HTMLFormElement, FormProps>(
  function TagForm(props: FormProps, ref: React.Ref<HTMLFormElement>) {

    const [tagText, setTagText] = useState<string>()
    const [tagColor, setTagColor] = useState<string>(defaultWhite)
    const [scopeText, setScopeText] = useState("")
    const [scopeColor, setScopeColor] = useState(defaultWhite)

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
        setScopeText(str ?? "")
        setUnique(false)
      }
    }

    const createTag = () => {
      if (tagText && tagColor) {
        props.onConfirm(tagText, tagColor, {title: scopeText, color: scopeColor, unique: unique})
      }
    }

    return (
      <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}}>
        <form ref={ref} id="snovy-tag-create-form" className="snovy-form" tabIndex={-1}>
          <TagFormItem
            color={{value: scopeColor, get: setScopeColor}}
            check={{toggled: unique, toggle: setUnique, descriptor: "Exclusive"}}
          >
            <ComboBox
              onSelect={selectScope} items={props.scopes.map(it => it.toString())} selected={scopeText}
              placeholder="Scope" tabIndex={0} newItem={{getInputValue: makeScope, name: "scope"}}
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
            <Input placeholder="Tag" onValueChange={setTagText} defaultValue={tagText}/>
          </TagFormItem>
          <Button id="add-tag-button" value="Add & tag" onClick={() => createTag()}/>
        </form>
      </FocusTrap>
    )

  }
)

const TagFormItem = (props: {
  color: { value: string | undefined, get: (color: string) => void }
  check?: { toggled: boolean | undefined, toggle: (setToggle: boolean) => void, descriptor: string }
  disableColor?: boolean,
  children: React.ReactElement<typeof Input | typeof ComboBox>
}) => {

  return (
    <span className="snovy-form-item">
      <ColorPicker
        getColor={props.color.get} getColorFromInput={color => props.color.get("#" + color)}
        selectedItem={props.color.value} includeButton
        colors={["#ff0000", "#ffa500", "#00ff00", "#40e0d0", "#0000ff", "#800080", "#ffffff", "#000000"]}
      />
      {props.children}
      {props.check &&
      <WithLabel value={props.check.descriptor} position="after">
        <ToggleButton
          preset="check" circular setState={props.check.toggled} getState={val => props.check!.toggle(val)}
        />
      </WithLabel>
      }
    </span>
  )

}

export default TagForm