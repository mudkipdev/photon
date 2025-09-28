<script lang="ts">
  import { page } from '$app/state'
  import { Header } from '$lib/components/ui/layout'
  import Pageination from '$lib/components/ui/layout/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations'
  import { searchParam } from '$lib/util.svelte'
  import { Option, Select } from 'mono-svelte'
  import { ClipboardDocumentCheck, Funnel, Icon } from 'svelte-hero-icons'
  import Application from './Application.svelte'

  let { data } = $props()

  let selectForm = $state<HTMLFormElement>()
</script>

<Header pageHeader>{$t('routes.admin.applications.title')}</Header>
<form bind:this={selectForm} action="/admin/applications" class="w-max">
  <Select
    bind:value={data.type.value}
    onchange={async () => {
      searchParam(page.url, 'type', data.type.value, 'page')
    }}
  >
    {#snippet customLabel()}
      <span class="flex items-center gap-1">
        <Icon src={Funnel} size="15" mini />
        {$t('filter.filter')}
      </span>
    {/snippet}
    <Option value="all">{$t('filter.location.all')}</Option>
    <Option value="unread">{$t('filter.unread')}</Option>
  </Select>
</form>
{#if data.applications?.value && data.applications?.value.length > 0}
  <div class="flex flex-col gap-4">
    {#each data.applications?.value as application (application.registration_application.id)}
      <Application {application} />
    {/each}
  </div>
  {#if data.applications?.value.length >= 40}
    <div class="mt-auto">
      <Pageination page={data.page} href={(page) => `?page=${page}`} />
    </div>
  {/if}
{:else}
  <Placeholder
    icon={ClipboardDocumentCheck}
    title={$t('routes.admin.applications.empty.title')}
    description={$t('routes.admin.applications.empty.description')}
  />
{/if}
