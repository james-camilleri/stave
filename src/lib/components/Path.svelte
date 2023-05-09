<script lang="ts">
  import type { Point } from '$lib/types'

  import { pointToString, pointsToPath } from '$lib/utils/svg'

  export let points: Point[] | Point[][]
  export let colour = 'none'
  export let width = 1
  export let fill = true
</script>

<path
  style:d={`path("${
    Array.isArray(points[0])
      ? points.map((points) => `M ${pointToString(points[0])} ${pointsToPath(points)}`).join(' ')
      : pointsToPath(points)
  }")`}
  fill={fill ? colour : 'none'}
  stroke={colour}
  stroke-width={width}
  stroke-linejoin="round"
  fill-rule="evenodd"
/>

<style>
  path {
    transition: d 0.5s ease-in-out;
  }
</style>
