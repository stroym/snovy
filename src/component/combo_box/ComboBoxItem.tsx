import React, {forwardRef} from "react"
import Tag from "../../data/model/Tag"
import TagDisplayItem from "../tag/TagDisplayItem"

interface ComboBoxItemProps extends React.HTMLProps<HTMLLIElement> {
  className?: string
  item: Record<string, any> | string
  active?: boolean
  highlighted?: boolean
}

const ComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>(
  function ComboBoxItem(
    {item, active, highlighted, className, ...props}: ComboBoxItemProps,
    ref: React.Ref<HTMLLIElement>
  ) {

    const clazzName =
      `snovy-dropdown-item ${className ?? ""} ${highlighted ? "highlighted-item" : active ? "active-item" : ""}`

    //TODO while this works, there's probably a better way to do this
    if (item instanceof Tag) {
      return (
        <li {...props} ref={ref} className={"tag-dropdown " + clazzName}>
          <TagDisplayItem tag={item}/>
        </li>
      )
    }

    return (
      <li {...props} ref={ref} className={clazzName}>
        {item.toString()}
      </li>
    )

  }
)

export default ComboBoxItem