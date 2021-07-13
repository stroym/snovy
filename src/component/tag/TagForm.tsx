import React, {forwardRef, useEffect, useState} from "react"
import Scope from "../../data/model/Scope"
import {Button, ToggleButton} from "../inputs/Button"
import ColorPicker from "../inputs/ColorPicker"
import ComboBox from "../combo_box/ComboBox"
import Input from "../inputs/Input"
import FocusTrap from "focus-trap-react"
import WithLabel from "../inputs/WithLabel"
import Tag from "../../data/model/Tag"

interface FormProps {
  initialValue?: string
  scopes: Array<Scope>
  onTagCreated?: (tag: Tag) => void
}

//TODO get rid of "item" row things and rework this into a modal, since there's going to be a need for multiple checkboxes and things
const TagForm = forwardRef<HTMLFormElement, FormProps>(
  function TagForm(props: FormProps, ref: React.Ref<HTMLFormElement>) {

    const [tagText, setTagText] = useState<string>()
    const [tagColor, setTagColor] = useState<string | undefined>()
    const [scopeText, setScopeText] = useState("")
    const [scopeColor, setScopeColor] = useState<string | undefined>()

    const [scopeUnique, setUnique] = useState(false)
    const [unify, setUnify] = useState(true)

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
        if (unify) {
          setScopeColor(scopeColor)
          setTagColor(scopeColor)
        }
      }, [scopeColor]
    )

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

    const createTag = async () => {
      if (tagText && !tagText.isBlank() && tagColor) {
        let tag

        if (scopeText && !scopeText.isBlank() && scopeColor) {
          const dbScope = props.scopes.find(it => it.title == scopeText) ??
            await new Scope(scopeText, scopeColor, scopeUnique).save()

          tag = await new Tag(tagText, tagColor, dbScope.id).save()
        } else {
          tag = await new Tag(tagText, tagColor).save()
        }

        props.onTagCreated && props.onTagCreated(tag)
      }
    }

    return (
      <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}}>
        <form ref={ref} id="snovy-tag-create-form" className="snovy-form" tabIndex={-1}>
          <TagFormItem
            color={{value: scopeColor, get: setScopeColor}}
            check={{toggled: scopeUnique, toggle: setUnique, descriptor: "Exclusive"}}
          >
            <ComboBox
              onSelect={selectScope} items={props.scopes.map(it => it.toString())} selected={scopeText}
              placeholder="Scope" tabIndex={0} newItem={{getInputValue: selectScope, name: "scope"}}
              options={{absoluteDropdown: false, unboundDropdown: true}}
            />
          </TagFormItem>
          <TagFormItem
            color={{value: tagColor, get: setTagColor}}
            check={{
              toggled: unify, toggle: toggle => {
                setUnify(toggle)
                if (toggle) {
                  setTagColor(scopeColor)
                }
              }, descriptor: "Unify"
            }}
          >
            <Input placeholder="Tag" onValueChange={setTagText} defaultValue={tagText}/>
          </TagFormItem>
          <Button id="add-tag-button" value="Add & tag" onClick={async () => await createTag()}/>
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