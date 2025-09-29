<script lang="ts">
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { t } from '$lib/i18n/translations'
  import { userLink } from '$lib/util.svelte'
  import { settings } from '$lib/settings.svelte'
  import type { PersonView, SiteView, Tagline } from '$lib/client/types'
  import { Badge } from 'mono-svelte'
  import {
    BuildingOffice,
    Flag,
    Icon,
    Megaphone,
    Newspaper,
    ServerStack,
  } from 'svelte-hero-icons'
  import type { ClassValue, HTMLAttributes } from 'svelte/elements'
  import EndPlaceholder from '../../ui/EndPlaceholder.svelte'
  import Expandable from '../../ui/Expandable.svelte'
  import LabelStat from '../../ui/LabelStat.svelte'
  import SidebarButton from '../../ui/sidebar/SidebarButton.svelte'
  import ItemList from '../generic/ItemList.svelte'
  import { optimizeImageURL } from '../post/helpers'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    site: SiteView
    taglines?: Tagline[]
    admins?: PersonView[]
    version?: string
    class?: ClassValue
  }

  let {
    site,
    taglines = undefined,
    admins = undefined,
    version = undefined,
    class: clazz = '',
  }: Props = $props()
</script>

<aside
  class={[
    'w-full text-slate-600 dark:text-zinc-400 flex flex-col gap-4 text-sm',
    clazz,
  ]}
>
  {#if site.site.banner}
    <div class="rounded-xl bg-slate-100 dark:bg-zinc-925">
      <img
        src={optimizeImageURL(site.site.banner, 512)}
        alt="Site banner"
        class="h-32 object-cover w-full"
        style="border-radius: inherit;"
      />
    </div>
  {/if}
  <div class="mx-3 space-y-3">
    <Avatar width={32} url={site.site.icon} alt="" circle={false} />
    <h2 class="font-medium text-lg -my-2">{site.site.name}</h2>
  </div>
  <div class="flex flex-col gap-2">
    {#if taglines && taglines.length > 0}
      <Markdown
        class="pt-0! mx-3"
        source={taglines[Math.floor(Math.random() * taglines.length)].content}
      />
    {/if}

    <div class="flex flex-row gap-4 flex-wrap px-3">
      <LabelStat
        label={$t('content.users')}
        content={site.counts.users.toString()}
        formatted
      />
      <LabelStat
        label={$t('content.communities')}
        content={site.counts.communities.toString()}
        formatted
      />
    </div>

    <EndPlaceholder size="xs" margin="sm">
      {$t('nav.menu.instance')}
    </EndPlaceholder>
    <SidebarButton
      href="/modlog"
      label={$t('routes.modlog.title')}
      icon={Megaphone}
    />
    <SidebarButton
      href="/legal"
      label={$t('routes.legal.title')}
      icon={Newspaper}
    />
    <SidebarButton
      href="/instances"
      label={$t('routes.instances')}
      icon={ServerStack}
    />

    {#if admins}
      <EndPlaceholder size="xs" margin="sm">
        {$t('cards.site.admins')}
      </EndPlaceholder>
      <div class="px-1.5">
        <ItemList
          items={admins.map((i) => ({
            id: i.person.id,
            name: i.person.display_name || i.person.name,
            url: userLink(i.person),
            avatar: i.person.avatar,
            instance: new URL(i.person.actor_id).hostname,
          }))}
        />
      </div>
    {/if}

    <EndPlaceholder size="xs" margin="sm">
      {$t('cards.site.about')}
    </EndPlaceholder>
    <div class="space-y-3 px-1.5 text-sm">
      <Markdown source={site.site.description} />
      <div class="my-4"></div>
      <Markdown source={site.site.sidebar} />

      {#if version}
        <div class="w-max">
          <Badge label="Lemmy version">
            <Icon src={ServerStack} micro size="14" />
            v{version}
          </Badge>
        </div>
      {/if}
    </div>
  </div>
</aside>
