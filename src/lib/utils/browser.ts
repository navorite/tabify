import browser from 'webextension-polyfill';
import type { QueryInfo, Tab, Window } from '../types/browser';
import type { Session } from '../types/extension';

// Get current active tab

export async function getCurrentTab(): Promise<Tab> {
  return (await getWindowTabs({ active: true }))[0];
}

// Get all tabs of current window

export async function getWindowTabs(
  optionalQuery: QueryInfo = {}
): Promise<Tab[]> {
  return getTabs({ ...optionalQuery, currentWindow: true });
}

// Get all tabs that match a query obj

export async function getTabs(queryInfo: QueryInfo = {}): Promise<Tab[]> {
  return browser?.tabs?.query?.(queryInfo);
}

// Get current session (Either all windows or current window)

export async function getSession() {
  let session = { title: 'Current Session', windows: [] } as Session;
  let tabsNumber = 0;

  const windows = await browser?.windows?.getAll();

  for (const window of windows) {
    window.tabs = await getTabs({ windowId: window.id, url: '*://*/*' });
    tabsNumber += window.tabs.length;
    session.windows.push(window);
  }

  session.tabsNumber = tabsNumber;

  return session;
}

export async function openWindow(window: Window) {
  //WIP
  const windowId = (await browser?.windows?.create({ focused: window.focused }))
    .id;
  for (const tab of window?.tabs) {
    browser?.tabs?.create({
      url: tab.url,
      active: tab.active,
      windowId: windowId,
      discarded: tab.active,
    });
  }
}

export async function openSession(session: Session) {
  for (const window of session.windows) {
    openWindow(window);
  }
}
