import { useHistory } from "react-router-dom";
import useStore from "src/store/store";
import useURLQuery from "../useURLQuery";

const SWAP_ALLOWED_TOKENS = ["conx", "con"];

function useBrowserTab() {
  const isRunningInBrowserTab = useStore(
    (state) => state.isRunningInBrowserTab
  );
  const setRunningInBrowserTab = useStore(
    (state) => state.setRunningInBrowserTab
  );
  const currentToken = useStore((store) => store.currentToken);

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
  function handleBrowserLinkWithToken(page: string): void {
    if (isRunningInBrowserTab) {
      history.push(page);
    } else {
      // Prevent loading eth token on swap page
      let tokenParameter = "&token=" + currentToken;
      if (
        page.includes("swap") &&
        !SWAP_ALLOWED_TOKENS.includes(currentToken)
      ) {
        tokenParameter = "";
      }

      chrome.tabs.create({
        url: chrome.runtime.getURL(
          "index.html#" + page + "?tab=true" + tokenParameter
        ),
      });
    }
  }

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

  return {
    isRunningInBrowserTab,
    handleBrowserLink,
    handleBrowserLinkWithToken,
    openIndexInTab,
  };
}

export default useBrowserTab;
