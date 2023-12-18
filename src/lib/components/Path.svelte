<script lang="ts">
  import type { Point } from '$lib/types'

  import { pointToString, pointsToPath } from '$lib/utils/svg'

  export let points: Point[] | Point[][] = []
  export let path = ''
  export let colour = 'none'
  export let stroke: string | undefined = undefined
  export let width = 1
  export let fill = true
  export let close = false

  export let strokeOpacity = 1
  export let fillOpacity = 1

  function isNested(points: Point[] | Point[][]): points is Point[][] {
    return Array.isArray(points[0])
  }

  let d: string
  $: {
    const pointString =
      path ||
      (isNested(points)
        ? points.map((points) => `M ${pointToString(points[0])} ${pointsToPath(points, close)}`).join(' ')
        : pointsToPath(points, close))

    d = `path("${pointString}")`
  }
</script>

<path
  style:d
  fill={fill ? colour : 'none'}
  fill-opacity={fillOpacity}
  stroke={stroke ?? colour}
  stroke-width={width}
  stroke-opacity={strokeOpacity}
  stroke-linejoin="round"
  fill-rule="evenodd"
/>

<style>
  path {
    transition: d 0.5s ease-in-out;
  }
</style>
