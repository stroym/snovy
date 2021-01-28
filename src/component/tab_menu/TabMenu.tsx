import React, {useEffect, useState} from "react"
import TabMenuItem from "./TabMenuItem"

const TabMenu = (props: {
  id?: string,
  orientation: Orientation,
  tabs: Array<{ text: string, default?: boolean }>
  onClick: (active: string | undefined) => any,
}) => {

  const [activeTab, setActiveTab] = useState<string | undefined>(props.tabs.find(value => value.default)?.text)

  const handleClick = (active: string) => {
    setActiveTab(active)
  }

  useEffect(
    () => {
      props.onClick(activeTab)
    }, [activeTab]
  )

  return (
    <div id={props.id} className={"snovy-tab-menu-" + props.orientation}>
      {props.tabs.map((tab) =>
        <TabMenuItem key={tab.text} text={tab.text} active={activeTab == tab.text}
                     onClick={handleClick}/>)}
    </div>
  )

}

export enum Orientation {

  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom"

}

export default TabMenu
//
// {React.Children.map(props.tabs, (tab) =>
//   React.createElement(typeof TabMenuItem, {
//     text: tab.text,
//     active: activeTab == tab.text,
//     defaultSelected: tab.default,
//     onClick: () => { setActiveTab(tab.text)}
//   }, {}))}
//
// {React.Children.map(props.tabs, (tab) =>
//   <TabMenuItem text={tab.text} active={activeTab == tab.text} defaultSelected={tab.default}
//                onClick={() => { setActiveTab(tab.text)}}/>)}