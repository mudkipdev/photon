import { getClient } from '$lib/client/lemmy.svelte'
import { ReactiveState } from '$lib/util.svelte.js'

export async function load({ fetch, url }) {
  const page = Number(url.searchParams.get('page')) || 1
  const type = url.searchParams.get('type') || 'unread'

  const res = await getClient(undefined, fetch).listRegistrationApplications({
    page: page,
    limit: 40,
    unread_only: type == 'all',
  })

  return {
    page: page,
    applications: new ReactiveState(res.registration_applications),
    type: new ReactiveState(type),
  }
}
