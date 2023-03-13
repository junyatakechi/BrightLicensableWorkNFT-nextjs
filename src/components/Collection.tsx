import styles from '@/styles/Home.module.css'
import { useEffect } from 'react';
import { setViewName, createMinter, connectWallet, mint} from '@/store/collectionSlice';
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useState } from 'react';

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

    // 申請書に入力するフィールドを定義
    const [ workAddr, setWorkAddr] = useState("");
    const [ workId,   setWorkId  ] = useState(-1);
    const [ startDate, setStartDate] = useState(-1);
    const [ endDate, setEndDate] = useState(-1);
    const [ cancellationDate, setCancellationDate] = useState(-1);
    const [ applicantName, setApplicantName] = useState("");
    const [ applicantContact, setApplicantContact] = useState("");
    const [ useLocation, setUseLocation] = useState("");
    const [ useDetails, setUseDetails] = useState("");

    //
    const submit = ()=>{
        const app:{[key:string]: any} = {
            workAddr: workAddr,
            workId: workId,
            startDate: startDate,
            endDate: endDate,
            cancellationDate: cancellationDate,
            applicantName: applicantName,
            applicantContact: applicantContact,
            useLocation: useLocation,
            useDetails: useDetails
        }
        //
        dispatch(mint(props.keyName, app));
    }

    // 
    return (
    <div>
        <h2><span>コレクション名: </span><span>{ props.viewName}</span></h2>
        <p><span>コントラクトアドレス: </span><span>{ props.address }</span></p>
        <button><a href={`https://goerli.etherscan.io/address/${props.address}`} target="_blank">etherscan</a></button>
        {/* <p><span>総発行数: </span><span>{ collection[props.keyName]?.totalSupply }</span></p> */}
        { collection[props.keyName]?.isConnectedWallet
        ?<>
            <div>
                <p><span>接続済みウォレット: </span><span>{ collection[props.keyName]?.wallet_address }</span></p>
                <p><span>所有数: </span><span>{ collection[props.keyName]?.balanceOf }</span></p>
                </div>
                <div>
                    <p><label>NFT作品のコントラクトアドレス: <input value={workAddr} onChange={(e)=>{setWorkAddr(e.target.value)}} type="text" /></label></p>
                    <p><label>NFT作品のトークンID: <input value={workId} onChange={(e)=>{setWorkId(Number(e.target.value))}} type="number" /></label></p>
                    <p><label>使用開始日時: <input value={startDate} onChange={(e)=>{setStartDate(e.target.value)}} type="datetime-local" /></label></p>
                    <p><label>使用終了日時: <input value={endDate} onChange={(e)=>{setEndDate(e.target.value)}} type="datetime-local" /></label></p>
                    <p><label>申請承認待ち期間: <input value={cancellationDate} onChange={(e)=>{setCancellationDate(e.target.value)}} type="datetime-local" /></label></p>
                    <p><label>申請者の名前: <input value={applicantName} onChange={(e)=>{setApplicantName(e.target.value)}} type="text" /></label></p>
                    <p><label>申請者の連絡先: <input value={applicantContact} onChange={(e)=>{setApplicantContact(e.target.value)}} type="text" /></label></p>
                    <p><label>使用場所: <input value={useLocation} onChange={(e)=>{setUseLocation(e.target.value)}} type="text" /></label></p>
                    <p><label>使用目的: <input value={useDetails} onChange={(e)=>{setUseDetails(e.target.value)}} type="text" /></label></p>
                <div>
                    <button onClick={()=>{submit()}}>申請する</button>
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