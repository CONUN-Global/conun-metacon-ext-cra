import { useHistory, useLocation } from "react-router-dom";
import { routes } from "src/const";
import useStore from "src/store/store";
import { Token } from "src/types";
import useURLQuery from "./useURLQuery";

function useTokenInNewTab() {
  const currentToken = useStore((store) => store.currentToken);
  const setCurrentToken = useStore((store) => store.setCurrentToken);

  const history = useHistory();
  const location = useLocation();
  const query = useURLQuery();
  const incomingToken = query.get("token");

  if (!!incomingToken && incomingToken !== currentToken) {
    setCurrentToken(incomingToken as Token);
  }

  // The query blocks the swap token button - remove the query when no longer useful.
  if (!!incomingToken) {
    if (location.pathname.includes("swap")) {
      history.replace(routes.swap);
    } else if (location.pathname.includes("send")) {
      history.replace(routes.send);
    }
  }
}

export default useTokenInNewTab;
