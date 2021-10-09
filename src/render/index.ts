import { Story } from '../data/story';
import { logGeneratorError } from '../utils/logger'
import { smoothRender } from './smoothRender'

export function storyRender(generator, story: Story, constraints) {
  switch (generator) {
    case 'SmoothRender':
      smoothRender(story, constraints)
      break
    default:
      logGeneratorError(generator)
  }
}
