import { Logger } from "src/classes/logger";
import create from "zustand";

import { getIsLoggerActive, setIsLoggerActive } from "../helpers/logger";
import { getRecentTransactions } from "../helpers/recentTransactions";
import { AppState } from "../types/index";

const useStore = create<AppState>((set) => ({
  currentStep: {
    current: "welcome",
  },
  setCurrentStep: ({ current, previous }) =>
    set({
      currentStep: {
        current,
        previous,
      },
    }),
  authToken: null,
  setAuthToken: (token) => set({ authToken: token }),
  etherKey: null,
  setEtherKey: (key) => set({ etherKey: key }),
  isUserLoggedIn: false,
  setIsUserLoggedIn: (state: boolean) => set({ isUserLoggedIn: state }),
  isCreateNewWalllet: false,
  setCreateNewWallet: (state: boolean) => set({ isCreateNewWalllet: state }),
  isLoggerActive: getIsLoggerActive(),
  setIsLoggerActive: (state: boolean) => {
    set({ isCreateNewWalllet: state });
    setIsLoggerActive(state);
  },
  loggerInstance: null,
  setLoggerInstance: (state: Logger) => set({loggerInstance:state}),
  setUser: (user) => set({ user }),
  currentToken: "conx",
  setCurrentToken: (token) => set({ currentToken: token }),
  currentNetwork: "testnet",
  setCurrentNetwork: (network) => set({ currentNetwork: network }),
  recentTransactions: getRecentTransactions(),
  setRecentTransactions: (transactions) =>
    set({ recentTransactions: transactions }),
  needPassword: false,
  setNeedPassword: (state: boolean) => {
    set({ needPassword: state });
  },
}));

export default useStore;
