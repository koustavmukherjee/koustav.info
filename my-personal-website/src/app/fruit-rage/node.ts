import {Cell} from './cell';
import { FruitRageBasicService } from './fruit-rage-basic.service';

let MAX_DEPTH = 4;
let MAX_BRANCHING_FACTOR = 5;

export class Node {
  state: number[][];
  depth: number;
  points: number;
  cluster: number[];
  node_type: boolean;
  blank_count: number;
  size: number;
  clusters_consumed: number;

  constructor(private fruitRageBasicService: FruitRageBasicService, state, size) {
    this.state = state;
    this.depth = 0;
    this.points = 0;
    this.cluster = [];
    this.node_type = true;
    this.blank_count = 0;
    this.size = size;
    this.clusters_consumed = 0;
  }

  isCutOffDepth() {
    if (MAX_DEPTH === -1) {
      return this.depth === this.size * this.size;
    }
    else {
      return this.depth === this.size * this.size || this.depth === MAX_DEPTH;
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
    let successors = [];
    let clusters = this.fruitRageBasicService.get_clusters(this.state, this.size);
    clusters.sort(function (a, b) {
      return b.length - a.length;
    });
    let clusters_considered = clusters;
    if (MAX_BRANCHING_FACTOR !== -1) {
      clusters_considered = clusters_considered.slice(0, MAX_BRANCHING_FACTOR - 1);
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
        let key = Math.floor(loc / this.size);
        let val = Math.floor(loc % this.size);
        successor.state[key][val] = -1;
      }
      successor.cluster = cluster;
      this.fruitRageBasicService.gravitate(successor.state, this.size);
      successors.push(successor);
    }
    return successors;
  }
}
