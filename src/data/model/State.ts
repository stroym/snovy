//TODO make state, tags and scopes notebook independent
// then evaluate the feasibility of having an availability array
import {Colored} from "./Base"
import {dexie} from "../../index"

export default class State extends Colored {

  notebookId: number

  constructor(notebookId: number, title: string, color: string, id?: number) {
    super(title, color, id)
    this.notebookId = notebookId
  }

  async create() {
    return dexie.transaction("rw", dexie.states, () => {dexie.states.add(this)}).then(_it => this)
  }

  //TODO remove state from notes
  delete() {
    return dexie.transaction("rw", dexie.states, () => {dexie.states.delete(this.id)})
  }

  async load() {
    return Promise.resolve(undefined)
  }

  save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", [dexie.states], () => {
      dexie.states.put(this, this.id)
    })
  }

}