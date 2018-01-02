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
  board_copy: Cell[][];
  cluster: number[] = [];

  blank_count = 0;
  game_started = false;

  rd_1_in_prog = false;
  rd_2_in_prog = false;

  rd1_pl1_score = 0;
  rd1_pl2_score = 0;
  rd2_pl1_score = 0;
  rd2_pl2_score = 0;

  constructor(private fruitRageBasicService: FruitRageBasicService) {
    this.size = 6;
    this.fruits = 4;
    this.generateBoard();
  }

  ngOnInit() {
  }

  increaseGridSize() {
    if (!this.game_started) {
      if (this.size < MAX_GRID_SIZE) {
        this.size++;
        this.generateBoard();
      }
    }
  }

  decreaseGridSize() {
    if (this.game_started) {
      if (this.size > MIN_GRID_SIZE) {
        this.size--;
        this.generateBoard();
      }
    }
  }

  increaseFruitTypes() {
    if (this.game_started) {
      if (this.fruits < MAX_FRUIT_TYPES) {
        this.fruits++;
        this.generateBoard();
      }
    }
  }

  decreaseFruitTypes() {
    if (this.game_started) {
      if (this.fruits > MIN_FRUIT_TYPES) {
        this.fruits--;
        this.generateBoard();
      }
    }
  }

  generateBoard() {
    this.board = new Array(this.size);
    this.board_copy = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.board[i] = new Array(this.size);
      this.board_copy[i] = new Array(this.size);
      for (let j = 0; j < this.size; j++) {
        const cell = new Cell();
        cell.row = i;
        cell.col = j;
        cell.id = i * this.size + j;
        cell.background_color = 'white';
        cell.value = Math.floor(Math.random() * this.fruits);
        cell.image_class = 'fruit-cell-display-image';
        this.board[i][j] = cell;
        this.board_copy[i][j] = cell.clone();
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

  onGridCellClick(i, j, invoker) {
    if (this.game_started && ((this.board[i][j].value !== -1 && invoker === 'player') || invoker === 'ai_agent')) {
      for (let k = 0; k < this.cluster.length; k++) {
        const row: number = Math.floor(this.cluster[k] / this.size);
        const col: number = Math.floor(this.cluster[k] % this.size);
        this.board[row][col].value = -1;
        this.board[row][col].image_class = 'fruit-cell-hide-image';
      }
      this.blank_count += this.cluster.length;
      if (invoker === 'player') {
        if (this.rd_1_in_prog) {
          this.rd1_pl1_score += (this.cluster.length * this.cluster.length);
        } else {
          this.rd2_pl1_score += (this.cluster.length * this.cluster.length);
        }
      } else {
        if (this.rd_1_in_prog) {
          this.rd1_pl2_score += (this.cluster.length * this.cluster.length);
        } else {
          this.rd2_pl2_score += (this.cluster.length * this.cluster.length);
        }
      }
      if (this.isGameOver()) {
        this.onGameOver(i, j);
      } else {
        this.gravitate();
        this.mouseLeave();
        this.mouseEnter(i, j);
        if (invoker === 'player') {
          this.aiAgentMove(i, j);
        }
      }
    }
  }

  isGameOver() {
    return this.blank_count === this.size * this.size;
  }

  onGameOver(i, j) {
    if (this.rd_1_in_prog) {
      this.rd_1_in_prog = false;
      this.rd_2_in_prog = true;
      this.board = this.board_copy;
      this.aiAgentMove(i, j);
    } else if (this.rd_2_in_prog) {
      this.rd_2_in_prog = false;
      if ((this.rd1_pl1_score + this.rd2_pl1_score) > (this.rd1_pl2_score + this.rd2_pl2_score)) {
        console.error('Player 1 won !!');
      } else if ((this.rd1_pl1_score + this.rd2_pl1_score) < (this.rd1_pl2_score + this.rd2_pl2_score)) {
        console.error('Player 2 won !!');
      } else {
        console.error('Match Drawn !!');
      }
    } else {
      console.error('Error State!!');
    }
  }

  changeCellBackgroundColor(id, color) {
    const row: number = Math.floor(id / this.size);
    const col: number = Math.floor(id % this.size);
    this.board[row][col].background_color = color;
  }

  aiAgentMove(i, j) {
    const state = this.getStateFromBoard();
    const node: Node = new Node(this.fruitRageBasicService, state, this.size);
    const successors = node.get_successors();
    const decision: Node = this.fruitRageBasicService.minimax_decision(successors);
    this.cluster = decision.cluster;
    this.onGridCellClick(i, j, 'ai_agent');
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

  startRestartGame() {
    this.game_started = !this.game_started;
    if (this.game_started) {
      this.rd_1_in_prog = true;
      this.rd_2_in_prog = false;
    } else {
      this.generateBoard();
      this.rd_1_in_prog = false;
      this.rd_2_in_prog = false;
    }
    this.rd1_pl1_score = 0;
    this.rd1_pl2_score = 0;
    this.rd2_pl1_score = 0;
    this.rd2_pl2_score = 0;
    this.blank_count = 0;
    this.cluster = [];
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
