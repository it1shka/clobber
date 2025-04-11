import type {GameStateNode} from "./graphHooks";

const RADIUS = 1200

export const mergeNodes = (prev: GameStateNode[], next: GameStateNode[]) => {
  return next.map(nextNode => {
    const prevNode = prev.find(({ id }) => id === nextNode.id)
    if (prevNode !== undefined) {
      return prevNode
    }

    const parent = prev.find(({ data }) => {
      return data
        .possibleOutcomes
        .some(outcome => outcome.identifier === nextNode.id)
    })

    if (parent === undefined) {
      return {
        ...nextNode,
        position: { x: 0, y: 0 },
      }
    }

    const parentOutcomes = parent.data.possibleOutcomes
    const index = parentOutcomes.findIndex(({ identifier }) => {
      return identifier === nextNode.id
    })!
    const angle = 2 * Math.PI * (index / parentOutcomes.length)

    const { position: { x, y } } = parent
    const deltaX = Math.cos(angle) * RADIUS
    const deltaY = Math.sin(angle) * RADIUS
    
    return {
      ...nextNode,
      position: {
        x: x + deltaX,
        y: y + deltaY,
      }
    }
  })
}
