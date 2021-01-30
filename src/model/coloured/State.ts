import {ColouredItem} from "../common/Base"

export default class State extends ColouredItem {

  name: string

  constructor(name: string, colour: string) {
    super(name, colour)
    this.name = name
  }

}