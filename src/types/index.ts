import { Logger } from "src/classes/logger";

export type AppState = {
  currentStep: {
    current: Step;
    previous?: Step;
  };
  setCurrentStep: (step: { current: Step; previous?: Step }) => void;
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  etherKey: string | null;
  setEtherKey: (key: string | null) => void;
  identity: Identity | null;
  setIdentity: (identityPkg: Identity) => void;
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: (state: boolean) => void;
  isCreateNewWalllet: boolean;
  setCreateNewWallet: (state: boolean) => void;
  isLoggerActive: boolean;
  setIsLoggerActive: (state: boolean) => void;
  loggerInstance: Logger | null;
  setLoggerInstance: (state:Logger) => void;
  user?: StoreUser;
  setUser: (user: StoreUser) => void;
  currentToken: Token;
  setCurrentToken: (token: Token) => void;
  recentTransactions: RecentTransaction[];
  currentNetwork: Network;
  setCurrentNetwork: (network: Network) => void;
  setRecentTransactions: (transactions: RecentTransaction[]) => void;
  needPassword: boolean;
  setNeedPassword: (state: boolean) => void;
};

export type Network = "testnet" | "mainnet";

export type CurrentUser = {
  _id: string;
  createdAt: string;
  isAdmin: boolean;
  orgName: string;
  walletAddress: string;
  name?: string;
};

export type Step =
  | "welcome"
  | "walletQuestion"
  | "helpUs"
  | "createWallet"
  | "importWallet"
  | "passwordSetup"
  | "backup"
  | "importBackup"
  | "alreadyUser"
  | "newUser"
  | "congratulations";

export type StoreUser = {
  email: string;
  name: string;
  picture: string;
  token: string;
  oauthType: "google" | "kakao";
};

export type Token = "conx" | "eth" | "con";
export type txAction = "buy" | "send" | "swap";
export type txStatus = "pending" | "success" | "failed";

export type GasFeeObj = { gasLimit: number; gasPrice: string };

export type RecentTransaction = {
  txType: txAction;
  hash: string;
  token: Token;
  amount: number;
  to?: string;
  date: string;
  status: txStatus;
  swapInfo?: {
    from: string;
    to: string;
  };
  network?:Network
};

export type ServiceCardObj = {
  name: string;
  caption: string;
  icon: JSX.Element;
};

export type ContractConfigObj = {
  address: string;
  abiRaw: any;
};

export type ContractConfigResponseObj = {
  conContract: ContractConfigObj;
  bridgeContract: ContractConfigObj;
};

export type Identity = {
  credentials: {
    certificate: string;
    privateKey: string;
  };
  mspId: string;
  type: string;
  walletAddress: string;
};

export type LoginPackage = {
  webAppAuthToken: string;
  webAppIdentity: Identity;
  webAppSuperKey: string;
};
