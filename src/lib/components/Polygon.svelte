<script lang="ts">
  import type { Point } from '$lib/types'

  import { pointsToPath } from '$lib/utils/svg'

  export let points: Point[]
  export let colour = 'none'
  export let width = 1
  export let fill = true
</script>

<path
  style:d={`path("${pointsToPath(points)}")`}
  fill={fill ? colour : 'none'}
  stroke={colour}
  stroke-width={width}
  stroke-linejoin="round"
/>

<style>
  path {
    transition: d 0.5s ease-in-out;
  }
</style>
