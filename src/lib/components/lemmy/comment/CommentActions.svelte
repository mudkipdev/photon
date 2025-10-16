<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import type { CommentView } from '$lib/client/types'
  import CommentModerationMenu from '$lib/components/lemmy/moderation/CommentModerationMenu.svelte'
  import { report } from '$lib/components/lemmy/moderation/moderation.js'
  import { t } from '$lib/i18n/translations'
  import { deleteItem, save } from '$lib/lemmy/contentview.js'
  import { settings } from '$lib/settings.svelte'
  import { Button, toast } from 'mono-svelte'
  import {
    Bookmark,
    BookmarkSlash,
    ChatBubbleOvalLeft,
    Flag,
    Icon,
    PencilSquare,
    Share,
    Trash,
  } from 'svelte-hero-icons'
  import { CommentVote } from '.'

  interface Props {
    comment: CommentView
    replying?: boolean
    disabled?: boolean
    onedit?: (comment: CommentView) => void
  }

  let {
    comment = $bindable(),
    replying = $bindable(false),
    disabled = false,
    onedit,
  }: Props = $props()

  let saving = $state(false)

  function share() {
    if (navigator.share)
      navigator.share?.({
        url: comment.comment.ap_id,
      })
    else {
      navigator.clipboard.writeText(comment.comment.ap_id)
      toast({ content: $t('toast.copied') })
    }
  }
</script>

<div
  class={[
    'flex flex-row items-center gap-0.5 h-7 w-full',
    settings.posts.reverseActions && 'flex-row-reverse',
  ]}
>
  <CommentVote
    upvotes={comment.counts.upvotes}
    downvotes={comment.counts.downvotes}
    vote={comment.my_vote}
    comment={comment.comment}
  />
  {#if !(comment.post.locked || disabled || !profile.current.jwt)}
    <Button
      color="tertiary"
      rounding="md"
      size="xs"
      class="text-slate-500 dark:text-zinc-400 gap-1! h-7"
      onclick={() => (replying = !replying)}
      icon={ChatBubbleOvalLeft}
    >
      {$t('comment.reply')}
    </Button>
  {/if}
  {#if profile.current?.jwt && (profile.isMod(comment.community) || profile.isAdmin)}
    <CommentModerationMenu bind:item={comment} />
  {/if}
  {#if profile.current?.jwt}
    <div class="flex items-center">
      <Button
        onclick={() => share()}
        size="custom"
        class="h-7 px-2 rounded-l-md rounded-r-none border border-r-0 border-slate-300 dark:border-zinc-600 text-slate-500 dark:text-zinc-500 bg-transparent hover:bg-transparent"
        color="ghost"
        rounding="none"
        title={$t('post.actions.more.share')}
      >
        <Icon src={Share} size="14" mini />
      </Button>

      <Button
        onclick={async () => {
          if (!profile.current?.jwt) return
          saving = true
          comment.saved = await save(comment, !comment.saved)
          saving = false
        }}
        size="custom"
        class="h-7 px-2 rounded-none border border-r-0 border-slate-300 dark:border-zinc-600 text-slate-500 dark:text-zinc-500 bg-transparent hover:bg-transparent"
        color="ghost"
        rounding="none"
        loading={saving}
        disabled={saving}
        title={comment.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
      >
        <Icon src={comment.saved ? BookmarkSlash : Bookmark} size="14" mini />
      </Button>

      {#if comment.creator.id == profile.current.user?.local_user_view.person.id}
        <Button
          onclick={() => onedit?.(comment)}
          size="custom"
          class="h-7 px-2 rounded-none border border-r-0 border-slate-300 dark:border-zinc-600 text-slate-500 dark:text-zinc-500 bg-transparent hover:bg-transparent"
          color="ghost"
          rounding="none"
          title={$t('post.actions.more.edit')}
        >
          <Icon src={PencilSquare} size="14" mini />
        </Button>

        <Button
          onclick={async () => {
            if (profile.current?.jwt)
              comment.comment.deleted = await deleteItem(
                comment,
                !comment.comment.deleted,
              )
          }}
          size="custom"
          class="h-7 px-2 rounded-l-none rounded-r-md border border-slate-300 dark:border-zinc-600 text-slate-500 dark:text-zinc-500 bg-transparent hover:bg-transparent"
          color="ghost"
          rounding="none"
          title={comment.comment.deleted ? $t('post.actions.more.restore') : $t('post.actions.more.delete')}
        >
          <Icon src={Trash} size="14" mini />
        </Button>
      {:else}
        <Button
          onclick={() => report(comment)}
          size="custom"
          class="h-7 px-2 rounded-l-none rounded-r-md border border-slate-300 dark:border-zinc-600 text-slate-500 dark:text-zinc-500 bg-transparent hover:bg-transparent"
          color="ghost"
          rounding="none"
          title={$t('moderation.report')}
        >
          <Icon src={Flag} size="14" mini />
        </Button>
      {/if}
    </div>
  {/if}
  <div class="flex-1 w-full"></div>
</div>
