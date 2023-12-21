<script lang="ts">
  import type { Point } from '../types'

  import { pointsToPath } from '../utils/svg'

  export let points: Point[]
  export let colour: string
  export let width = 1
</script>

<path style:d={`path("${pointsToPath(points)}")`} stroke-width={width} stroke={colour} fill="none" />

<style>
  path {
    transition: d 0.5s ease-in-out;
  }
</style>
