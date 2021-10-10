import { Constraint } from '../data/constraint';
import { Story } from '../data/story';
import { logGeneratorError } from '../utils/logger'
import { smoothRender } from './smoothRender'

export type RenderGenerator = 'SmoothRender';

export function storyRender(generator: RenderGenerator, story: Story, constraints: Constraint[]) {
  switch (generator) {
    case 'SmoothRender':
      smoothRender(story, constraints)
      break
    default:
      logGeneratorError(generator)
  }
}
