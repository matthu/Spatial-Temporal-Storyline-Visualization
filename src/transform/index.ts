import { Constraint } from '../data/constraint';
import { Story } from '../data/story'
import { logGeneratorError } from '../utils/logger'
import { freeTransform } from './freeTransform'

export type TransformGenerator = 'FreeTransform';

export function storyTransform(generator: TransformGenerator, story: Story, constraints: Constraint[]) {
  switch (generator) {
    case 'FreeTransform':
      freeTransform(story, constraints)
      break
    default:
      logGeneratorError(generator)
  }
}
