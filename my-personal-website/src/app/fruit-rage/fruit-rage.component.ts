import { Component, OnInit } from '@angular/core';
import { Cell } from './cell';

const MAX_GRID_SIZE = 10;
const MIN_GRID_SIZE = 6;
const MIN_FRUIT_TYPES = 3;
const MAX_FRUIT_TYPES = 6;

@Component({
  selector: 'app-fruit-rage',
  templateUrl: './fruit-rage.component.html',
  styleUrls: ['./fruit-rage.component.css']
})
export class FruitRageComponent implements OnInit {
  size: number;
  fruits: number;
  board: Cell[][];
  cluster: number[] = [];
  
  constructor() {
    this.size = 6;
    this.fruits = 4;
    this.generateBoard();
  }

  ngOnInit() {
  }

  increaseGridSize() {
    //const target = e.target || e.srcElement || e.currentTarget;
    //const idAttr = target.attributes.id;
    //console.log(idAttr);
    if (this.size < MAX_GRID_SIZE) {
      this.size++;
      this.generateBoard();
    }
  }

  decreaseGridSize() {
    if (this.size > MIN_GRID_SIZE) {
      this.size--;
      this.generateBoard();
    }
  }

  increaseFruitTypes() {
    if (this.fruits < MAX_FRUIT_TYPES) {
      this.fruits++;
      this.generateBoard();
    }
  }

  decreaseFruitTypes() {
    if (this.fruits > MIN_FRUIT_TYPES) {
      this.fruits--;
      this.generateBoard();
    }
  }

  generateBoard() {
    this.board = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.board[i] = new Array(this.size);
      for (let j = 0; j < this.size; j++) {
        let cell = new Cell();
        cell.row = i;
        cell.col = j;
        cell.id = i * this.size + j;
        cell.background_color = 'white';
        cell.value = Math.floor(Math.random() * this.fruits);
        this.board[i][j] = cell;
      }
    }
  }

  mouseEnter(i, j) {
    this.cluster = this.get_cluster(this.board[i][j].value, i, j, this.cluster, this.board, this.size);
    for (let k = 0; k < this.cluster.length; k++) {
      this.changeCellBackgroundColor(this.cluster[k], 'aqua');
    }
  }

  mouseLeave(i, j) {
    for (let k = 0; k < this.cluster.length; k++) {
      this.changeCellBackgroundColor(this.cluster[k], 'white');
    }
    this.cluster = [];
  }

  changeCellBackgroundColor(id, color) {
    const row: number = Math.floor(id / this.size);
    const col: number = Math.floor(id % this.size);
    this.board[row][col].background_color = color;
  }
  
  get_cluster(fruit, x, y, cluster, state, size) {

    if (cluster.includes(x * this.size + y)) {
      return cluster;
    }

    if (state[x][y].value !== fruit) {
      return cluster;
    }

    cluster.push(x * this.size + y);

    // left
    if (x - 1 >= 0 ) {
        this.get_cluster(fruit, x - 1, y, cluster, state, this.size);
    }

    // right
    if (x + 1 < this.size) {
        this.get_cluster(fruit, x + 1, y, cluster, state, this.size);
    }

    // up
    if (y - 1 >= 0) {
        this.get_cluster(fruit, x, y - 1, cluster, state, this.size);
    }

    // down
    if (y + 1 < size) {
        this.get_cluster(fruit, x, y + 1, cluster, state, this.size);
    }

    return cluster;
  }
}
