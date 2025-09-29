<script lang="ts">
  import { notifications, profile } from '$lib/auth.svelte.js'
  import ItemList from '$lib/components/lemmy/generic/ItemList.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import { t } from '$lib/i18n/translations'
  import { communityLink } from '$lib/util.svelte'
  import { settings } from '$lib/settings.svelte.js'
  import { theme } from '$lib/ui/theme/theme.svelte'
  import { Badge, Option, Select } from 'mono-svelte'
  import {
    ArrowLeftOnRectangle,
    Bookmark,
    ChevronUpDown,
    Cog6Tooth,
    ComputerDesktop,
    Icon,
    Identification,
    Inbox,
    Moon,
    Sun,
    Swatch,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import type { ClassValue } from 'svelte/elements'
  import EndPlaceholder from '../EndPlaceholder.svelte'
  import ProfileSelection from './ProfileSelection.svelte'
  import Logo from '../Logo.svelte'
  import { env } from '$env/dynamic/public'
  import Link from '$lib/components/input/Link.svelte'

  interface Props {
    style?: string
    class?: ClassValue
  }

  let { style = '', class: clazz = '' }: Props = $props()
</script>

<nav
  aria-label={$t('aria.sidebar.title')}
  class={['flex flex-col overflow-auto gap-1', clazz]}
  {style}
>
  {#if profile.current?.user}
    <div class="space-y-3">
      {#if profile.current?.user.moderates.length > 0}
        <Expandable class="px-1.5" bind:open={settings.expand.moderates}>
          {#snippet title()}
            <span class="px-2 py-1 w-full">
              <EndPlaceholder border={false}>
                {$t('routes.profile.moderates')}
              </EndPlaceholder>
            </span>
          {/snippet}
          <ItemList
            items={profile.current.user.moderates.map((i) => ({
              id: i.community.id,
              name: i.community.title,
              url: communityLink(i.community),
              avatar: i.community.icon,
              instance: new URL(i.community.actor_id).hostname,
            }))}
          />
        </Expandable>
      {/if}

      {#if profile.current.user.follows.length > 0}
        <Expandable class="px-1.5" bind:open={settings.expand.communities}>
          {#snippet title()}
            <span class="px-2 py-1 w-full">
              <EndPlaceholder border={false}>
                {$t('profile.subscribed')}
              </EndPlaceholder>
            </span>
          {/snippet}

          <ItemList
            items={profile.current.user.follows.map((i) => ({
              id: i.community.id,
              name: i.community.title,
              url: communityLink(i.community),
              avatar: i.community.icon,
              instance: new URL(i.community.actor_id).hostname,
            }))}
          />
        </Expandable>
      {:else}
        <div class="px-3.5 py-2 text-slate-600 dark:text-zinc-400 text-sm">
          {$t('profile.noSubscriptions')}
        </div>
      {/if}
    </div>
  {/if}

  <div class="flex-1 h-full mt-auto"></div>

  <footer
    class="flex gap-6 flex-col xl:flex-row text-sm text-slate-600 dark:text-zinc-300 flex-wrap"
  >
    <div class="flex items-center gap-2">
      <Logo width={20} />
      <span class="font-medium">
        v{__VERSION__}
      </span>
    </div>
    <Link highlight href="https://github.com/mudkipdev/rephoton">
      {$t('nav.menu.source')}
    </Link>
  </footer>
</nav>
