<script lang='ts'>
  import { onMount } from 'svelte'
  import { AppBar, Progress, Switch } from '@skeletonlabs/skeleton-svelte'
  import Moon from 'lucide-svelte/icons/moon'
  import Sun from 'lucide-svelte/icons/sun'
  import SectionForm from './components/SectionForm.svelte'
  import { fetchSectionFeed } from './services/rss'
  import { SECTION_OPTIONS, type RssItem, type SectionId, type ViewStatus } from './types/rss'

  let selectedSection = $state<SectionId>('HomePage')
  let isDarkMode = $state(false)
  let expandedLink = $state<string | null>(null)
  let items = $state<RssItem[]>([])
  let status = $state<ViewStatus>('idle')
  let errorMessage = $state('')

  function setColorMode(isDark: boolean) {
    isDarkMode = isDark
    localStorage.setItem('color-mode', isDark ? 'dark' : 'light')
  }

  onMount(() => {
    const savedMode = localStorage.getItem('color-mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setColorMode(savedMode ? savedMode === 'dark' : prefersDark)
  })

  function isItemExpanded(link: string): boolean {
    return expandedLink === link
  }

  function setItemExpanded(link: string, open: boolean) {
    expandedLink = open ? link : expandedLink === link ? null : expandedLink
  }

  function getVisibleCategories(categories: string[]): string[] {
    return categories.slice(0, 2)
  }

  function getHiddenCategoryCount(categories: string[]): number {
    return Math.max(categories.length - 2, 0)
  }

  function truncateCategory(category: string): string {
    return category.length > 10 ? `${category.slice(0, 10)}...` : category
  }

  function getShellClasses(): string {
    return isDarkMode
      ? 'bg-black text-blue-100 border-blue-700'
      : 'bg-white text-blue-950 border-blue-200'
  }

  function getSurfaceClasses(): string {
    return isDarkMode
      ? 'bg-blue-950/30 border-blue-800 text-blue-100'
      : 'bg-blue-50 border-blue-200 text-blue-950'
  }

  function getSubtleTextClasses(): string {
    return isDarkMode ? 'text-blue-200/80' : 'text-blue-900/70'
  }

  function getSoftChipClasses(): string {
    return isDarkMode
      ? 'border-blue-700 bg-blue-900/40 text-blue-100'
      : 'border-blue-300 bg-blue-100 text-blue-900'
  }

  function getSolidButtonClasses(): string {
    return isDarkMode
      ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-400'
      : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-500'
  }

  function formatDate(value?: string): string {
    if (!value) {
      return 'Unknown date'
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return value
    }

    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  }

  function getMetaLine(item: RssItem): string {
    const parts = [formatDate(item.pubDate), item.creator ?? 'Unknown author']
    return parts.join(' · ')
  }

  async function handleFetch() {
    status = 'loading'
    errorMessage = ''

    try {
      items = await fetchSectionFeed(selectedSection)
      status = 'success'
    }
    catch (error) {
      status = 'error'
      errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
    }
  }
</script>

<main
  class={`h-[600px] w-[560px] overflow-hidden border p-4 font-['JetBrains_Mono',monospace] grid grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-2 ${getShellClasses()}`}
>
  <AppBar class={`rounded-md border px-3 py-2 ${getSurfaceClasses()}`}>
    <AppBar.Toolbar class='flex justify-between gap-2 p-0'>
      <AppBar.Headline class='text-xl font-bold justify-start'>NYTimes RSS Viewer</AppBar.Headline>
      <AppBar.Trail class='justify-end'>
        <div class='inline-flex items-center gap-1.5'>
          <Switch
            checked={isDarkMode}
            onCheckedChange={(event) => setColorMode(event.checked)}
            class='flex items-center'
          >
            <Switch.HiddenInput name='color-mode' />
            <Switch.Control class={`rounded-full border ${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-100 border-blue-300'}`}>
              <Switch.Thumb />
            </Switch.Control>
          </Switch>
          <span class='inline-flex items-center gap-1 text-xs'>
            {#if isDarkMode}
              <Moon size={14} />
              <span>Dark</span>
            {:else}
              <Sun size={14} />
              <span>Light</span>
            {/if}
          </span>
        </div>
      </AppBar.Trail>
    </AppBar.Toolbar>
  </AppBar>

  <p class={`m-0 text-sm ${getSubtleTextClasses()}`}>Choose a section and load the latest NYTimes RSS feed.</p>

  <SectionForm
    sections={SECTION_OPTIONS}
    selectedSection={selectedSection}
    disabled={status === 'loading'}
    onSectionChange={(section) => selectedSection = section}
    onSubmit={handleFetch}
    isDarkMode={isDarkMode}
  />

  {#if status === 'idle'}
    <p class={`mt-1.5 text-sm ${getSubtleTextClasses()}`}>No feed loaded yet.</p>
  {:else if status === 'loading'}
    <Progress value={40} min={0} max={100} class='w-full'>
      <Progress.Track class={`h-1.5 rounded ${isDarkMode ? 'bg-blue-900' : 'bg-blue-200'}`}>
        <Progress.Range class='h-1.5 rounded bg-blue-500' />
      </Progress.Track>
    </Progress>
    <p class={`mt-1.5 text-sm ${getSubtleTextClasses()}`}>Loading RSS feed...</p>
  {:else if status === 'error'}
    <p class='mt-1.5 text-sm text-red-500'>{errorMessage}</p>
  {:else}
    <section class='min-h-0 overflow-hidden'>
      {#if items.length === 0}
        <p class={`mt-1.5 text-sm ${getSubtleTextClasses()}`}>No items were found for this section.</p>
      {:else}
        <ul class='m-0 h-full min-h-0 list-none overflow-y-auto overflow-x-hidden pr-1 grid gap-2.5 p-0'>
          {#each items as item}
            <li class={`rounded-md border p-2.5 ${isItemExpanded(item.link) ? 'min-h-[196px]' : 'min-h-[128px]'} ${getSurfaceClasses()}`}>
              <div
                class='cursor-pointer grid grid-cols-[84px_minmax(0,1fr)] items-start gap-2.5 transition-colors'
                onclick={() => setItemExpanded(item.link, !isItemExpanded(item.link))}
                onkeydown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setItemExpanded(item.link, !isItemExpanded(item.link))
                  }
                }}
                role='button'
                tabindex='0'
                aria-expanded={isItemExpanded(item.link)}
              >
                <div class='h-[84px] w-[84px] shrink-0 overflow-hidden rounded-md'>
                {#if item.imageUrl}
                  <img src={item.imageUrl} alt={item.title} class='h-[84px] w-[84px] object-cover block'>
                {:else}
                  <div class={`h-[84px] w-[84px] flex items-center justify-center text-center text-[11px] ${isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900'}`}>No image</div>
                {/if}
              </div>

                <div class='min-w-0 grid gap-1.5'>
                <h2 class='m-0 text-left text-sm leading-[1.3] wrap-break-word'>{item.title}</h2>
                <p class={`m-0 text-left text-[11px] truncate whitespace-nowrap ${getSubtleTextClasses()}`}>{getMetaLine(item)}</p>

                {#if isItemExpanded(item.link)}
                  <p class='m-0 mt-1 text-left text-xs leading-[1.4] wrap-break-word'>
                    {item.description ?? 'No description available.'}
                  </p>
                {/if}

                <div class='mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 min-w-0 max-[360px]:grid-cols-1'>
                  <div class='flex flex-wrap gap-1 min-w-0'>
                      {#if getVisibleCategories(item.categories).length === 0}
                      <span class={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${getSoftChipClasses()}`}>Uncategorized</span>
                    {:else}
                      {#each getVisibleCategories(item.categories) as category}
                          <span class={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${getSoftChipClasses()}`}>{truncateCategory(category)}</span>
                      {/each}
                        {#if getHiddenCategoryCount(item.categories) > 0}
                          <span class={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${getSoftChipClasses()}`}>+{getHiddenCategoryCount(item.categories)}</span>
                        {/if}
                    {/if}
                  </div>

                  <a
                    href={item.link}
                    target='_blank'
                    rel='noreferrer'
                    onclick={(event) => event.stopPropagation()}
                    class={`inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${getSolidButtonClasses()}`}
                  >
                    View article
                  </a>
                </div>
              </div>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}
</main>
