import useStore from "src/store/store";
import { Token } from "src/types";
import useURLQuery from "./useURLQuery";

function useTokenInNewTab() {
  const currentToken = useStore((store) => store.currentToken);
  const setCurrentToken = useStore((store) => store.setCurrentToken);

  const query = useURLQuery();
  const incomingToken = query.get("token");

  if (!!incomingToken && incomingToken !== currentToken) {
    setCurrentToken(incomingToken as Token);
  }
}

export default useTokenInNewTab;
