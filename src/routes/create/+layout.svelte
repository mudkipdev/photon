<script lang="ts">
  import { profile } from '$lib/auth.svelte'
  import { site } from '$lib/client/lemmy.svelte'
  import { Header } from '$lib/components/ui/layout'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { t } from '$lib/i18n/translations'

  let { children } = $props()
</script>

<Header pageHeader>
  {$t('nav.create.label')}
  {#snippet extended()}
    {#if !site || !(site.data?.site_view.local_site.community_creation_admin_only && !profile.isAdmin)}
      <Tabs
        margin={false}
        style="subpage"
        routes={[
          {
            href: '/create/post',
            name: $t('nav.create.post'),
          },
          {
            href: '/create/community',
            name: $t('nav.create.community'),
          },
        ]}
      />
    {/if}
  {/snippet}
</Header>

{@render children?.()}
