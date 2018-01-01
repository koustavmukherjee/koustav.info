import {Injectable} from '@angular/core';

@Injectable()
export class FruitRageBasicService {

  constructor() {}
  get_cluster(fruit, x, y, cluster, state, size) {

    if (cluster.includes(x * size + y)) {
      return cluster;
    }

    if (state[x][y].value !== fruit) {
      return cluster;
    }

    cluster.push(x * size + y);

    // left
    if (x - 1 >= 0) {
      this.get_cluster(fruit, x - 1, y, cluster, state, size);
    }

    // right
    if (x + 1 < size) {
      this.get_cluster(fruit, x + 1, y, cluster, state, size);
    }

    // up
    if (y - 1 >= 0) {
      this.get_cluster(fruit, x, y - 1, cluster, state, size);
    }

    // down
    if (y + 1 < size) {
      this.get_cluster(fruit, x, y + 1, cluster, state, size);
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
        }
        else {
          if (start === end) {
            end -= 1;
            start -= 1;
          }
          else {
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
          cluster = this.get_cluster(state[i][j], i, j, cluster, state, size);
          clusters.push(cluster);
          visited.push.apply(visited, cluster);
        }
      }
    }
    return clusters;
  }
}
