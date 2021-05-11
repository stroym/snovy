//TODO make state, tags and scopes notebook independent
// then evaluate the feasibility of having an availability array
import {Colored} from "./Base"
import {dexie} from "../../index"
import {stateId} from "../Database"

export default class State extends Colored {

  constructor(title: string, color: string, id?: number) {
    super(title, color, id)
  }

  delete() {
    return dexie.transaction("rw", dexie.states, dexie.notes, async () => {
      for (const note of await dexie.notes.where(stateId).equals(this.id).toArray()) {
        note.setState()
      }

      dexie.states.delete(this.id)
    }).then(_result => true).catch(_result => false)
  }

  async load() {
    return Promise.all([]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.states, () => {
      dexie.states.put(this, this.id)
    }).then(_it => this)
  }

}