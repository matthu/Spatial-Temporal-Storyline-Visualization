import { greedyAlign } from './greedyAlign'
import { logGeneratorError } from '../utils/logger'
import { Story } from '../data/story';

export function storyAlign(generator, story: Story, constraints) {
  switch (generator) {
    case 'GreedyAlign':
      greedyAlign(story, constraints)
      break
    default:
      logGeneratorError(generator)
  }
}
