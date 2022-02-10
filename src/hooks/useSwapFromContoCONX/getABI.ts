import instance from "src/axios/instance";
import { ContractConfigResponseObj } from "src/types";
import web3 from "src/web3";

// helper function to get contract data for approval
export async function getApproveSwapABI(
  value: number,
  contractConfigData: ContractConfigResponseObj
) {
  console.log("Fetching approval ABI");
  const conContract = new web3.eth.Contract(
    contractConfigData.conContract.abiRaw,
    contractConfigData.conContract.address
  );
  return await conContract.methods
    .approve(
      contractConfigData.bridgeContract.address,
      web3.utils.toWei(String(value))
    )
    .encodeABI();
}

// helper function to get contract data for deposit
export async function getDepositTokensABI(
  value: number,
  contractConfigData: ContractConfigResponseObj,
  walletAddress: string
) {
  console.log("Fetching deposit ABI");
  const bridgeContract = new web3.eth.Contract(
    contractConfigData?.bridgeContract?.abiRaw,
    contractConfigData?.bridgeContract?.address
  );

  const { data }: any = await instance.post(
    "/bridge-swap/swap-request/type/CONtoCONX",
    {
      amount: String(value),
      walletAddress: walletAddress,
    }
  );
  return await bridgeContract.methods
    .depositTokens(
      web3.utils.toWei(String(value)),
      data?.payload?.swapID,
      walletAddress
    )
    .encodeABI();
}
