export class Cell {
  id: number;
  row: number;
  col: number;
  background_color: string;
  value: number;
  image_class: string;

  clone(): Cell {
    const cell: Cell = new Cell();
    cell.id = this.id;
    cell.row = this.row;
    cell.col = this.col;
    cell.background_color = this.background_color;
    cell.value = this.value;
    cell.image_class = this.image_class;
    return cell;
  }
}
