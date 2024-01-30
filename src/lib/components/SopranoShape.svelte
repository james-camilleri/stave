<script lang="ts">
  import type { Point } from '$lib/types'

  import Color from 'color'

  import { FILL_OPACITY, PATTERN_RANDOM_OFFSET } from '$lib/constants'
  import { fibonacci } from '$lib/utils/sequence'
  import { randomBetween, rotatePoint, translatePoint } from '$lib/utils/svg'

  import Path from './Path.svelte'

  export let top: Point
  export let bottom: Point
  export let bandStart: Point
  export let bandEnd: Point
  export let notes: number
  export let colour: string
  export let baseOpacity: number

  interface Shard {
    size: number
    top: Point
    right: Point
    bottom: Point
    left: Point
  }

  $: midpoint = { x: top.x, y: top.y + (bottom.y - top.y) / 2 }
  $: shards = transformPoints(generateShards(notes, midpoint).reverse(), midpoint)

  const MAX_SIZE = 50
  const SIZE_SCALE_FACTOR = 1.2
  const ROTATION_SCALE_FACTOR = 15
  const FIBONACCI = fibonacci()

  function generateShards(notes: number, midpoint: Point): Shard[] {
    const sizes = fibonacci().slice(1)

    let nextSize = sizes.shift()
    const lines = []

    while (nextSize && notes >= nextSize) {
      notes -= nextSize
      const size = Math.min(nextSize * SIZE_SCALE_FACTOR, MAX_SIZE)
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
          angle,
        ),
        right: rotatePoint(
          translatePoint(rotatePoint(right, midpoint, -angle), { x: translationOffset, y: 0 }),
          midpoint,
          angle,
        ),
        bottom: rotatePoint(
          translatePoint(rotatePoint(bottom, midpoint, -angle), { x: translationOffset, y: 0 }),
          midpoint,
          angle,
        ),
        left: rotatePoint(
          translatePoint(rotatePoint(left, midpoint, -angle), { x: translationOffset, y: 0 }),
          midpoint,
          angle,
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

{#each shards as shard, i}
  {@const start = translatePoint(bandStart, { x: 0, y: randomBetween(-PATTERN_RANDOM_OFFSET, PATTERN_RANDOM_OFFSET) })}
  <Path
    points={[
      start,
      shard.top,
      translatePoint(bandEnd, { x: 0, y: randomBetween(-PATTERN_RANDOM_OFFSET, PATTERN_RANDOM_OFFSET) }),
      shard.bottom,
      start,
    ]}
    colour={new Color(colour).lighten(i / (shards.length * 4)).hex()}
    fill
    fillOpacity={baseOpacity + FILL_OPACITY}
    width={0.5}
  />
{/each}
