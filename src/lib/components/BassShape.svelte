<script lang="ts">
  import type { Point } from '$lib/types'

  import { fibonacci } from '$lib/utils/sequence'
  import { box, midPoint, rotatePoint, translatePoint } from '$lib/utils/svg'

  import Polygon from './Polygon.svelte'

  export let top: Point
  export let bottom: Point
  export let bandStart: Point
  export let bandEnd: Point
  export let notes: number

  interface Square {
    size: number
    points: Point[]
  }

  $: midpoint = midPoint(top, bottom)
  $: compoundSquares = offsetPoints(generateCompoundSquares(notes, midpoint).reverse(), midpoint)

  const SIZE_SCALE_FACTOR = 2.5
  const ROTATION_SCALE_FACTOR = 15
  const FIBONACCI = fibonacci()

  function generateCompoundSquares(notes: number, midpoint: Point): Square[][] {
    const sizes = fibonacci().slice(2)
    const buckets = fibonacci().slice(3)

    let nextSize = sizes.shift()
    const boxes = []

    while (nextSize && notes >= nextSize) {
      notes -= nextSize
      const size = nextSize * SIZE_SCALE_FACTOR
      boxes.push({
        size,
        points: box(midpoint, size, size),
      })
      nextSize = sizes.shift()
    }

    // Create sub-boxes.
    const boxList: Square[][] = []
    const clonedBoxes = [...boxes]
    for (let i = 1; i < buckets.length; i++) {
      const subListLength = buckets.shift()
      const subList = clonedBoxes.slice(0, subListLength)

      if (subList.length === subListLength) {
        boxList.push(subList)
      }
    }

    boxList.push(boxes)

    return boxList
  }

  function offsetPoints(compoundSquares: Square[][], midpoint: Point): Square[][] {
    return compoundSquares.map((compoundSquare, i) => {
      const angle = getRotationOffset(i)
      const previousWidths = compoundSquares
        .slice(0, i)
        .reduce((totalWidth, squares) => totalWidth + squares[squares.length - 1].size, 0)

      return compoundSquare.map((square) => ({
        size: square.size,
        points: square.points.map((point) =>
          rotatePoint(
            translatePoint(rotatePoint(point, midpoint, -angle), { x: previousWidths, y: 0 }),
            midpoint,
            angle
          )
        ),
      }))
    })
  }

  function getRotationOffset(i: number) {
    return FIBONACCI[i] * ROTATION_SCALE_FACTOR + 180 * i
  }
</script>

{#each compoundSquares as compoundSquare}
  {#each compoundSquare as { points }}
    <Polygon points={[bandStart, points[0]]} colour="#FAB13C" width={0.5} fill={false} />
    <Polygon points={[bandStart, points[3]]} colour="#FAB13C" width={0.5} fill={false} />
    <Polygon points={[points[1], bandEnd]} colour="#FAB13C" width={0.5} fill={false} />
    <Polygon points={[points[2], bandEnd]} colour="#FAB13C" width={0.5} fill={false} />
  {/each}
{/each}

<!-- {#each boxes as box}
  <Polygon points={box.points} colour="#FC9403" width={Math.max(box.size * 0.05, 0.3)} fill={false} />
  {/each} -->

{#each compoundSquares as compoundSquare}
  <Polygon points={compoundSquare.map(({ points }) => points)} colour="#FC9403" width={0.8} />
{/each}

<!-- {#each compoundSquares as compoundSquare}
  {#each compoundSquare as square}
    <Polygon points={square.points} colour="#FC9403" width={0.8} fill={false} />
  {/each}
{/each} -->

<!--
{#each boxes as line}
  <Polygon points={[line.top, line.right, line.bottom, line.left, line.top]} colour="#DE639A" />
{/each} -->
