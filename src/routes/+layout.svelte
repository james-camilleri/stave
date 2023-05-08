<script lang="ts">
  import Moon from '@fortawesome/fontawesome-free/svgs/solid/moon.svg'
  import Play from '@fortawesome/fontawesome-free/svgs/solid/play.svg'
  import Sun from '@fortawesome/fontawesome-free/svgs/solid/sun.svg'

  import { darkMode, playing } from './config'

  function toggle() {
    $darkMode = !$darkMode
  }

  function play() {
    $playing = true
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

<style>
  .icon {
    position: fixed;
    top: 1.5em;
    width: 1.5em;
    height: 1.5em;
    color: rgb(255 255 255);
    cursor: pointer;
  }

  .dark-toggle {
    right: 2em;
  }

  .play {
    right: 5em;
  }
</style>
