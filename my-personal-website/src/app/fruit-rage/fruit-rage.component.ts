import {Component, OnInit} from '@angular/core';
import {Cell} from './cell';
import {FruitRageBasicService} from './fruit-rage-basic.service';
import { Node} from './node';

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

  constructor(private fruitRageBasicService: FruitRageBasicService) {
    this.size = 6;
    this.fruits = 4;
    this.generateBoard();
  }

  ngOnInit() {
  }

  increaseGridSize() {
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
        const cell = new Cell();
        cell.row = i;
        cell.col = j;
        cell.id = i * this.size + j;
        cell.background_color = 'white';
        cell.value = Math.floor(Math.random() * this.fruits);
        cell.image_class = 'fruit-cell-display-image';
        this.board[i][j] = cell;
      }
    }
  }

  mouseEnter(i, j) {
    if (this.board[i][j].value !== -1) {
      this.cluster = this.fruitRageBasicService.get_cluster(this.board[i][j].value, i, j, this.cluster,
                                                            this.board, this.size, 'presentation');
      for (let k = 0; k < this.cluster.length; k++) {
        this.changeCellBackgroundColor(this.cluster[k], 'aqua');
      }
    }
  }

  mouseLeave() {
    for (let k = 0; k < this.cluster.length; k++) {
      this.changeCellBackgroundColor(this.cluster[k], 'white');
    }
    this.cluster = [];
  }

  onGridCellClick(i, j) {
    for (let k = 0; k < this.cluster.length; k++) {
      const row: number = Math.floor(this.cluster[k] / this.size);
      const col: number = Math.floor(this.cluster[k] % this.size);
      this.board[row][col].value = -1;
      this.board[row][col].image_class = 'fruit-cell-hide-image';
    }
    this.gravitate();
    this.mouseLeave();
    this.mouseEnter(i, j);
  }

  changeCellBackgroundColor(id, color) {
    const row: number = Math.floor(id / this.size);
    const col: number = Math.floor(id % this.size);
    this.board[row][col].background_color = color;
  }

  startGame() {
    const state = this.getStateFromBoard();
    const node: Node = new Node(this.fruitRageBasicService, state, this.size);
    const successors = node.get_successors();
    const decision: Node = this.fruitRageBasicService.minimax_decision(successors);
    console.log(decision.cluster);
  }

  getStateFromBoard(): number[][] {
    const state = [];
    for (let i = 0; i < this.size; i++) {
      state[i] = [];
      for (let j = 0; j < this.size; j++) {
        state[i][j] = this.board[i][j].value;
      }
    }
    return state;
  }

  gravitate() {
    for (let i = 0; i < this.size; i++) {
      let end = this.size - 1;
      let start = this.size - 1;
      while (end >= 0) {
        if (this.board[end][i].image_class === 'fruit-cell-hide-image') {
          end -= 1;
        } else {
          if (start === end) {
            end -= 1;
            start -= 1;
          } else {
            this.board[start][i].value = this.board[end][i].value;
            this.board[start][i].image_class = 'fruit-cell-display-image';
            this.board[end][i].image_class = 'fruit-cell-hide-image';
            this.board[end][i].value = -1;
            end -= 1;
            start -= 1;
          }
        }
      }
    }
  }
}
