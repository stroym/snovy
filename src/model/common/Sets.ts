import Scope from "../colored/Scope"
import Tag from "../colored/Tag"
import State from "../colored/State"
import Note from "../Note"

export default class Sets {

  scopes: Array<Scope> = new Array<Scope>()
  tags: Array<Tag> = new Array<Tag>()
  states: Array<State> = new Array<State>()

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
      if (it.name == scope.name) {
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

}