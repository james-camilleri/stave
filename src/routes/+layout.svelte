<script lang="ts">
  import Download from '@fortawesome/fontawesome-free/svgs/solid/download.svg'
  import Moon from '@fortawesome/fontawesome-free/svgs/solid/moon.svg'
  import Play from '@fortawesome/fontawesome-free/svgs/solid/play.svg'
  import Sun from '@fortawesome/fontawesome-free/svgs/solid/sun.svg'

  import { darkMode, playing } from './config'

  let link: HTMLAnchorElement
  let downloads = 0

  function toggle() {
    $darkMode = !$darkMode
  }

  function play() {
    $playing = true
  }

  function download() {
    const svg = document.getElementById('svg')

    if (!svg || !link) return

    const svgText = svg.outerHTML
      .replaceAll('style="d: path(&quot;', 'd="')
      .replaceAll('&quot;);', '')
      .replaceAll(/class=".*?"/g, '')
      .replaceAll(/var\(--foreground\)/g, '#000000')
      .replaceAll(/var\(--background\)/g, '#ffffff')

    downloads++
    const blob = new Blob([svgText], { type: 'image/svg+xml' })
    const url = window.URL.createObjectURL(blob)

    link.target = '_blank'
    link.download = `generated_${downloads}.svg`
    link.href = url
    link.click()
  }
</script>

<div class="dark-toggle icon" on:click={toggle} style:color={$darkMode ? 'rgb(255 255 255)' : 'rgb(0 0 0)'}>
  {#if $darkMode}
    <Sun />
  {:else}
    <Moon />
  {/if}
</div>
{#if !$playing}
  <div class="play icon" on:click={play} style:color={$darkMode ? 'rgb(255 255 255)' : 'rgb(0 0 0)'}>
    <Play />
  </div>
{/if}
<slot />
<div class="download icon" on:click={download} style:color={$darkMode ? 'rgb(255 255 255)' : 'rgb(0 0 0)'}>
  <Download />
</div>
<a class="link" bind:this={link} />

<style>
  .icon {
    position: fixed;
    width: 1.5em;
    height: 1.5em;
    color: rgb(255 255 255);
    cursor: pointer;
  }

  .dark-toggle {
    top: 1.5em;
    right: 2em;
  }

  .play {
    top: 1.5em;
    right: 5em;
  }

  .download {
    right: 2em;
    bottom: 1.5em;
  }

  .link {
    display: none;
  }
</style>
