<script lang="ts">
  import { settings } from '@/lib/stores';
  import { Switch, Section, TagEditor } from '@/lib/components';
  import {
    handleExport,
    handleFilterListChange,
    handleImport,
    sendMessage
  } from '@/lib/utils';
  import browser, { i18n } from 'webextension-polyfill';

  $: urlList = $settings.urlFilterList?.join('\n') ?? '';
</script>

<Section title={i18n.getMessage('settingsUserInterfaceHeading')}>
  <Switch
    title={i18n.getMessage('settingsPopupView')}
    checked={$settings.popupView}
    on:change={() => {
      settings.changeSetting('popupView', !$settings.popupView);
    }}
  />

  <Switch
    title={i18n.getMessage('settingsDarkMode')}
    checked={$settings.darkMode}
    on:change={() => settings.changeSetting('darkMode', !$settings.darkMode)}
  />
</Section>

<Section title={i18n.getMessage('settingsAutosaveHeading')}>
  <Switch
    title={i18n.getMessage('settingsAutosave')}
    checked={$settings.autoSave}
    on:change={() => {
      settings.changeSetting('autoSave', !$settings.autoSave);

      if ($settings.autoSave) sendMessage({ message: 'createTimer' });
      else browser.alarms.clear('auto-save');
    }}
  />
  <label class="max-w-max text-sm font-medium">
    <input
      type="number"
      class="mr-2 h-7 w-11 rounded-md text-center disabled:text-neutral-6"
      min="1"
      max="15"
      value={$settings.autoSaveMaxSessions}
      on:change={(event) => {
        if (Number(event.currentTarget.value) > 15)
          event.currentTarget.value = '15';
        if (Number(event.currentTarget.value) < 1)
          event.currentTarget.value = '1';

        settings.changeSetting(
          'autoSaveMaxSessions',
          Number(event.currentTarget.value)
        );
      }}
      disabled={!$settings.autoSave}
    />
    {i18n.getMessage('settingsAutosaveMax')}
  </label>
  <label class="max-w-max text-sm font-medium">
    <input
      type="number"
      class="mr-2 h-7 w-11 rounded-md text-center disabled:text-neutral-6"
      min="1"
      value={$settings.autoSaveTimer}
      on:change={(event) => {
        if (Number(event.currentTarget.value) < 1)
          event.currentTarget.value = '1';

        settings.changeSetting(
          'autoSaveTimer',
          Number(event.currentTarget.value)
        );

        sendMessage({ message: 'createTimer' });
      }}
      disabled={!$settings.autoSave}
    />
    {i18n.getMessage('settingsAutosaveInterval')}
  </label>
</Section>

<Section title={i18n.getMessage('settingsSessionActionsHeading')}>
  <Switch
    title={i18n.getMessage('settingsDoNotAskForSessionName')}
    checked={$settings.doNotAskForTitle}
    on:change={() => {
      settings.changeSetting('doNotAskForTitle', !$settings.doNotAskForTitle);
    }}
  />

  <Switch
    title={i18n.getMessage('settingsExportSessionCompressed')}
    checked={$settings.exportCompressed}
    on:change={() => {
      settings.changeSetting('exportCompressed', !$settings.exportCompressed);
    }}
  />

  <Switch
    title={i18n.getMessage('settingsExcludePinnedTabs')}
    checked={$settings.excludePinned}
    on:change={() =>
      settings.changeSetting('excludePinned', !$settings.excludePinned)}
  />

  <TagEditor />

  <div class="flex gap-2">
    <label
      class="max-w-max cursor-pointer rounded-md bg-neutral-4 p-2 hover:bg-neutral-5"
    >
      {i18n.getMessage('settingsImportSessions')}
      <input
        type="file"
        class="hidden"
        on:change={handleImport}
        accept=".json, .ssf, .txt"
      />
    </label>

    <button
      class="max-w-max rounded-md bg-neutral-4 p-2 hover:bg-neutral-5"
      on:click={() => handleExport($settings.exportCompressed)}
      >{i18n.getMessage('settingsExportSessions')}</button
    >
  </div>
</Section>

<Section title={i18n.getMessage('settingsExtensionActionsHeading')}>
  <Switch
    title={i18n.getMessage('settingsLazyload')}
    description={i18n.getMessage('settingsLazyloadDescription')}
    checked={$settings.discarded}
    on:change={() => settings.changeSetting('discarded', !$settings.discarded)}
  />

  <label class="flex flex-col gap-2 font-medium">
    {i18n.getMessage('settingsURLFilterList')}
    <textarea
      name="filter-list"
      id="filter-list"
      rows="8"
      placeholder={i18n.getMessage('settingsURLFilterListPlaceholder')}
      class="resize-none rounded-md bg-neutral-3 p-2 text-sm placeholder:text-neutral-content/40"
      inputmode="url"
      value={urlList}
      on:change={(ev) => handleFilterListChange(ev, urlList)}
    />
  </label>

  <button
    type="button"
    class="max-w-fit rounded-md bg-error px-4 py-2 text-white hover:bg-error-focus"
    on:click={settings.clear}
  >
    {i18n.getMessage('settingsResetAll')}
  </button>
</Section>
