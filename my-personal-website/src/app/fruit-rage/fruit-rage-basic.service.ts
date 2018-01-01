import {Injectable} from '@angular/core';
import {Node} from './node';

@Injectable()
export class FruitRageBasicService {

  constructor() {}
  get_cluster(fruit, x, y, cluster, state, size, invoker) {

    if (cluster.includes(x * size + y)) {
      return cluster;
    }

    if (invoker === 'presentation') {
      if (state[x][y].value !== fruit) {
        return cluster;
      }
    } else {
      if (state[x][y] !== fruit) {
        return cluster;
      }
    }

    cluster.push(x * size + y);

    // left
    if (x - 1 >= 0) {
      this.get_cluster(fruit, x - 1, y, cluster, state, size, invoker);
    }

    // right
    if (x + 1 < size) {
      this.get_cluster(fruit, x + 1, y, cluster, state, size, invoker);
    }

    // up
    if (y - 1 >= 0) {
      this.get_cluster(fruit, x, y - 1, cluster, state, size, invoker);
    }

    // down
    if (y + 1 < size) {
      this.get_cluster(fruit, x, y + 1, cluster, state, size, invoker);
    }

    return cluster;
  }

  gravitate(state: number[][], size) {
    for (let i = 0; i < size; i++) {
      let end = size - 1;
      let start = size - 1;
      while (end >= 0) {
        if (state[end][i] === -1) {
          end -= 1;
        } else {
          if (start === end) {
            end -= 1;
            start -= 1;
          } else {
            state[start][i] = state[end][i];
            state[end][i] = -1;
            end -= 1;
            start -= 1;
          }
        }
      }
    }
    return state;
  }

  get_clusters(state, size) {
    const clusters = [];
    const visited = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!visited.includes(i * size + j) && state[i][j] !== -1) {
          let cluster = [];
          cluster = this.get_cluster(state[i][j], i, j, cluster, state, size, 'service');
          clusters.push(cluster);
          visited.push.apply(visited, cluster);
        }
      }
    }
    return clusters;
  }

  max_value(node: Node, alpha: number, beta: number): number {
    if (node.isCutOffDepth()) {
        return node.points;
    }
    let v: number = Number.NEGATIVE_INFINITY;
    const successors = node.get_successors();
    for (let i = 0; i < successors.length; i++) {
      const successor = successors[i];
      v = Math.max(v, this.min_value(successor, alpha, beta));
      if (v >= beta) {
            return v;
      }
      alpha = Math.max(alpha, v);
    }
    return v;
  }

  min_value(node: Node, alpha: number, beta: number): number {
    if (node.isCutOffDepth()) {
        return node.points;
    }
    let v: number = Number.POSITIVE_INFINITY;
    const successors = node.get_successors();
    for (let i = 0; i < successors.length; i++) {
      const successor = successors[i];
      v = Math.min(v, this.max_value(successor, alpha, beta));
      if (v <= alpha) {
            return v;
      }
      beta = Math.min(beta, v);
    }
    return v;
  }

  minimax_value(node: Node, alpha: number, beta: number) {
    if (node.node_type) {
        return this.max_value(node, alpha, beta);
    } else {
        return this.min_value(node, alpha, beta);
    }
  }

  minimax_decision(successors) {
    let alpha = Number.NEGATIVE_INFINITY;
    const beta = Number.POSITIVE_INFINITY;
    let index = -1;
    for (let i = 0; i < successors.length; i++) {
      const value = this.minimax_value(successors[i], alpha, beta);
      if (value > alpha) {
        alpha = value;
        index = i;
      }
    }
    return successors[index];
  }

}
