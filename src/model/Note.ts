import Tag from "./Tag"
import {Holder} from "./Base"
import Section from "./Section"

export default class Note extends Holder<Tag, Section> {

  content: string = ""
  archived: boolean = false
  state: string = "" //class/list in notebook

  //for testing purposes
  static WithData(parent: Section, id: number, name: string, order: number): Note {
    let temp = new Note(parent, id, name, order)
    temp.content = "content " + id
    return temp
  }

  tag(tag: Tag): void {
    if (!this.items.includes(tag)) {
      this.items.push(tag)
    }
  }

  untag(tag: Tag): void {
    this.deleteItem(tag)
  }

  insert(): void {}

  insertAt(order: number): void {}

  isState(state: string): boolean {
    return this.state === state
  }

}