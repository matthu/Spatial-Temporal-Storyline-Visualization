import { Constraint } from '../data/constraint';
import { Story } from '../data/story';
import { logGeneratorError } from '../utils/logger'
import { greedySort } from './greedySort'

export type OrderGenerator = 'GreedyOrder';

export function storyOrder(generator: OrderGenerator, story: Story, constraints: Constraint[]) {
  switch (generator) {
    case 'GreedyOrder':
      greedySort(story, constraints)
      break
    default:
      logGeneratorError(generator)
  }
}
