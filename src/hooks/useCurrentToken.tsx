import { TOKEN_CARDS } from "src/const";
import useStore from "../store/store";

function useCurrentToken() {
  const currentToken = useStore((store) => store.currentToken);
  return TOKEN_CARDS.find((t) => t.token === currentToken)!;
}

export default useCurrentToken;
