import useGetConBalance from "../hooks/useGetConBalance";
import useGetConTokenBalance from "../hooks/useGetConTokenBalance";
import useGetEthBalance from "../hooks/useGetEthBalance";

export const LOGGER_NAME = "metacon-is-logger-active";

export const METACON_PRIVATE = "metacon-private";

export const METACON_IDENTITY = "metacon-indentity";

export const AUTH_TOKEN = "metacon-auth-token";

export const ORG_NAME = "Org1";

export const WALLET_TYPE = "ETH";

export const RECENT_TRANSACTIONS = "metacon-recent-transactions";

export const GAS_FEE_DIVIDEND = 1000000000;

export const PASSWORD_SECURITY = "password-security";

/**
 Temporary workaround to calculate gas limit for SWAP, can be changed once we find a way to calculate the gas limit dynamically
 **/
export const GAS_LIMIT_MULTIPLIER_FOR_SWAP = 5;

export const FcnTypes = {
  Transfer: "Transfer",
  Init: "Init",
  Mint: "Mint",
  Burn: "Burn",
  GetDetails: "GetDetails",
  BalanceOf: "BalanceOf",
};

type Token = {
  token: "con" | "conx" | "eth";
  useBalance: () => {
    balance:
      | {
          payload: string;
        }
      | undefined;
    loading: boolean;
    refetch: () => void;
    isFetching: boolean;
  };
  useGasEstimate?: () => {
    data: any;
    loading: boolean;
  };
};

export const TOKEN_CARDS: Token[] = [
  {
    token: "conx",
    useBalance: useGetConTokenBalance,
    useGasEstimate: () => ({ data: null, loading: false }),
  },
  {
    token: "eth",
    useBalance: useGetEthBalance,
  },
  {
    token: "con",
    useBalance: useGetConBalance,
  },
];

export const NETWORK_OPTIONS: {
  value: "testnet";
  // | "mainnet";
  label: string;
}[] = [
  {
    value: "testnet",
    label: "Conun Testnet",
  },
  // {
  //   value: "mainnet",
  //   label: "Conun Mainnet",
  // },
];
