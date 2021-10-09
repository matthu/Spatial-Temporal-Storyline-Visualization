export interface Constraint {
  names: string[];
  timeSpan: number[], // Will only have two elements [number, number]
  style: ConstraintStyle,
  param: ConstraintParam,
}

export type ConstraintStyle = 'Twine' | 'Knot' | 'Collide' | 'Merge' | 'Split' | 'Scale' | 'Sort' |
  'Bend' | 'Straighten' | 'Compress' | 'Expand' | 'Space' | 'Adjust' | 'Reshape';

export interface ConstraintParam {
  height?: number
  reserveRatio?: boolean
  width?: number
  x0?: number
  y0?: number
  scale?: number
  intraSep?: number
  interSep?: number
  path?: string[]
  upperPath?: string[]
  lowerPath?: string[]
}

export class ConstraintStore {
  _constraints: Constraint[]

  constructor() {
    this._constraints = []
    // Default scale constraint
    this.add([], [], 'Scale', {
      x0: 100,
      y0: 100,
      width: 1700,
      height: 400,
      reserveRatio: false,
    })
  }

  get constraints() {
    return this._constraints
  }

  add(names: string[], timeSpan: number[], style: ConstraintStyle, param: ConstraintParam) {
    this._constraints.push({
      names: names,
      timeSpan: timeSpan,
      style: style,
      param: param,
    })
  }
}
