<script lang="ts">
  import 'sanitize.css'

  import type { VoiceGroupData } from '../lib/types'

  import { PitchDetector } from 'pitchy'
  import { onMount } from 'svelte'

  import alto from '$lib/audio/alto.mp3'
  import bass from '$lib/audio/bass.mp3'
  import soprano from '$lib/audio/soprano.mp3'
  import tenor from '$lib/audio/tenor.mp3'
  import AltoShape from '$lib/components/AltoShape.svelte'
  import Band from '$lib/components/Band.svelte'
  import BarLines from '$lib/components/BarLines.svelte'
  import BassShape from '$lib/components/BassShape.svelte'
  import Polyline from '$lib/components/Polyline.svelte'
  import SopranoShape from '$lib/components/SopranoShape.svelte'
  import TenorShape from '$lib/components/TenorShape.svelte'
  import { generateBarWarpPoints, groupBandPoints } from '$lib/utils/audio-processing'

  import { midpoint, subdivide } from '../lib/utils/svg'

  import { darkMode, playing } from './config'

  let altoPlayer: HTMLAudioElement
  let bassPlayer: HTMLAudioElement
  let tenorPlayer: HTMLAudioElement
  let sopranoPlayer: HTMLAudioElement

  async function play() {
    await Promise.all([bassPlayer.play(), tenorPlayer.play(), altoPlayer.play(), sopranoPlayer.play()])
  }

  $: if ($playing) {
    void play()
  }

  let voiceData: VoiceGroupData[] = [
    {
      type: 'bass',
      highestFrequency: 0,
      lowestFrequency: Number.POSITIVE_INFINITY,
      activeTime: 0,
      uniqueNotes: new Set<string>(),
    },
    {
      type: 'tenor',
      highestFrequency: 0,
      lowestFrequency: Number.POSITIVE_INFINITY,
      activeTime: 0,
      uniqueNotes: new Set<string>(),
    },
    {
      type: 'alto',
      highestFrequency: 0,
      lowestFrequency: Number.POSITIVE_INFINITY,
      activeTime: 0,
      uniqueNotes: new Set<string>(),
    },
    {
      type: 'soprano',
      highestFrequency: 0,
      lowestFrequency: Number.POSITIVE_INFINITY,
      activeTime: 0,
      uniqueNotes: new Set<string>(),
    },
  ]

  onMount(async () => {
    const audioContext = new AudioContext()
    const analyserNodes = [
      audioContext.createAnalyser(),
      audioContext.createAnalyser(),
      audioContext.createAnalyser(),
      audioContext.createAnalyser(),
    ]

    const bassTrack = audioContext.createMediaElementSource(bassPlayer).connect(analyserNodes[0])
    const tenorTrack = audioContext.createMediaElementSource(tenorPlayer).connect(analyserNodes[1])
    const altoTrack = audioContext.createMediaElementSource(altoPlayer).connect(analyserNodes[2])
    const sopranoTrack = audioContext.createMediaElementSource(sopranoPlayer).connect(analyserNodes[3])

    altoTrack.connect(audioContext.destination)
    bassTrack.connect(audioContext.destination)
    tenorTrack.connect(audioContext.destination)
    sopranoTrack.connect(audioContext.destination)

    const detectors = analyserNodes.map((node) => PitchDetector.forFloat32Array(node.fftSize))
    const inputs = detectors.map((detector) => new Float32Array(detector.inputLength))

    window.setInterval(() => {
      analyserNodes.forEach((analyserNode, i) => {
        analyserNode.getFloatTimeDomainData(inputs[i])
        const [pitch, clarity] = detectors[i].findPitch(inputs[i], audioContext.sampleRate)

        // Filter out sounds below 100Hz, they're probably some kind of bug.
        if (clarity > 0.95 && pitch > 100) {
          voiceData[i].highestFrequency = Math.max(voiceData[i].highestFrequency, pitch)
          voiceData[i].lowestFrequency = Math.min(voiceData[i].lowestFrequency, pitch)
          voiceData[i].activeTime += 1
          voiceData[i].uniqueNotes.add(pitch.toFixed(0))
        }
      })
    }, 200)
  })

  /////////////////////////////////////////////////////////////////////////////

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
  const DEBUG = false

  const MOCK_VOICE_DATA: VoiceGroupData[] = [
    {
      type: 'bass',
      highestFrequency: 300.26289529572955,
      lowestFrequency: 110.01306271534635,
      activeTime: 274,
      uniqueNotes: {
        size: 82,
      },
    },
    {
      type: 'tenor',
      highestFrequency: 449.26482586190343,
      lowestFrequency: 146.782990681331,
      activeTime: 534,
      uniqueNotes: {
        size: 84,
      },
    },
    {
      type: 'alto',
      highestFrequency: 527.6723547247535,
      lowestFrequency: 108.32927221336992,
      activeTime: 526,
      uniqueNotes: {
        size: 132,
      },
    },
    {
      type: 'soprano',
      highestFrequency: 666.7805273720568,
      lowestFrequency: 127.11953908959727,
      activeTime: 389,
      uniqueNotes: {
        size: 146,
      },
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
    // voiceData,
    MOCK_VOICE_DATA,
    {
      startX: START_X,
      endX: END_X,
      startY: TOP_BAR_Y,
      endY: BOTTOM_BAR_Y,
    },
    MAX_BAND_HEIGHT
  )
  // $: console.log(voiceData)

  $: bands = groupBandPoints(barStartPoints, offsetPoints, barEndPoints)
</script>

<svg
  viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
  width={WIDTH}
  height={HEIGHT}
  style:--foreground={$darkMode ? 'var(--light)' : 'var(--dark)'}
  style:--background={$darkMode ? 'var(--dark)' : 'var(--light)'}
>
  {#each bands as perimeter}
    <Band {perimeter} subdivisions={BAR_SUBDIVISIONS} />
  {/each}

  <BassShape
    top={offsetPoints[0][0]}
    bottom={offsetPoints[0][1]}
    bandStart={midpoint(barStartPoints[0], barStartPoints[1])}
    bandEnd={midpoint(barEndPoints[0], barEndPoints[1])}
    notes={MOCK_VOICE_DATA[0].uniqueNotes.size}
  />
  <TenorShape
    top={offsetPoints[2][0]}
    bottom={offsetPoints[2][1]}
    bandStart={midpoint(barStartPoints[2], barStartPoints[3])}
    bandEnd={midpoint(barEndPoints[2], barEndPoints[3])}
    notes={MOCK_VOICE_DATA[1].uniqueNotes.size}
  />
  <SopranoShape
    top={offsetPoints[1][0]}
    bottom={offsetPoints[1][1]}
    bandStart={midpoint(barStartPoints[1], barStartPoints[2])}
    bandEnd={midpoint(barEndPoints[1], barEndPoints[2])}
    notes={MOCK_VOICE_DATA[3].uniqueNotes.size}
  />
  <AltoShape
    top={offsetPoints[3][0]}
    bottom={offsetPoints[3][1]}
    bandStart={midpoint(barStartPoints[3], barStartPoints[4])}
    bandEnd={midpoint(barEndPoints[3], barEndPoints[4])}
    notes={MOCK_VOICE_DATA[2].uniqueNotes.size}
  />

  <BarLines startX={START_X} endX={END_X} startY={TOP_BAR_Y - 10} endY={BOTTOM_BAR_Y + 10} width={END_WIDTH} />

  {#if DEBUG}
    {#each offsetPoints as points}
      <Polyline {points} width={0.2} colour="lime" />
    {/each}
  {/if}
</svg>

<audio bind:this={altoPlayer} src={alto} />
<audio bind:this={bassPlayer} src={bass} />
<audio bind:this={tenorPlayer} src={tenor} />
<audio bind:this={sopranoPlayer} src={soprano} />

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
