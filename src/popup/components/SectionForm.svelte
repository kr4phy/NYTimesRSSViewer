<script lang='ts'>
  import type { SectionId, SectionOption } from '../types/rss'

  type Props = {
    sections: SectionOption[]
    selectedSection: SectionId
    isDarkMode?: boolean
    disabled?: boolean
    onSectionChange: (section: SectionId) => void
    onSubmit: () => void
  }

  const { sections, selectedSection, isDarkMode = false, disabled = false, onSectionChange, onSubmit }: Props = $props()
</script>

<form
  class='grid gap-2'
  onsubmit={(event) => {
    event.preventDefault()
    onSubmit()
  }}
>
  <label for='section' class={`text-xs ${isDarkMode ? 'text-blue-200/80' : 'text-blue-900/70'}`}>Section</label>
  <div class='grid grid-cols-[minmax(0,1fr)_auto] gap-2'>
    <select
      id='section'
      class={`h-9 rounded-md border px-2 text-sm ${isDarkMode ? 'bg-black text-blue-100 border-blue-700' : 'bg-white text-blue-950 border-blue-300'}`}
      value={selectedSection}
      onchange={(event) => onSectionChange((event.currentTarget as HTMLSelectElement).value as SectionId)}
      disabled={disabled}
    >
      {#each sections as section}
        <option value={section.id}>{section.label}</option>
      {/each}
    </select>

    <button
      type='submit'
      class={`h-9 rounded-md border px-3 text-sm font-medium transition-colors ${isDarkMode ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-400' : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-500'}`}
      disabled={disabled}
    >
      {disabled ? 'Loading...' : 'Load Feed'}
    </button>
  </div>
</form>