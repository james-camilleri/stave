<script lang="ts">
  import type { Circle, Point } from '$lib/types'

  import { fibonacci } from '$lib/utils/sequence'
  import { circleToPath, midpoint as midPoint, rotatePoint, translatePoint, triangle } from '$lib/utils/svg'

  import Path from './Path.svelte'

  export let top: Point
  export let bottom: Point
  export let bandStart: Point
  export let bandEnd: Point
  export let notes: number

  $: midpoint = midPoint(top, bottom)
  $: compoundCircles = offsetPoints(generateCompoundCircles(notes, midpoint).reverse(), midpoint)
  $: console.log(notes, compoundCircles)

  const SIZE_SCALE_FACTOR = 1
  const ROTATION_SCALE_FACTOR = 7
  const FIBONACCI = fibonacci()

  function generateCompoundCircles(notes: number, midpoint: Point): Circle[][] {
    const sizes = fibonacci().slice(2)
    const buckets = fibonacci().slice(3)

    let nextSize = sizes.shift()
    const circles = []

    while (nextSize && notes >= nextSize) {
      notes -= nextSize
      const radius = nextSize * SIZE_SCALE_FACTOR
      circles.push({
        centre: midpoint,
        radius,
      })
      nextSize = sizes.shift()
    }

    // Create sub-boxes.
    const circleList: Circle[][] = []
    const clonedCircles = [...circles]
    for (let i = 1; i < buckets.length; i++) {
      const subListLength = buckets.shift()
      const subList = clonedCircles.slice(0, subListLength)

      if (subList.length === subListLength) {
        console.log('subList.length', subList.length, 'subListLength', subListLength)
        circleList.push(subList)
      }
    }

    circleList.push(circles)

    return circleList
  }

  function offsetPoints(compoundCircles: Circle[][], midpoint: Point): Circle[][] {
    return compoundCircles.map((compoundCircle, i) => {
      const angle = getRotationOffset(i)
      const previousSizes = compoundCircles
        .slice(0, i)
        .reduce((totalWidth, circles) => totalWidth + circles[circles.length - 1].radius * 2, 0)

      return compoundCircle.map((circle) => ({
        radius: circle.radius,
        centre: rotatePoint(translatePoint(circle.centre, { x: previousSizes, y: 0 }), circle.centre, angle),
      }))
    })
  }

  function getRotationOffset(i: number) {
    return FIBONACCI[i] * ROTATION_SCALE_FACTOR + 245 * i
  }
</script>

<!-- {#each compoundCircles as compoundCircle}
  {#each compoundCircle as circle}
    {#each points as point}
      <Path points={[bandStart, point]} colour="#71ebc4" width={0.5} fill={false} />
      <Path points={[point, bandEnd]} colour="#71ebc4" width={0.5} fill={false} />
    {/each}
  {/each}
{/each} -->

<!-- {#each boxes as box}
  <Polygon points={box.points} colour="#FC9403" width={Math.max(box.size * 0.05, 0.3)} fill={false} />
  {/each} -->

{#each compoundCircles as compoundCircle}
  <Path
    path={compoundCircle.map((circle) => circleToPath(circle.centre, circle.radius)).join(' ')}
    colour="#11A677"
    width={0}
    close
  />
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
