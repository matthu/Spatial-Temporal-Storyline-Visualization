export class DisjointSet {
  constructor(num) {
    this.size = num
    this.fatherSet = []
    for (let i = 0; i < num; i++) {
      this.fatherSet[i] = i
    }
  }

  findFather(n) {
    if (this.fatherSet[n] !== n) {
      this.fatherSet[n] = this.findFather(this.fatherSet[n])
    }
    return this.fatherSet[n]
  }

  isInSameSet(n, m) {
    if (this.findFather(n) === this.findFather(m)) return true
    return false
  }

  union(n, m) {
    this.fatherSet[this.findFather(n)] = this.findFather(m)
  }

  allElementInSet(n) {
    let ans = []
    for (let i = 0; i < this.size; i++) {
      if (this.isInSameSet(n, i)) ans.push(i)
    }
    return ans
  }
}
