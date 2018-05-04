export class Category {
  
  id: number
  name: string
  parent: number
  
  constructor(id: number, name: string, parent: number) {
    this.id = id
    this.name = name
    this.parent = parent
  }
  
}