import React, {useState} from "react"
import TabMenu, {Alignment, Orientation} from "../tab_menu/TabMenu"
import TabMenuItem, {CollapseTabMenuItem} from "../tab_menu/TabMenuItem"

type TabHelper = {
  tabAlignment: Alignment,
  tooltip?: string,
  viewable?: { text: string, toggle?: boolean, action?: () => void, content?: JSX.Element | Array<JSX.Element> | false }
  icon?: JSX.Element
}

export interface SidebarProps extends React.HTMLProps<HTMLDivElement> {
  initialTab: string
  orientation: Orientation.LEFT | Orientation.RIGHT
  children: Array<TabHelper>
}

export const Sidebar = ({initialTab, orientation, children, ...props}: SidebarProps) => {

  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState(initialTab)

  const toggleTab = (text: string) => {
    if (active == text) {
      setActive(initialTab)
    } else {
      setActive(text)
    }
  }

  const tabMenu =
    <TabMenu orientation={orientation} id={`${orientation}-menu`}>
      {[
        ...children.map((it, index) => <TabMenuItem
          key={index} alignment={it.tabAlignment} icon={it.icon}
          viewable={it.viewable && {
            text: it.viewable.text,
            active: active,
            onActiveChange: value => it.viewable!.action ? it.viewable!.action() : it.viewable!.toggle ? toggleTab(it.viewable!.text) : setActive(value)
          }}
        />),
        <CollapseTabMenuItem
          key="collapse-item" alignment={Alignment.END} orientation={orientation}
          onClick={() => {
            setCollapsed(!collapsed)

            const editorElement = Array.from(document.getElementsByClassName("ProseMirror")).first() as HTMLElement
            editorElement?.focus()
          }}
        />
      ]}
    </TabMenu>

  return (
    <>
      {orientation == Orientation.LEFT && tabMenu}
      <div
        {...props}
        id={`${orientation}-sidebar`}
        className={`snovy-sidebar ${orientation}`}
        style={{
          display: collapsed ? "none" : "initial",
          visibility: collapsed ? "hidden" : "initial"
        }}
      >
        {
          children.find(it => it.viewable?.text == active)?.viewable?.content
        }
      </div>
      {orientation == Orientation.RIGHT && tabMenu}
    </>
  )

}

export default Sidebar