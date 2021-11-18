import { useQuery } from "react-query"

import instance from "src/axios/instance";
import infuraInstance from "src/axios/infuraInstance"

import getConfig from "src/helpers/getConfig";
import { ContractConfigResponseObj } from "src/types"
import web3 from "src/web3";



type SwapFeeHookParams = {
  from:string,
  gas?:string,
  gasPrice?:string,
  value:string,
}

interface SwapFeeProps {
  params:SwapFeeHookParams
}

interface GetABIProps {
  configData:ContractConfigResponseObj,
  value:string,
  walletAddress:string,
}


function useSwapFeeConToCONX({params}:SwapFeeProps){


  async function getDepositTokensABI({configData, value, walletAddress}:GetABIProps){

      const bridgeContract = new web3.eth.Contract(
        configData?.bridgeContract?.abiRaw,
        configData?.bridgeContract?.address
      );
    
      const { data }: any = await instance.post(
        "/bridge-swap/swap-request/type/CONtoCONX",
        {
          amount: value,
          walletAddress,
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
  async function getApproveSwapABI({configData, value}:GetABIProps){

    const conContract = new web3.eth.Contract(
      configData?.conContract?.abiRaw,
      configData?.conContract?.address
    );
  
    return await conContract.methods
      .approve(
        configData?.bridgeContract.address,
        web3.utils.toWei(String(value))
      )
      .encodeABI();  

  } 

    const {data, isLoading} = useQuery(["get-conToCONX-gas-estimate", params.value], 
    
    async ()=> {

      const configData:ContractConfigResponseObj = await getConfig();
      
      const ApproveSwapABIData = await getApproveSwapABI({configData, value:params.value, walletAddress:params.from})

      const {data:approveSwapData}:any = await infuraInstance.post("", {
        "jsonrpc": "2.0",
        "method":"eth_estimateGas",
        "params": [{from: params.from, to:configData?.conContract.address , data:ApproveSwapABIData}],
        "id": 1
      })
      
      const DepositTokensABIData = await getDepositTokensABI({configData, value:params.value, walletAddress:params.from}) 
      console.log(`DepositTokensABIData`, DepositTokensABIData)
      
      const {data: depositTokensData}:any = await infuraInstance.post("", {
        "jsonrpc": "2.0",
        "method":"eth_estimateGas", 
        "params": [{from: params.from, to:configData?.bridgeContract.address , data:DepositTokensABIData}],
        "id": 1
      })

      

      return {
        d: depositTokensData,
        a: approveSwapData,
      }
  
    },
    {
      refetchOnMount: true,
      cacheTime: 0,
    })

    return {
      data,
      isLoading
    }
  }



export default useSwapFeeConToCONX