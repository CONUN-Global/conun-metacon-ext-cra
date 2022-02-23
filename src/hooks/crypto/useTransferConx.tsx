import { useMutation } from "react-query";

import instance from "../../axios/instance";

import useCurrentUser from "../useCurrentUser";
import useSignature from "./useSignature";

import { FcnTypes, ORG_NAME } from "src/const";

type TransferData = {
  toAddress: string;
  value: string;
};

function useTransferConx() {
  const { currentUser } = useCurrentUser();
  const { sign } = useSignature();
  const { mutateAsync: transferConx, isLoading } = useMutation(
    async (transferData: TransferData) => {
      const signature = await sign({
        ...transferData,
      });
      const { data }: any = await instance.post(
        `/con-token/channels/mychannel/chaincodes/${process.env.REACT_APP_SMART_CONTRACT}`,
        {
          ...transferData,
          fcn: FcnTypes.Transfer,
          orgName: ORG_NAME,
          fromAddress: currentUser?.walletAddress,
          signature: signature?.signature,
          messageHash: signature?.messageHash,
        }
      );

      return data?.payload?.TxID;
    }
  );
  return {
    transferConx,
    isLoading,
  };
}

export default useTransferConx;
