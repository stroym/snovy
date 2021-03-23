import React, {forwardRef, useContext} from "react"
import Tag from "../../data/model/Tag"
import TagDisplayItem from "../tag/TagDisplayItem"
import OptionsContext from "../../util/OptionsContext"
import {css} from "@emotion/react"

interface ComboBoxItemProps {
  className?: string
  item: Record<string, any> | string
  selected?: boolean
  highlighted?: boolean
}

const ComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>(
  function ComboBoxItem({item, selected, highlighted, ...props}: ComboBoxItemProps, ref: React.Ref<HTMLLIElement>) {

    const theme = useContext(OptionsContext).theme

    const emotionCss = css`
      background-color: ${selected ? theme.activeColor : highlighted ? theme.hoverColor : "transparent"};
    `

    const className = "snovy-dropdown-item " + props.className

    //TODO while this works, there's probably a better way to do this
    if (item instanceof Tag) {
      return (
        <li css={emotionCss} {...props} ref={ref} className={"tag-dropdown " + className}>
          <TagDisplayItem tag={item}/>
        </li>
      )
    }

    return (
      <li css={emotionCss} {...props} ref={ref} className={className}>
        {item.toString()}
      </li>
    )

  }
)

export default ComboBoxItem