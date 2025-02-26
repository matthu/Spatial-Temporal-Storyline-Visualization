import { Constraint } from '../data/constraint';
import { Story } from '../data/story';
import { PathSmoother } from './pathSmoother'

export function smoothRender(story: Story, constraints: Constraint[]) {
  const pathSmoother = new PathSmoother(story, constraints)
  const style = pathSmoother.genStyle(story, constraints)
  story.setTable('style', style)
  const position = pathSmoother.genPosition(story)
  story.setTable('position', position)
}
