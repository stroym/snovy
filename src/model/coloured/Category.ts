import {ColouredItem} from "../common/Base"

export default class Category extends ColouredItem {

  name: string
  exclusive: boolean

  constructor(name: string, colour: string, exclusive: boolean = false) {
    super(name, colour)
    this.name = name
    this.exclusive = exclusive
  }

  toString(): string {
    return this.exclusive ? this.name + "::" : this.name + ":"
  }

}