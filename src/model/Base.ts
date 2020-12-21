export abstract class Base {

  readonly id: number;
  name: string;

  protected constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  set rename(newName: string) {
    this.name = newName;
  }

}

export abstract class OrderableBase extends Base {

  order: number

  protected constructor(id: number, name: string, order: number) {
    super(id, name);
    this.order = order;
  }

  toString(): string {
    return this.name;
  }

}