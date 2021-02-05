import Scope from "../coloured/Scope"
import Tag from "../coloured/Tag"
import State from "../coloured/State"
import Note from "../Note"

export default class Sets {

  scopes: Array<Scope> = new Array<Scope>()
  tags: Array<Tag> = new Array<Tag>()
  states: Array<State> = new Array<State>()

  addTag(name: string, colour: string, scope?: Scope) {
    this.tags.push(new Tag(name, colour, scope))
  }

  deleteTag(tag: Tag) {
    this.tags.delete(this.tags.find(it => it.equals(tag))!.unTagNoteAll())
  }

  availableTags(note: Note) {
    return this.tags.filter(it => !note.tags.has(it))
  }

  addScope(name: string, colour: string, exclusive?: boolean) {
    this.scopes.push(new Scope(name, colour, exclusive))
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

  addState(name: string, colour: string) {
    this.states.push(new State(name, colour))
  }

  deleteState(state: State) {
    this.states.delete(state)
  }

}