<script lang="ts">
  import { Disclosure } from 'mono-svelte'
  import { ChevronRight, ChevronDown, Icon } from 'svelte-hero-icons'
  import type { ClassValue } from 'svelte/elements'
  interface Props {
    open?: boolean
    icon?: boolean
    class?: ClassValue
    title?: import('svelte').Snippet<[boolean | undefined]>
    extended?: import('svelte').Snippet
    content?: import('svelte').Snippet
    children?: import('svelte').Snippet
  }

  let {
    open = $bindable(false),
    icon = true,
    class: clazz = '',
    title,
    extended,
    content,
    children,
  }: Props = $props()
</script>

<Disclosure {extended} bind:open class={['gap-2', clazz]}>
  {#snippet summary()}
    <div
      class={[
        'font-medium w-full text-left flex flex-row items-center gap-1 h-full z-0 group relative cursor-pointer',
      ]}
    >
      {#if icon}
        <div
          class={[
            'transition-all duration-300 ease-out',
            'rounded-full p-2 -m-2',
            open ? 'rotate-90' : 'rotate-0',
          ]}
        >
          <Icon src={ChevronRight} size="18" micro class={['transition-transform duration-300 ease-out text-slate-600 dark:text-zinc-400']} />
        </div>
      {/if}
      <div class="flex flex-row gap-0.5 items-center w-full">
        {@render title?.(open)}
      </div>
    </div>
  {/snippet}
  {#if content}{@render content()}{:else}
    <div class="pt-2 text-slate-900 dark:text-zinc-100">
      {@render children?.()}
    </div>
  {/if}
</Disclosure>
