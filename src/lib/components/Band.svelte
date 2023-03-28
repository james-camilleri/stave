<script lang="ts">
  import type { Point } from '$lib/types'

  import { subdivide } from '$lib/utils/svg'

  import Polyline from './Polyline.svelte'

  export let perimeter: Point[]
  export let subdivisions = 0

  if (perimeter.length !== 8) {
    throw Error('Bar perimeter must have 8 points')
  }

  $: verticalPairs = [
    [perimeter[0], perimeter[7]],
    [perimeter[1], perimeter[6]],
    [perimeter[2], perimeter[5]],
    [perimeter[3], perimeter[4]],
  ]

  $: lines = verticalPairs
    .map((pair) => subdivide(pair, subdivisions))
    .reduce<Point[][]>((lines, verticalPoints) => {
      for (let i = 0; i < verticalPoints.length; i++) {
        if (!lines[i]) {
          lines[i] = []
        }

        lines[i].push(verticalPoints[i])
      }

      return lines
    }, [])
</script>

{#each lines as points}
  <Polyline {points} width={0.3} />
{/each}

<Polyline points={perimeter.slice(0, 4)} width={2} />
<Polyline points={perimeter.slice(3, 8)} width={2} />
