import React, {forwardRef} from "react"
import Scope from "../../model/coloured/Scope"

interface FormProps {
  initialValue?: string
  scope?: Scope
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

const TagSelector = forwardRef<HTMLFormElement, FormProps>(
  function TagSelector(props: FormProps, ref: React.Ref<HTMLFormElement>) {
    return (
      <form ref={ref} id="snovy-tag-create-form" className="snovy-form">
        <span>
          <input type="checkbox"/>
          <input placeholder="New scope name..."/>
          <button type="button"/>
          {/*<SketchPicker presetColors={[]}></SketchPicker>*/}
        </span>
        <span>
          <input placeholder="New tag Name..." defaultValue={props.initialValue}/>
          <button type="button"/>
          {/*<SketchPicker presetColors={[]}></SketchPicker>*/}
        </span>
        <button type="button">{"add"}</button>
      </form>
    )
  }
)

export default TagSelector