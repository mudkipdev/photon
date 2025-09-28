<script lang="ts">
  import type { Snippet } from 'svelte'
  import { expoOut } from 'svelte/easing'
  import type { ClassValue } from 'svelte/elements'
  import { slide } from 'svelte/transition'

  interface Props {
    open?: boolean
    class?: ClassValue
    summary?: Snippet<[{ open: boolean }]>
    extended?: Snippet
    children?: Snippet<[{ open: boolean }]>
  }

  let {
    open = $bindable(false),
    class: clazz = '',
    summary,
    extended,
    children,
    ...rest
  }: Props = $props()
</script>

<div {...rest} class={['w-full', clazz]}>
  <button onclick={() => (open = !open)} class="w-full">
    {@render summary?.({ open })}
  </button>
  {@render extended?.()}
  <div class="expand" inert={!open}>
    {@render children?.({ open })}
  </div>
</div>

<style>
  .expand {
    display: grid;
    grid-template-rows: 0fr;
    grid-template-columns: 100%;
    overflow: hidden;
    transition: grid-template-rows 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .expand > :global(*) {
    min-height: 0;
  }
</style>
