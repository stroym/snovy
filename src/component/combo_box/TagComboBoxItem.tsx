import React, {forwardRef} from "react"
import Tag from "../../model/coloured/Tag"

// const TagComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>((
//   {
//     item,
//     selected,
//     highlighted,
//     ...rest
//   }, ref) => {
//
//   return (
//     <li {...rest} ref={ref} className={"snovy-dropdown-item".concat(highlighted ? " hover" : "")}>
//       {item.toString()}
//     </li>
//   )
// })

interface ComboBoxItemProps {
  item: Tag
  selected?: boolean
  highlighted?: boolean
}

const TagComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>((props: ComboBoxItemProps, ref: React.Ref<HTMLLIElement>) => {

  const {item, selected, highlighted, ...rest} = props

  return (
    <li {...rest} ref={ref}
        className={"snovy-dropdown-item".concat(selected ? " active" : "", highlighted ? " hover" : "")}
    >
      {item.toString()}
    </li>
  )
})

TagComboBoxItem.displayName = "TagComboBoxItem"

export default TagComboBoxItem