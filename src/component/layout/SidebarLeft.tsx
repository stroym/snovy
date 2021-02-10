import React, {useState} from "react"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import {Item, ItemWithParent, OrderedItem, ParentInterface} from "../../model/common/Base"
import {Orientation} from "../tab_menu/TabMenu"
import Manager from "../../model/Manager"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import {ManagedSidebar} from "./Sidebar"
import List from "../list/List"
import ComboBox from "../combo_box/ComboBox"
import {useDefaultEmpty} from "../../util/Hooks"

export const LeftBar = (props: {
  onActiveNotebookChange: (active: Notebook | undefined) => void,
  onActiveSectionChange: (active: Section | undefined) => void,
  onActiveNoteChange: (active: Note | undefined) => void,
  manager: Manager,
  activeNotebook: Notebook | undefined,
  activeSection: Section | undefined,
  activeNote: Note | undefined
}) => {

  const [activeContext, setActiveContext] = useState<Section | Note | undefined | null>()

  const [multiselect, setMultiselect] = useDefaultEmpty<Item>()

  const onContextChange = (target: Section | Note | undefined | null) => {
    setActiveContext(target)
  }

  const onMultiple = (target: Array<Item>) => {
    setMultiselect(target)
  }

  return (
    <ManagedSidebar orientation={Orientation.LEFT} tabs={mappings}>
      {[{
        text: mappings[0].text, children: [
          <ComboBox
            id="notebook-selector"
            key="notebook-selector" items={props.manager.itemsSortedAlphabetically}
            onActiveChange={props.onActiveNotebookChange}
            createItem={(name: string) => {return props.manager.insert(undefined, name)}}
            selection={props.activeNotebook ?? props.manager.items.first()}
          />,
          <span key="lists-span" id="lists-span">
            <>
              <List<Section>
                key="snovy-list-section"
                items={props.activeNotebook?.itemsSortedByOrder}
                selection={props.activeSection} defaultFirst multipleSelection={onMultiple}
                onActiveChange={props.onActiveSectionChange} onContextChange={onContextChange}
                contextChildren={buildContext(activeContext as Section, props.activeNotebook, props.activeSection, props.onActiveSectionChange)}
              />
              <List<Note>
                key="snovy-list-note"
                items={props.activeSection?.itemsSortedByOrder}
                selection={props.activeNote} defaultFirst multipleSelection={onMultiple}
                onActiveChange={props.onActiveNoteChange} onContextChange={onContextChange}
                contextChildren={buildContext(activeContext as Note, props.activeSection, props.activeNote, props.onActiveNoteChange)}
              />
            </>
          </span>
        ]
      }]}
    </ManagedSidebar>
  )

}

const mappings = [
  {text: "Notes", default: true},
  {text: "Search"}
]

function buildKey(parent: OrderedItem | undefined, defaultKey: string) {
  return parent ? parent.constructor.name + parent?.id + "items" : defaultKey
}

//TODO as is the split options are probably more annoying than useful - this behaviour should probably be configurable
function buildContext<I extends ItemWithParent<P>, P extends ParentInterface<I>>(
  contextItem: I | undefined,
  parent: P | undefined,
  activeItem: I | undefined,
  setActive: (active: I | undefined) => void
) {
  return parent ? [
    <ContextMenuItem
      key={"new"} icon="+" text={`New ${parent.childName}`} specialText="& go"
      onClick={() => {contextItem ? parent.insert(contextItem.order + 1) : parent.insert()}}
      specialOnClick={() => {setActive(contextItem ? parent.insert(contextItem.order + 1) : parent.insert())}}
    />,
    ...contextItem ? [
      <ContextMenuItem
        key={"new-at-end"} text={`New ${parent.childName} (as last)`} icon="+" specialText="& go"
        onClick={() => {parent.insert()}}
        specialOnClick={() => {setActive(parent.insert())}}
      />,
      <ContextMenuItem
        key={"delete"} text={`Delete ${parent.childName}`} icon="×"
        onClick={() => {
          const neighbour = parent.deleteById(contextItem.id)

          if (contextItem == activeItem) {
            setActive(neighbour)
          }
        }}
      />
    ] : []
  ] : undefined
}

export default LeftBar