import type { GameStateNode } from './graphHooks'

const MIN_RADIUS = 400
const RADIUS_DELTA = 25

const calcDistance = (n: number) => {
  return MIN_RADIUS + RADIUS_DELTA * n
}

export const mergeNodes = (
  prev: GameStateNode[],
  next: GameStateNode[],
  relaxed: boolean,
) => {
  return next.map(nextNode => {
    const prevNode = prev.find(({ id }) => id === nextNode.id)
    if (prevNode !== undefined) {
      return prevNode
    }

    const parent = prev.find(({ data }) => {
      return data
        .getPossibleOutcomes(relaxed)
        .some(outcome => outcome.identifier === nextNode.id)
    })

    if (parent === undefined) {
      return {
        ...nextNode,
        position: { x: 0, y: 0 },
      }
    }

    const parentOutcomes = parent.data.getPossibleOutcomes(relaxed)
    const index = parentOutcomes.findIndex(({ identifier }) => {
      return identifier === nextNode.id
    })!
    const angle = 2 * Math.PI * (index / parentOutcomes.length)

    const {
      position: { x, y },
    } = parent
    const radius = calcDistance(parentOutcomes.length)
    const deltaX = Math.cos(angle) * radius
    const deltaY = Math.sin(angle) * radius

    return {
      ...nextNode,
      position: {
        x: x + deltaX,
        y: y + deltaY,
      },
    }
  })
}
