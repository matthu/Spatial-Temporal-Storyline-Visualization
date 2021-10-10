import { greedyAlign } from './greedyAlign'
import { logGeneratorError } from '../utils/logger'
import { Story } from '../data/story';
import { Constraint } from '../data/constraint';

export type AlignGenerator = 'GreedyAlign';

export function storyAlign(generator: AlignGenerator, story: Story, constraints: Constraint[]) {
  switch (generator) {
    case 'GreedyAlign':
      greedyAlign(story, constraints)
      break
    default:
      logGeneratorError(generator)
  }
}
