import { useMutation } from "react-query";

import { setPrivateKey } from "@/helpers/privateKey";

import web3 from "src/web3";

type DecryptArgs = {
  keystore: any;
  password: string;
};

function useKeystoreDecrypt() {
  const { mutateAsync: decrypt, isLoading } = useMutation(
    async (args: DecryptArgs) => {
      const data = web3.eth.accounts.decrypt(args.keystore, args.password);

      return {
        walletAddress: data?.address,
        privateKey: data?.privateKey,
      };
    },
    {
      onSuccess: (data) => {
        setPrivateKey(data.privateKey);
      },
    }
  );
  return { decrypt, isLoading };
}

export default useKeystoreDecrypt;
