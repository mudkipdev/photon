<script lang="ts">
  import { notifications, profile } from '$lib/auth.svelte'
  import SiteCard from '$lib/components/lemmy/instance/InstanceCard.svelte'
  import { t } from '$lib/i18n/translations'
  import { site } from '$lib/client/lemmy.svelte'
  import { settings } from '$lib/settings.svelte'
  import {
    Badge,
    Button,
    MenuButton,
    MenuDivider,
    modal,
    Spinner,
  } from 'mono-svelte'
  import {
    ArrowLeftOnRectangle,
    Bookmark,
    BugAnt,
    CodeBracketSquare,
    Cog6Tooth,
    Icon,
    Identification,
    Inbox,
    ServerStack,
    ShieldCheck,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
</script>

{#snippet siteSnippet()}
  {#if site.data}
    <SiteCard
      site={site.data.site_view}
      admins={site.data.admins}
      taglines={site.data.taglines}
      version={site.data.version}
    />
  {:else}
    <Spinner />
  {/if}
{/snippet}
{#snippet notifBadge(number: number)}
  {#if number > 0}
    <Badge
      color="red-subtle"
      class="min-w-5 h-5 p-0! px-0.5 grid place-items-center ml-auto"
    >
      {number > 99 ? '∞' : number}
    </Badge>
  {/if}
{/snippet}

{#if profile.current?.jwt}
  <MenuButton href="/profile" icon={UserCircle}>
    {$t('profile.profile')}
  </MenuButton>
    <MenuButton href="/inbox" icon={Inbox}>
    {$t('profile.inbox')}
    {#if $notifications.inbox > 0}
      <Badge color="red-subtle" class="text-xs ml-auto font-bold py-0.5!">
        {$notifications.inbox > 99 ? '∞' : $notifications.inbox}
      </Badge>
    {/if}
  </MenuButton>
  {#if profile.isMod()}
    <MenuButton href="/moderation" icon={ShieldCheck}>
      {$t('routes.moderation.feed')}
      {#snippet suffix()}
        {@render notifBadge($notifications.reports)}
      {/snippet}
    </MenuButton>
  {/if}
  {#if profile.isAdmin}
    <MenuButton href="/admin/applications" icon={ServerStack}>
      {$t('routes.admin.applications.title')}
      {#snippet suffix()}
        {@render notifBadge($notifications.applications)}
      {/snippet}
    </MenuButton>
  {/if}
  <MenuButton href="/saved" icon={Bookmark}>
    {$t('profile.saved')}
  </MenuButton>
{:else}
  <MenuButton href="/accounts/login" icon={ArrowLeftOnRectangle}>
    {$t('account.login')}
  </MenuButton>
  <MenuButton href="/signup" icon={Identification}>
    {$t('account.signup')}
  </MenuButton>
{/if}
<MenuButton href="/accounts" icon={UserGroup}>
  {$t('account.accounts')}
</MenuButton>
<MenuButton href="/settings" icon={Cog6Tooth}>
  {$t('nav.menu.settings')}
</MenuButton>
{#if settings.debugInfo}
  <MenuButton href="/util" icon={BugAnt}>Debug</MenuButton>
{/if}
<li class="flex flex-col px-2 py-1 mx-auto my-1 text-xs w-full">
  <div class="flex flex-row gap-2 w-full items-center">
    <div class="flex-1">
      <Badge color="blue-subtle" class="w-fit">v{__VERSION__}</Badge>
    </div>
    <Button
      onclick={() => {
        modal({
          title: $t('nav.menu.instance'),
          snippet: siteSnippet,
          body: '',
        })
      }}
      color="tertiary"
      title={$t('nav.menu.instance')}
      size="square-md"
    >
      <Icon src={ServerStack} size="16" micro />
    </Button>
    <Button
      color="tertiary"
      href="https://github.com/mudkipdev/rephoton"
      title={$t('nav.menu.source')}
      size="square-md"
    >
      <Icon src={CodeBracketSquare} size="16" micro />
    </Button>
  </div>
</li>
