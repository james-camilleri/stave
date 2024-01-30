<script lang="ts">
  import type { Circle, Point } from '$lib/types'

  import { PINK } from '$lib/constants'
  import { fibonacci } from '$lib/utils/sequence'
  import { midpoint as midPoint, randomBetween, rotatePoint, translatePoint } from '$lib/utils/svg'

  import Path from './Path.svelte'

  export let top: Point
  export let bottom: Point
  export let bandStart: Point
  export let bandEnd: Point
  export let notes: number

  $: midpoint = midPoint(top, bottom)
  $: compoundCircles = offsetPoints(generateCompoundCircles(notes, midpoint).reverse(), midpoint)

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

    const circleList: Circle[][] = []
    const clonedCircles = [...circles]
    for (let i = 1; i < buckets.length; i++) {
      const subListLength = buckets.shift()
      const subList = clonedCircles.slice(0, subListLength)

      if (subList.length === subListLength) {
        circleList.push(subList)
      }
    }

    // Only push the original set of shapes on to the full list
    // if (circleList[circleList.length - 1].length !== circles.length) {
    //   circleList.push(circles)
    // }

    return circleList
  }

  function offsetPoints(compoundCircles: Circle[][]): Circle[][] {
    return compoundCircles.map((compoundCircle, i) => {
      const angle = getRotationOffset(i)
      const previousSizes = compoundCircles
        .slice(0, i)
        .reduce((totalWidth, circles) => totalWidth + circles[circles.length - 1].radius * 1.4, 0)

      return compoundCircle.map((circle) => ({
        radius: circle.radius,
        centre: rotatePoint(translatePoint(circle.centre, { x: previousSizes, y: 0 }), circle.centre, angle),
      }))
    })
  }

  function getRotationOffset(i: number) {
    return FIBONACCI[i] * ROTATION_SCALE_FACTOR + 245 * i
  }

  const RANDO = 3
</script>

{#each compoundCircles as compoundCircle}
  {#each compoundCircle as circle}
    <!-- Rando -->
    <Path
      points={[
        translatePoint(bandStart, { x: 0, y: randomBetween(-RANDO, RANDO) }),
        translatePoint(circle.centre, { x: 0, y: circle.radius }),
        translatePoint(bandEnd, { x: 0, y: randomBetween(-RANDO, RANDO) }),
      ]}
      stroke={PINK}
      colour={PINK}
      fillOpacity={0.2}
      width={0.5}
      fill
    />
    <Path
      points={[
        translatePoint(bandStart, { x: 0, y: randomBetween(-RANDO, RANDO) }),
        translatePoint(circle.centre, { x: 0, y: -circle.radius }),
        translatePoint(bandEnd, { x: 0, y: randomBetween(-RANDO, RANDO) }),
      ]}
      stroke={PINK}
      colour={PINK}
      fillOpacity={0.2}
      width={0.5}
      fill
    />

    <!-- <Path
      points={[
        translatePoint(bandStart, { x: 0, y: randomBetween(-20, 20) }),
        translatePoint(circle.centre, { x: 0, y: circle.radius }),
        translatePoint(bandEnd, { x: 0, y: randomBetween(-20, 20) }),
        translatePoint(bandEnd, { x: 0, y: randomBetween(-20, 20) }),
        translatePoint(circle.centre, { x: 0, y: -circle.radius }),
        translatePoint(bandStart, { x: 0, y: randomBetween(-20, 20) }),
      ]}
      stroke={PINK}
      colour="rgb(0 0 0 / 30%)"
      width={0.5}
      fill
    /> -->
  {/each}
{/each}
<!--
{#each compoundCircles as compoundCircle}
  <Path
    path={compoundCircle.map((circle) => circleToPath(circle.centre, circle.radius)).join(' ')}
    colour={PINK}
    width={0}
    close
  />
{/each} -->
