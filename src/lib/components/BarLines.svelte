<script lang="ts">
  import Polyline from './Polyline.svelte'

  export let width: number
  export let startX: number
  export let endX: number
  export let startY: number
  export let endY: number
  export let colour: string
</script>

<Polyline
  points={[
    { x: startX, y: startY },
    { x: startX, y: endY },
  ]}
  {width}
  {colour}
/>

<Polyline
  points={[
    { x: endX, y: startY },
    { x: endX, y: endY },
  ]}
  {width}
  {colour}
/>
