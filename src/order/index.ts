import { Story } from '../data/story';
import { logGeneratorError } from '../utils/logger'
import { greedySort } from './greedySort'

export function storyOrder(generator, story: Story, constraints) {
  switch (generator) {
    case 'GreedyOrder':
      greedySort(story, constraints)
      break
    default:
      logGeneratorError(generator)
  }
}
