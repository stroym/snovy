import React, {useState} from "react"
import TabMenu, {Alignment, Orientation} from "../tab_menu/TabMenu"
import TabMenuItem, {CollapseTabMenuItem} from "../tab_menu/TabMenuItem"

type TabHelper = {
  tabAlignment: Alignment,
  tooltip?: string,
  action?: () => void
  icon?: JSX.Element
  viewable?: { text: string, toggle?: boolean, content?: JSX.Element | Array<JSX.Element> | false }
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
            onActiveChange: value => it.action ? it.action() : it.viewable!.toggle ? toggleTab(it.viewable!.text) : setActive(value)
          }}
        />),
        <CollapseTabMenuItem
          key="collapse-item" alignment={Alignment.END} orientation={orientation}
          onClick={() => setCollapsed(!collapsed)}
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
          visibility: collapsed ? "collapse" : "visible"
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