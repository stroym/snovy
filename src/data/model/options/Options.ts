import {Table} from "../Base"
import {defaultTheme, Theme} from "./Theme"
import {dexie} from "../../../index"
import {deserialize, serialize} from "class-transformer"

export default class Options extends Table {

  singleNotebook: boolean
  theme: Theme

  constructor(singleNotebook: boolean, theme: Theme, id?: number) {
    super(id)
    this.singleNotebook = singleNotebook
    this.theme = theme
  }

  static async getFromDb() {
    return dexie.options.toArray().then(options => {
      if (options.isEmpty()) {
        return defaultOptions
      } else {
        return options.first()!
      }
    })
  }

  //useless
  async create() {
    return this
  }

  //useless
  async delete() {
    return false
  }

  //probably useless
  async load() {
    return Promise.all([
      dexie.options.toArray().then(options => {
          if (options.isEmpty()) {
            this.singleNotebook = defaultOptions.singleNotebook
            this.theme = defaultOptions.theme
          } else {
            const opt = options.first()!

            this.singleNotebook = opt.singleNotebook
            this.theme = opt.theme
          }
        }
      )
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.options, async () => {
      await dexie.options.clear()

      dexie.options.put(this, this.id)
    }).then(_it => this)
  }

  copy() {
    return deserialize(Options, serialize(this))
  }

}

export const defaultOptions = new Options(
  false,
  defaultTheme
)