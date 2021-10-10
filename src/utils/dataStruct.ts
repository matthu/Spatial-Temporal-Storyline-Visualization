export class DisjointSet {
  size: number;
  fatherSet: number[];

  constructor(num: number) {
    this.size = num
    this.fatherSet = []
    for (let i = 0; i < num; i++) {
      this.fatherSet[i] = i
    }
  }

  findFather(n: number) {
    if (this.fatherSet[n] !== n) {
      this.fatherSet[n] = this.findFather(this.fatherSet[n])
    }
    return this.fatherSet[n]
  }

  isInSameSet(n: number, m: number) {
    if (this.findFather(n) === this.findFather(m)) return true
    return false
  }

  union(n: number, m: number) {
    this.fatherSet[this.findFather(n)] = this.findFather(m)
  }

  allElementInSet(n: number) {
    let ans: number[] = []
    for (let i = 0; i < this.size; i++) {
      if (this.isInSameSet(n, i)) ans.push(i)
    }
    return ans
  }
}
