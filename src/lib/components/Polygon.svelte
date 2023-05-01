<script lang="ts">
  import type { Point } from '$lib/types'

  import { pointsToPath } from '$lib/utils/svg'

  export let points: Point[]
</script>

<path style:d={`path("${pointsToPath(points)}")`} fill="none" />

<style>
  path {
    transition: d 0.5s ease-in-out;
  }
</style>
