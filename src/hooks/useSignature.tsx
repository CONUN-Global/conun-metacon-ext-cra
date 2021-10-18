import { useMutation } from "react-query";

import useStore from "../store/store";

import web3 from "src/web3";

function useSignature() {

  const etherKey = useStore((state) => state.etherKey);
  
  const { mutateAsync: sign } = useMutation(async (data: any) => {

    const encoded = web3.eth.abi.encodeParameters(
      ["uint256", "address"],
      [web3.utils.toWei(data.value), data.toAddress]
    );
    const hash = web3.utils.sha3(encoded);
    const signature = web3.eth.accounts.sign(hash || "", etherKey!);
    return signature;
  });

  return { sign };
}

export default useSignature;
