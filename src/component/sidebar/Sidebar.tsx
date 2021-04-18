import React, {useState} from "react"
import TabMenu, {Alignment, Orientation} from "../tab_menu/TabMenu"
import TabMenuItem, {CollapseTabMenuItem} from "../tab_menu/TabMenuItem"

type TabHelper = {
  text: string,
  tabAlignment: Alignment,
  tooltip?: string,
  toggle?: boolean
  action?: () => void,
  content?: JSX.Element | Array<JSX.Element> | false,
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
          key={index} alignment={it.tabAlignment} text={it.text}
          onActiveChange={value => it.action ? it.action() : it.toggle ? toggleTab(it.text) : setActive(value)}
          active={active}
        />),
        <CollapseTabMenuItem
          key="collapse-item" alignment={Alignment.END} orientation={orientation}
          onActiveChange={() => {
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
          children.find(it => it.text == active)?.content
        }
      </div>
      {orientation == Orientation.RIGHT && tabMenu}
    </>
  )

}

export default Sidebar