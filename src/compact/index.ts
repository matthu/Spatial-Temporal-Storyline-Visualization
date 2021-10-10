import { Constraint } from '../data/constraint';
import { Story } from '../data/story';
import { logGeneratorError } from '../utils/logger'
import { greedySlotCompact } from './greedySlotCompact'
import { opCompact } from './opCompact'
import { opSlotCompact } from './opSlotCompact'

export type CompactGenerator = 'GreedySlotCompact' | 'OpCompact' | 'OpSlotCompact';

export function storyCompact(generator: CompactGenerator, story: Story, constraints: Constraint[]) {
  switch (generator) {
    case 'GreedySlotCompact':
      greedySlotCompact(story, constraints)
      break
    case 'OpCompact':
      opCompact(story, constraints)
      break
    case 'OpSlotCompact':
      opSlotCompact(story, constraints)
      break
    default:
      logGeneratorError(generator)
  }
}
