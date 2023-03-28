<script lang="ts">
  import 'sanitize.css'

  import type { VoiceGroupData } from '../lib/types'

  import Band from '$lib/components/Band.svelte'
  import BarLines from '$lib/components/BarLines.svelte'
  import { generateBarWarpPoints, groupBandPoints } from '$lib/utils/audio-processing'

  import { subdivide } from '../lib/utils/svg'

  const WIDTH = 500
  const HEIGHT = 350
  const BAR_WIDTH = 1
  const END_WIDTH = 5
  const NUM_OF_BARS = 5
  const MAX_BAND_HEIGHT = HEIGHT / 3
  const START_X = END_WIDTH / 2
  const END_X = WIDTH - END_WIDTH / 2
  const TOP_BAR_Y = MAX_BAND_HEIGHT / 2
  const BOTTOM_BAR_Y = HEIGHT - TOP_BAR_Y
  const BAR_SPACING = (BOTTOM_BAR_Y - TOP_BAR_Y) / 4
  const BAR_SUBDIVISIONS = 15
  const DARK = true

  const MOCK_VOICE_DATA: VoiceGroupData[] = [
    // Soprano
    {
      highestFrequency: 7000,
      lowestFrequency: 5000,
      activeTime: 80,
    },
    // Alto
    {
      highestFrequency: 6800,
      lowestFrequency: 5000,
      activeTime: 100,
    },
    // Tenor
    {
      highestFrequency: 3000,
      lowestFrequency: 2000,
      activeTime: 60,
    },
    // Bass
    {
      highestFrequency: 2500,
      lowestFrequency: 1000,
      activeTime: 95,
    },
  ]

  const barStartPoints = subdivide(
    [
      { x: START_X, y: TOP_BAR_Y },
      { x: START_X, y: BOTTOM_BAR_Y },
    ],
    3
  )
  const barEndPoints = subdivide(
    [
      { x: END_X, y: TOP_BAR_Y },
      { x: END_X, y: BOTTOM_BAR_Y },
    ],
    3
  )

  $: offsetPoints = generateBarWarpPoints(
    MOCK_VOICE_DATA,
    {
      startX: START_X,
      endX: END_X,
      startY: TOP_BAR_Y,
      endY: BOTTOM_BAR_Y,
    },
    MAX_BAND_HEIGHT
  )

  $: bands = groupBandPoints(barStartPoints, offsetPoints, barEndPoints)
</script>

<svg
  viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
  width={WIDTH}
  height={HEIGHT}
  style:--foreground={DARK ? 'var(--light)' : 'var(--dark)'}
  style:--background={DARK ? 'var(--dark)' : 'var(--light)'}
>
  {#each bands as perimeter}
    <Band {perimeter} subdivisions={BAR_SUBDIVISIONS} />
  {/each}

  <BarLines startX={START_X} endX={END_X} startY={TOP_BAR_Y - 10} endY={BOTTOM_BAR_Y + 10} width={END_WIDTH} />

  <!-- {#each offsetPoints as points}
    <Polyline {points} width={0.2} colour="lime" />
  {/each} -->
</svg>

<style lang="scss">
  svg {
    --dark: rgb(0 0 0);
    --light: rgb(255 255 255);

    width: 100vw;
    height: 100vh;
    padding: 50px;
    background: var(--background);
  }
</style>
