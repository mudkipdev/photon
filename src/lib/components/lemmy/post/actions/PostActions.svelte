<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import {
    amMod,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import { publishedToDate } from '$lib/components/util/date'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { t } from '$lib/i18n/translations'
  import { save } from '$lib/lemmy/contentview.js'
  import { settings, type View } from '$lib/settings.svelte.js'
  import type { PostView } from '$lib/client/types'
  import { Button, Modal, Spinner, toast } from 'mono-svelte'
  import {
    Bookmark,
    BookmarkSlash,
    BugAnt,
    ChatBubbleOvalLeft,
    ChatBubbleOvalLeftEllipsis,
    DocumentDuplicate,
    Flag,
    Icon,
    Link,
    Share,
    ShieldCheck,
    XMark,
  } from 'svelte-hero-icons'
  import { postLink } from '../helpers'
  import { PostVote } from '..'
  import { instanceToURL } from '$lib/util.svelte'
  import { setSessionStorage } from '$lib/session'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  let saving = $state(false)
  let editing = $state(false)
  let reported = $state(false)

  function share(global: boolean = true) {
    const link = global
      ? post.post.ap_id
      : `${instanceToURL(profile.current.instance)}/post/${post.post.id}`

    if (navigator.share)
      navigator.share?.({
        url: link,
      })
    else {
      navigator.clipboard.writeText(link)
      toast({ content: $t('toast.copied') })
    }
  }

  interface Props {
    post: PostView
    view?: View
    debug?: boolean
    style?: string
    onedit?: (post: PostView) => void
    onhide?: (hide: boolean) => void
  }

  let {
    post = $bindable(),
    view = 'cozy',
    debug = $bindable(false),
    style = '',
    onedit,
    onhide,
  }: Props = $props()
  let buttonHeight = $derived(view == 'compact' ? 'h-7.5' : 'h-8')
  let buttonSquare = $derived(view == 'compact' ? 'w-7.5 h-7.5' : 'w-8 h-8')

  // Check if we're on the post page (to hide comment button)
  let isOnPostPage = $derived($page.url.pathname.includes(`/post/${post.post.id}`))
</script>

{#if editing}
  <Modal bind:open={editing}>
    {#snippet customTitle()}
      <h1 class="text-2xl font-bold">{$t('form.edit')}</h1>
    {/snippet}
    {#await import('../form/PostForm.svelte')}
      <div class="mx-auto h-96 flex justify-center items-center">
        <Spinner width={32} />
      </div>
    {:then { default: PostForm }}
      <PostForm
        edit
        editingPost={post.post}
        onsubmit={(e) => {
          editing = false
          post = e
          onedit?.(e)
        }}
        passedData={{
          body: post.post.body,
          title: post.post.name,
          community: null,
          flair_list: post.flair_list?.map((i) => i.id) ?? [],
          image: null,
          loading: false,
          nsfw: post.post.nsfw,
        }}
      >
        {#snippet formtitle()}
          <!-- Have the title not exist at all -->
        {/snippet}
      </PostForm>
    {/await}
  </Modal>
{/if}

<footer
  class={[
    'flex flex-row gap-2 items-center shrink-0 text-slate-600 dark:text-zinc-400',
    buttonHeight,
  ]}
  class:flex-row-reverse={settings.posts.reverseActions}
  {style}
>
  <PostVote
    post={post.post}
    bind:vote={post.my_vote}
    bind:score={post.counts.score}
    bind:upvotes={post.counts.upvotes}
    bind:downvotes={post.counts.downvotes}
  />

  {#if !isOnPostPage}
    <Button
      size="custom"
      href="{postLink(post.post)}#comments"
      class="text-inherit! h-full px-3 relative"
      color="ghost"
      rounding="md"
      target={settings.openLinksInNewTab ? '_blank' : ''}
      aria-label={$t('post.actions.comments')}
    >
      {@const newComment =
        publishedToDate(post.counts.newest_comment_time).getTime() >
        new Date().getTime() - 5 * 60 * 1000}
      <Icon
        src={newComment ? ChatBubbleOvalLeftEllipsis : ChatBubbleOvalLeft}
        size="16"
        mini
      />
      <FormattedNumber number={post.counts.comments} />
    </Button>
  {/if}
  <div class="flex items-center">
    {#if settings.debugInfo}
      {#if debug}
        {#await import('$lib/components/util/debug/DebugObject.svelte') then { default: DebugObject }}
          <DebugObject object={post} bind:open={debug} />
        {/await}
      {/if}
      <Button
        onclick={() => (debug = true)}
        title="Debug"
        size="custom"
        color="ghost"
        rounding="md"
        class="{buttonSquare} rounded-r-none border-r-0"
        icon={BugAnt}
      ></Button>
    {/if}
    {#if profile.current?.user && (amMod(profile.current.user, post.community) || isAdmin(profile.current.user))}
      {#await import('$lib/components/lemmy/moderation/ModerationMenu.svelte') then { default: ModerationMenu }}
        <ModerationMenu bind:item={post}>
          {#snippet target(attachment, acting)}
            <Button
              {@attach attachment}
              size="custom"
              color="ghost"
              rounding="md"
              loading={acting}
              class="{buttonSquare} {settings.debugInfo ? 'rounded-none' : 'rounded-l-none'} border-r-0"
            >
              <Icon src={ShieldCheck} size="18" mini />
            </Button>
          {/snippet}
        </ModerationMenu>
      {/await}
    {/if}

    <Button
      onclick={() => share()}
      size="custom"
      class="{buttonSquare} {settings.debugInfo || (profile.current?.user && (amMod(profile.current.user, post.community) || isAdmin(profile.current.user))) ? 'rounded-none' : 'rounded-l-md'} {profile.current?.jwt ? 'border-r-0' : 'rounded-r-md'}"
      color="ghost"
      rounding="none"
      title={$t('post.actions.more.share')}
      icon={Link}
    ></Button>

    {#if profile.current?.jwt}
      <Button
        onclick={async () => {
          if (!profile.current?.jwt) return
          saving = true
          post.saved = await save(post, !post.saved)
          saving = false
        }}
        size="custom"
        class="{buttonSquare} rounded-none border-r-0"
        color="ghost"
        rounding="none"
        loading={saving}
        disabled={saving}
        title={post.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
        icon={post.saved ? BookmarkSlash : Bookmark}
      ></Button>

      <!-- does anyone actually use this lmao? -->

      <!-- <Button
        onclick={async () => {
          if (!profile.current?.jwt) return
          post.read = await markAsRead(post.post, !post.read)
        }}
        size="custom"
        class="{buttonSquare} rounded-none border-r-0"
        color="ghost"
        rounding="none"
        title={post.read ? $t('post.actions.more.markUnread') : $t('post.actions.more.markRead')}
        icon={post.read ? EyeSlash : Eye}
      ></Button> -->

      <Button
        onclick={() => {
          setSessionStorage('postDraft', {
            body: `${
              settings.crosspostOriginalLink
                ? `cross-posted from: ${post.post.ap_id}`
                : ``
            }\n${
              post.post.body ? '>' + post.post.body.split('\n').join('\n> ') : ''
            }`,
            url: post.post.url,
            title: post.post.name,
            loading: false,
            nsfw: post.post.nsfw,
            community: null,
            image: null,
          })
          goto('/create/post?crosspost=true')
        }}
        size="custom"
        class="{buttonSquare} {profile.current.user?.local_user_view.person.id == post.creator.id ? 'rounded-l-none rounded-r-md' : 'rounded-none border-r-0'}"
        color="ghost"
        rounding="none"
        title={$t('post.actions.more.crosspost')}
        icon={DocumentDuplicate}
      ></Button>
    {/if}

    <!-- Hide button - for non-creators when logged in -->
    {#if profile.current?.jwt && profile.current.user?.local_user_view.person.id != post.creator.id}
      <Button
        onclick={async () => {
          if (!profile.current?.jwt) return
          const { hidePost } = await import('../helpers')
          const hidden = await hidePost(
            post.post.id,
            !post.hidden,
            profile.current?.jwt,
          )
          post.hidden = hidden
          if (hidden) onhide?.(hidden)
        }}
        size="custom"
        class="{buttonSquare} rounded-none border-r-0"
        color="ghost"
        rounding="none"
        title={post.hidden ? $t('post.actions.more.unhide') : $t('post.actions.more.hide')}
        icon={XMark}
      ></Button>

      <!-- Report button - for non-creators when logged in -->
      <Button
        onclick={async () => {
          const { report, modals } = await import('../../moderation/moderation')
          
          // Listen for when the modal closes
          let modalWasOpen = false
          const unsubscribe = modals.subscribe((m) => {
            if (m.reporting.open && m.reporting.item === post) {
              modalWasOpen = true
            } else if (!m.reporting.open && modalWasOpen) {
              // Modal closed and it was open for this post
              // We'll assume success since ReportModal shows success toast on success
              // and this is the only clean way to detect successful submission
              reported = true
              unsubscribe()
            }
          })
          
          report(post)
        }}
        size="custom"
        class="{buttonSquare} rounded-l-none rounded-r-md"
        color="ghost"
        rounding="none"
        style={reported ? 'background-color: rgb(239 68 68) !important; color: white !important;' : ''}
        title={reported ? $t('moderation.reported') : $t('moderation.report')}
        icon={Flag}
      ></Button>
    {/if}
  </div>
</footer>
