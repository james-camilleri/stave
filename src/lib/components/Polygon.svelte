<script lang="ts">
  import type { Point } from '$lib/types'

  import { pointsToString } from '$lib/utils/svg'

  export let points: Point[]
</script>

<polygon points={pointsToString(points)} fill="none" />
