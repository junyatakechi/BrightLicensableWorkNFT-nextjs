import styles from '@/styles/Home.module.css'
import { useEffect } from 'react';
import { setViewName, createMinter, connectWallet, mint} from '@/store/collectionSlice';
import { useAppSelector, useAppDispatch } from "@/store/hooks";

//
type Props = {
  keyName: string;
  viewName: string;
  address: string;
  infura_name: string;
  infura_apiKey: string;
  chainId: number; // 1: mainnet, 5: goerli
}

// Mint用パネル
export default function CollectionPanel(props: Props){
  const collection = useAppSelector(state => state.collection);
  const dispatch = useAppDispatch();

  //
  useEffect(()=>{
    //
    console.log(props);

    // デジタルグッズ設定。
    dispatch(setViewName({
      keyName: props.keyName,
      viewName: props.viewName
    }));

    // コントラクトの接続
    dispatch(createMinter(
      props.keyName,
      props.address,
      props.infura_name,
      props.infura_apiKey,
      props.chainId
    ));

  }, [dispatch]);

  // 
  return (
    <div>
      <h2><span>コレクション名: </span><span>{ props.viewName}</span></h2>
      <p><span>コントラクトアドレス: </span><span>{ props.address }</span></p>
      {/* <p><span>総発行数: </span><span>{ collection[props.keyName]?.totalSupply }</span></p> */}
      { collection[props.keyName]?.isConnectedWallet
        ?<>
          <div>
            <p><span>接続済みウォレット: </span><span>{ collection[props.keyName]?.wallet_address }</span></p>
            <p><span>所有数: </span><span>{ collection[props.keyName]?.balanceOf }</span></p>
            <button><a href={`https://goerli.etherscan.io/address/${props.address}`} target="_blank">etherscan</a></button>
          </div>
          <div>
            <div>
              <button onClick={()=>dispatch(mint(props.keyName))}>Mint</button>
            </div>
          </div>  
        </>
        :<>
          <div>
            <button onClick={()=>{dispatch(connectWallet(props.keyName))}}>ウォレット接続</button>
          </div>
        </>
      }
    </div>
  );

}
