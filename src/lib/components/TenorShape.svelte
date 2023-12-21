<script lang="ts">
  import type { Point } from '$lib/types'

  import { PATTERN_RANDOM_OFFSET } from '$lib/constants'
  import { fibonacci } from '$lib/utils/sequence'
  import { midpoint as midPoint, randomBetween, rotatePoint, translatePoint, triangle } from '$lib/utils/svg'

  import Path from './Path.svelte'

  export let colour: string
  export let top: Point
  export let bottom: Point
  export let bandStart: Point
  export let bandEnd: Point
  export let notes: number

  interface Triangle {
    size: number
    points: Point[]
  }

  $: midpoint = midPoint(top, bottom)
  $: compoundTriangles = offsetPoints(generateCompoundTriangles(notes, midpoint).reverse(), midpoint)

  const SIZE_SCALE_FACTOR = 3
  const ROTATION_SCALE_FACTOR = 13
  const FIBONACCI = fibonacci()

  function generateCompoundTriangles(notes: number, midpoint: Point): Triangle[][] {
    const sizes = fibonacci().slice(2)
    const buckets = fibonacci().slice(3)

    let nextSize = sizes.shift()
    const triangles = []

    while (nextSize && notes >= nextSize) {
      notes -= nextSize
      const size = nextSize * SIZE_SCALE_FACTOR
      triangles.push({
        size,
        points: triangle(midpoint, size),
      })
      nextSize = sizes.shift()
    }

    // Create sub-triangles.
    const triangleList: Triangle[][] = []
    const clonedTriangles = [...triangles]
    for (let i = 1; i < buckets.length; i++) {
      const subListLength = buckets.shift()
      const subList = clonedTriangles.slice(0, subListLength)

      if (subList.length === subListLength) {
        triangleList.push(subList)
      }
    }

    triangleList.push(triangles)

    return triangleList
  }

  function offsetPoints(compoundTriangles: Triangle[][], midpoint: Point): Triangle[][] {
    return compoundTriangles.map((compoundTriangle, i) => {
      const angle = getRotationOffset(i)
      const previousSizes = compoundTriangles
        .slice(0, i)
        .reduce((totalWidth, triangles) => totalWidth + triangles[triangles.length - 1].size * 0.66, 0)

      return compoundTriangle.map((triangle) => ({
        size: triangle.size,
        points: triangle.points.map((point) =>
          rotatePoint(
            translatePoint(rotatePoint(point, midpoint, -angle), { x: previousSizes, y: 0 }),
            midpoint,
            angle,
          ),
        ),
      }))
    })
  }

  function getRotationOffset(i: number) {
    return FIBONACCI[i] * ROTATION_SCALE_FACTOR + 120 * i
  }
</script>

{#each compoundTriangles as compoundTriangle}
  {#each compoundTriangle as { points }}
    {#each points as point}
      <Path
        points={[
          translatePoint(bandStart, { x: 0, y: randomBetween(-PATTERN_RANDOM_OFFSET, PATTERN_RANDOM_OFFSET) }),
          point,
          translatePoint(bandEnd, { x: 0, y: randomBetween(-PATTERN_RANDOM_OFFSET, PATTERN_RANDOM_OFFSET) }),
        ]}
        stroke={colour}
        {colour}
        fillOpacity={0.2}
        width={0.5}
        fill
      />
    {/each}
  {/each}
{/each}
