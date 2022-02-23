import { useHistory } from "react-router-dom";
import useStore from "src/store/store";
import useURLQuery from "./useURLQuery";

function useBrowserTab() {
  const isRunningInBrowserTab = useStore(
    (state) => state.isRunningInBrowserTab
  );
  const setRunningInBrowserTab = useStore(
    (state) => state.setRunningInBrowserTab
  );

  const history = useHistory();
  const query = useURLQuery();
  const isTab = query.get("tab");

  // If not previously set, and ?tab=true is found, set global state
  if (!isRunningInBrowserTab && isTab) {
    setRunningInBrowserTab(true);
  }

  /**
   * @description Opens a link in tab, if not already in tab.
   * @param page link destination
   */
  function handleBrowserLink(page: string): void {
    if (isRunningInBrowserTab) {
      history.push(page);
    } else {
      chrome.tabs.create({
        url: chrome.runtime.getURL("index.html#" + page + "?tab=true"),
      });
    }
  }

  function openIndexInTab() {
    chrome.tabs.create({
      url: chrome.runtime.getURL("index.html#?tab=true"),
    });
  }

  return { isRunningInBrowserTab, handleBrowserLink, openIndexInTab };
}

export default useBrowserTab;
