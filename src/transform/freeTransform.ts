import { Story } from '../data/story'
import { Table } from '../data/table'

export function scale(story: Story, constraints: any[]) {
  const ctrs = constraints.filter(ctr => {
    return ctr.style === 'Scale'
  })
  const position = story.getTable('position')
  const character = story.getTable('character')
  const layout = story.getTable('layout')
  const positions = story.positions
  if (ctrs.length < 1) return position
  const { x0, y0, width, height, reserveRatio } = ctrs[ctrs.length - 1].param
  const { minX, maxX, minY, maxY } = getBoundary(story)
  let pos: any[] = []
  let ratio = (maxY - minY) / (maxX - minX)
  // ratio = ratio < thres ? idealRatio : ratio;
  for (let i = 0, n = story.getTableRows(); i < n; i++) {
    pos[i] = []
    for (let j = 0, m = story.getTableCols(); j < m; j++) {
      pos[i][j] = []
      if (character.value(i, j) && layout.value(i, j) >= 0) {
        const storySegment = positions[position.value(i, j)]
        storySegment.forEach(node => {
          pos[i][j].push([
            ((node[0] - minX) / (maxX - minX)) * width + x0,
            ((node[1] - minY) / (maxY - minY)) *
              (reserveRatio ? ratio / width : height) +
              y0,
          ])
        })
      }
    }
  }
  const newPosition = genNewPosition(story, pos)
  return newPosition
}

export function genNewPosition(story: Story, pos) {
  story.cleanPositions()
  const character = story.getTable('character')
  const layout = story.getTable('layout')
  let tpos: any[] = []
  for (let i = 0; i < pos.length; i++) {
    tpos[i] = []
    for (let j = 0; j < pos[i].length; j++) {
      tpos[i][j] = null
      if (character.value(i, j) && layout.value(i, j) >= 0)
        tpos[i][j] = story.addPosition(pos[i][j])
    }
  }
  const newPosition = new Table(tpos)
  return newPosition
}

export function getBoundary(story: Story) {
  const position = story.getTable('position')
  const character = story.getTable('character')
  const layout = story.getTable('layout')
  const positions = story.positions
  let minX = 1e9,
    maxX = -1e9,
    minY = 1e9,
    maxY = -1e9
  for (let i = 0, n = story.getTableRows(); i < n; i++) {
    for (let j = 0, m = story.getTableCols(); j < m; j++) {
      if (character.value(i, j) && layout.value(i, j) >= 0) {
        const storySegment = positions[position.value(i, j)]
        storySegment.forEach(node => {
          minX = Math.min(minX, node[0])
          maxX = Math.max(maxX, node[0])
          minY = Math.min(minY, node[1])
          maxY = Math.max(maxY, node[1])
        })
      }
    }
  }
  return { minX, maxX, minY, maxY }
}

function freeTransform(story: Story, constraints) {
  const pathTable = genPath(story, constraints)
  story.setTable('path', pathTable)
  return pathTable
}

export function genPath(story: Story, constraints) {
  story.cleanPaths()
  // const position = story.getTable('position')
  const position = scale(story, constraints)
  const character = story.getTable('character')
  const layout = story.getTable('layout')
  const positions = story.positions
  let path: any[] = []
  for (let i = 0, n = story.getTableRows(); i < n; i++) {
    path[i] = []
    for (let j = 0, m = story.getTableCols(); j < m; j++) {
      if (character.value(i, j) && layout.value(i, j) >= 0) {
        const segment = positions[position.value(i, j)]
        let pathStr = `M ${segment[0][0]} ${segment[0][1]} `
        for (let k = 1, len = segment.length; k < len; k++) {
          pathStr += `L ${segment[k][0]} ${segment[k][1]}`
        }
        path[i][j] = story.addPath(pathStr)
      } else {
        path[i][j] = 0
      }
    }
  }
  const pathTable = new Table(path)
  return pathTable
}

export { freeTransform }
