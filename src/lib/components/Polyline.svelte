<script lang="ts">
  import type { Point } from '../types'

  import { pointsToString } from '../utils/svg'

  export let points: Point[]
  export let colour = 'var(--foreground)'
  export let width = 1
</script>

<polyline points={pointsToString(points)} stroke-width={width} stroke={colour} fill="none" />
