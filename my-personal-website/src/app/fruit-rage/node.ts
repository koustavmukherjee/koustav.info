import {Cell} from './cell';
import { FruitRageBasicService } from './fruit-rage-basic.service';

export class Node {
  state: number[][];
  depth: number;
  points: number;
  cluster: number[];
  node_type: boolean;
  blank_count: number;
  size: number;
  clusters_consumed: number;
  max_depth: number;
  max_branching_factor: number;

  constructor(private fruitRageBasicService: FruitRageBasicService, state, size) {
    this.state = state;
    this.depth = 0;
    this.points = 0;
    this.cluster = [];
    this.node_type = true;
    this.size = size;
    this.clusters_consumed = 0;
    this.max_depth = 4;
    this.max_branching_factor = -1;
  }

  isCutOffDepth() {
    if (this.max_depth === -1) {
      return this.depth === this.size * this.size;
    } else {
      return this.blank_count === this.size * this.size || this.depth === this.max_depth;
    }
  }

  clone() {
    const node: Node = new Node(this.fruitRageBasicService, this.state, this.size);
    node.state = this.state.map(x => Object.assign({}, x));
    node.depth = this.depth;
    node.points = this.points;
    node.cluster = this.cluster;
    node.node_type = this.node_type;
    node.blank_count = this.blank_count;
    return node;
  }

  get_successors() {
    const successors = [];
    const clusters = this.fruitRageBasicService.get_clusters(this.state, this.size);
    clusters.sort(function (a, b) {
      return b.length - a.length;
    });
    let clusters_considered = clusters;
    if (this.max_branching_factor !== -1) {
      clusters_considered = clusters_considered.slice(0, this.max_branching_factor - 1);
    }
    for (let i = 0; i < clusters_considered.length; i++) {
      const cluster = clusters_considered[i];
      const successor = this.clone();
      successor.depth = this.depth + 1;
      const points = cluster.length * cluster.length;
      successor.points = this.points + (this.node_type ? this.points : -1 * this.points);
      successor.node_type = !this.node_type;
      successor.blank_count = this.blank_count + cluster.length;
      successor.clusters_consumed = cluster.length;
      for (let j = 0; j < cluster.length; j++) {
        const loc = cluster[j];
        const key = Math.floor(loc / this.size);
        const val = Math.floor(loc % this.size);
        successor.state[key][val] = -1;
      }
      successor.cluster = cluster;
      this.fruitRageBasicService.gravitate(successor.state, this.size);
      successors.push(successor);
    }
    return successors;
  }

  get_blank_count() {
    let blank_count = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
            if (this.state[i][j] === -1) {
                blank_count += 1;
            }
      }
    }
    return blank_count;
  }
}
