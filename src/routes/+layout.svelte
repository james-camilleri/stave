<script lang="ts">
  import Moon from '@fortawesome/fontawesome-free/svgs/solid/moon.svg'
  import Sun from '@fortawesome/fontawesome-free/svgs/solid/sun.svg'

  import { darkMode } from './config'

  function toggle() {
    $darkMode = !$darkMode
  }
</script>

<div class="dark-toggle" on:click={toggle} style:color={$darkMode ? 'rgb(255 255 255)' : 'rgb(0 0 0)'}>
  {#if $darkMode}
    <Sun />
  {:else}
    <Moon />
  {/if}
</div>
<slot />

<style>
  .dark-toggle {
    position: fixed;
    top: 1.5em;
    right: 2em;
    width: 1.5em;
    height: 1.5em;
    color: rgb(255 255 255);
    cursor: pointer;
  }
</style>
