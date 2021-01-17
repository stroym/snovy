import {Action, ActionType} from "../component/shared/ContextMenu";

export abstract class Base {

  readonly id: number;
  name: string;

  protected constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  rename(newName: string) {
    this.name = newName;
  }

}

export abstract class OrderedBase extends Base {

  order: number;

  protected constructor(id: number, name: string, order: number) {
    super(id, name);
    this.order = order;
  }

  toString(): string {
    return this.name;
  }

}

export abstract class HolderItem<P extends ParentedHolder<any, any>> extends OrderedBase {

  parent: P;

  protected constructor(parent: P, id: number, name: string, order: number) {
    super(id, name, order);
    this.parent = parent;
  }

}

export abstract class Holder<T extends HolderItem<any>> extends OrderedBase {

  protected idCounter: number = 0;

  items: Array<T> = new Array<T>();

  get itemsSortedById() {
    return this.items.sort((a: T, b: T) => {
      return a.id - b.id;
    });
  }

  get itemsSortedAlphabetically() {
    return this.items.sort((a: T, b: T) => {
      return a.name.localeCompare(b.name);
    });
  }

  get itemsSortedByOrder() {
    return this.items.sort((a: T, b: T) => {
      return a.order - b.order;
    });
  }

  protected addItem(item: T, reorder: boolean = false) {
    if (reorder) {
      this.itemsSortedByOrder.slice(item.order).forEach(value => {
        value.order++;
      });
    }

    this.items.push(item);
    this.idCounter++;
  }

  protected deleteItem(item: T) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  protected deleteById(id: number): boolean {
    let item = this.items.find(value => {
      return value.id == id;
    });

    if (item) {
      this.deleteItem(item);
      return true;
    } else {
      return false;
    }
  }

}

export abstract class ParentedHolder<T extends HolderItem<any>, P extends Holder<any>> extends Holder<T> {

  parent: P;

  constructor(parent: P, id: number, name: string, order: number) {
    super(id, name, order);
    this.parent = parent;
  }

  abstract addNewItem(order?: number): void;

  handleAction(action: Action) {
    switch (action.type) {
      case ActionType.NEW:
        if (action.target) {
          this.addNewItem(action.target.order + 1);
          // this.addItem();
        } else {
          //TODO need to get items from originating element... possibly put onto action (also maybe the action.target itself)
          // this could be directly in the list, but there'll be some issues with generics
          //insert with order = list.length
        }
        break;
      case ActionType.EDIT:
        action.target?.rename("blob");
        break;
      case ActionType.DELETE:
        action.target?.parent.deleteItem(action.target);
        break;
      default:
    }
  }

}