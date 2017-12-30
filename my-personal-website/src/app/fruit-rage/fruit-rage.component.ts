import { Component, OnInit } from '@angular/core';

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
  board: number[][];
  fruits: number;

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
    this.board = [];
    for (let i = 0; i < this.size; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.board[i][j] = Math.floor(Math.random() * this.fruits);
      }
    }
  }
}
