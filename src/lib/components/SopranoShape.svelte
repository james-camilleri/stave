<script lang="ts">
  import type { Point } from '$lib/types'

  import { fibonacci } from '$lib/utils/sequence'
  import { rotatePoint, translatePoint } from '$lib/utils/svg'

  import Polygon from './Polygon.svelte'

  export let top: Point
  export let bottom: Point
  export let bandStart: Point
  export let bandEnd: Point
  export let notes: number

  interface Shard {
    size: number
    top: Point
    right: Point
    bottom: Point
    left: Point
  }

  $: midpoint = { x: top.x, y: top.y + (bottom.y - top.y) / 2 }
  $: shards = transformPoints(generateShards(notes, midpoint).reverse(), midpoint)

  const SIZE_SCALE_FACTOR = 1.2
  const ROTATION_SCALE_FACTOR = 15
  const FIBONACCI = fibonacci()

  function generateShards(notes: number, midpoint: Point): Shard[] {
    const sizes = fibonacci().slice(1)

    let nextSize = sizes.shift()
    const lines = []

    while (nextSize && notes >= nextSize) {
      notes -= nextSize
      const size = nextSize * SIZE_SCALE_FACTOR
      lines.push({
        size,
        top: { x: midpoint.x, y: midpoint.y - size },
        right: { x: midpoint.x + size / 7, y: midpoint.y },
        bottom: { x: midpoint.x, y: midpoint.y + size },
        left: { x: midpoint.x - size / 7, y: midpoint.y },
      })
      nextSize = sizes.shift()
    }

    return lines
  }

  function transformPoints(shards: Shard[], midpoint: Point): Shard[] {
    return shards.map((shard, i) => {
      const angle = getRotationOffset(i)
      const translationOffset = getTranslationOffset(shards, i)
      const { top, right, bottom, left } = shard

      return {
        size: shard.size,
        top: rotatePoint(
          translatePoint(rotatePoint(top, midpoint, -angle), { x: translationOffset, y: 0 }),
          midpoint,
          angle
        ),
        right: rotatePoint(
          translatePoint(rotatePoint(right, midpoint, -angle), { x: translationOffset, y: 0 }),
          midpoint,
          angle
        ),
        bottom: rotatePoint(
          translatePoint(rotatePoint(bottom, midpoint, -angle), { x: translationOffset, y: 0 }),
          midpoint,
          angle
        ),
        left: rotatePoint(
          translatePoint(rotatePoint(left, midpoint, -angle), { x: translationOffset, y: 0 }),
          midpoint,
          angle
        ),
      }
    })
  }

  function getRotationOffset(i: number) {
    return FIBONACCI[i] * ROTATION_SCALE_FACTOR + 180 * i
  }

  function getTranslationOffset(shards: { size: number }[], i: number) {
    if (i === 0) {
      return 0
    }

    return shards.slice(0, i).reduce((offset, { size }) => offset + (size / 7) * 2, 0)
  }
</script>

{#each shards as { top }}
  {#each shards as point}
    <Polygon points={[bandStart, top]} colour="#FF91C2" width={0.5} fill={false} />
    <Polygon points={[top, point.top]} colour="#FF91C2" width={0.3} fill={false} />
    <Polygon points={[point.top, bandEnd]} colour="#FF91C2" width={0.5} fill={false} />
  {/each}
{/each}

{#each shards as { bottom }}
  {#each shards as point}
    <Polygon points={[bandStart, bottom]} colour="#FF91C2" width={0.5} fill={false} />
    <Polygon points={[bottom, point.bottom]} colour="#FF91C2" width={0.3} fill={false} />
    <Polygon points={[point.bottom, bandEnd]} colour="#FF91C2" width={0.5} fill={false} />
  {/each}
{/each}

{#each shards as line}
  <Polygon points={[line.top, line.right, line.bottom, line.left, line.top]} colour="#DE639A" />
{/each}
