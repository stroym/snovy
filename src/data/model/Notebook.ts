import Section from "./Section"
import {IdentifiedItem, Item, OrderedItem, WithOrderedChildren} from "./common/Base"
import Scope from "./colored/Scope"
import Tag from "./colored/Tag"
import Note from "./Note"
import State from "./colored/State"

export default class Notebook extends IdentifiedItem implements WithOrderedChildren<Section> {

  idCounter = 0

  sections = new Array<Section>()

  scopes: Array<Scope> = new Array<Scope>()
  tags: Array<Tag> = new Array<Tag>()
  states: Array<State> = new Array<State>()

  constructor(id: number, name: string) {
    super(id, name)
  }

  get itemsSortedAlphabetically() {
    return this.sortBy(Item.compareByName)
  }

  get itemsSortedByOrder() {
    return this.sortBy(OrderedItem.compareByOrder)
  }

  addItem(section: Section, reorder = false) {
    if (reorder) {
      this.itemsSortedByOrder.slice(section.order).forEach(value => {
        value.order++
      })
    }

    this.sections.push(section)
    this.idCounter++

    return section
  }

  deleteItem(section?: Section) {
    if (!section) {
      return undefined
    } else {
      const index = this.sections.delete(section)

      this.sections.slice(index).forEach(value => value.order--)

      if (index > 0) {
        return this.sections[index - 1]
      } else if (index == 0 && this.sections.length > 1) {
        return this.sections[index]
      } else {
        return undefined
      }
    }
  }

  deleteItems(sections: Array<Section>) {
    let section
    sections.forEach(it => {section = this.deleteItem(it)})
    return section
  }

  deleteById(id: number) {
    return this.deleteItem(this.sections.find(value => {return value.id == id}))
  }

  insert(order?: number, name = "") {
    return this.addItem(new Section(this, this.idCounter, name, order ? order : this.sections.length), order != undefined)
  }

  addTag(name: string, color: string, scope?: Scope) {
    const tag = new Tag(name, color, scope)
    this.tags.push(tag)
    return tag
  }

  deleteTag(tag: Tag) {
    this.tags.delete(this.tags.find(it => it.equals(tag))!.unTagNoteAll())
  }

  availableTags(note: Note) {
    return this.tags.filter(it => !note.tags.has(it))
  }

  addScope(name: string, color: string, unique?: boolean) {
    const scope = new Scope(name, color, unique)
    this.scopes.push(scope)
    return scope
  }

  deleteScope(scope: Scope, keepTags: boolean) {
    this.scopes.find(it => {
        if (it.title == scope.title) {
          if (keepTags) {
            this.tags.forEach(it => {
              if (it.scope == scope) {
                it.removeScope(scope)
              }
            })
          } else {
            this.tags.forEach(it => {
              if (it.scope == scope) {
                it.unTagNoteAll()
                this.tags.delete(it)
              }
            })
          }

          this.scopes.delete(it)
        }
      }
    )
  }

  addState(name: string, color: string) {
    this.states.push(new State(name, color))
  }

  deleteState(state: State) {
    this.states.delete(state)
  }

  private sortBy(compareFn: (a: Section, b: Section) => number): Array<Section> {
    return this.sections.sort(compareFn)
  }

}