//非依存
import { INFTMinter } from '@/modules/NFTMinter/interface/INFTMinter'; 
import { IApplicationJSON } from '@/interfaces/IApplicationJSON';
//依存
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CollectionFactory } from '../modules/CollectionFactory'; 

//
import { ethers } from 'ethers';

// インスタンスの保持
const minters: {[key: string]: INFTMinter} = {};

//
interface collection{
    viewName: string;
    totalSupply?: number;
    wallet_address?: string;
    isConnectedWallet: boolean;
    balanceOf?: number;
}

// Define the initial state using that type
const initialState: {[key: string]: collection} = {};

// デジタルグッズ
export const collectionSlice = createSlice({
    name: "collection",
    initialState,
    reducers:{
        setViewName: (state, action: PayloadAction<any>) => {
            const payload = action.payload;
            state[payload.keyName] = {
                viewName: payload.viewName,
                isConnectedWallet: false
            }
        },
        setTotalSupply: (state, action: PayloadAction<any>) => {
            const payload = action.payload;
            state[payload.keyName].totalSupply = payload.totalSupply;
        },
        setWalletAddress: (state, action: PayloadAction<any>) => {
            const payload = action.payload;
            state[payload.keyName].wallet_address = payload.wallet_address;
            state[payload.keyName].isConnectedWallet = true;
        },
        setBalaceOf: (state, action: PayloadAction<any>) => {
            const payload = action.payload;
            state[payload.keyName].balanceOf = payload.balance;
        },
    }
});

// Action creators are generated for each case reducer function
export const { setViewName, setTotalSupply, setWalletAddress, setBalaceOf } = collectionSlice.actions;
export default collectionSlice.reducer;

// 非同期 //////////////////////////////////////////////////////////////////////////////////////////////

// Minter作成。
export const createMinter = (keyName: string, contract_address: string, infura_name: string, infura_apikey: string, chainId: number) => {
    return async (dispath: any, getState: any) =>{
        //
        const minter: INFTMinter = new CollectionFactory().createMinter();
        await minter.connectContract(contract_address, chainId, infura_name, infura_apikey);
        // インスタンスを保持
        minters[keyName] = minter;
        console.log("Created Minter");
        // // 総発行数を取得
        // const totalSupply = await minter.totalSupply();
        // dispath(setTotalSupply({
        //     keyName: keyName,
        //     totalSupply: totalSupply
        // }));
    }
}

// TODO: chainIdのチェック
// 財布接続
export const connectWallet = (keyName: string) => {
    return async (dispath: any, getState: any) =>{
        const minter = minters[keyName];
        const wallet_address = await minter.connectWallet();
        dispath(setWalletAddress({
            keyName: keyName, wallet_address: wallet_address
        }));
        //
        const contract = minter.getContractReader();
        // Debug用
        let balance;
        try{
            balance = Number(await contract.balanceOf(wallet_address));
        }catch(e: any){
            console.log(e);
        }
        dispath(setBalaceOf({keyName: keyName, balance: balance}));
    }
}


// 発行
export const mint = (keyName: string, app: {[key:string]: any}) => {
    return async (dispath: any, getState: any) =>{
        // console.log(app);
        //
        const state = getState();
        if(state.collection[keyName]){
            //
            const minter = minters[keyName];

            // 申請情報
            const workAddr = app.workAddr;
            const workId = app.workId;
            const applicantAddr = state.collection[keyName].wallet_address;
            const licenseFees = 100000000000000000000000;
            const startDate = Date.parse(app.startDate) / 1000;
            const endDate =   Date.parse(app.endDate) / 1000;
            const cancellationDate = Date.parse(app.cancellationDate) / 1000;
            const createdDate = Math.floor(Date.now() / 1000);

            //
            const application_json: IApplicationJSON = {
                applicationAddr: await minter.getContractReader().getAddress(),
                name: "音楽利用許諾申請",
                discription: "使用許諾をお願いしたく思います。",
                licenseFees: licenseFees,
                workAddr: workAddr,
                workId: workId,
                leadAuthorName: "江戸レナ", // TODO: コントラクトから取得
                leadAuthorAddr: "0x4Af6158D35Fb5c14D7bf2aF66C7958114b882f4A", // TODO: コントラクトから取得
                workTitle: "KYOSO", // TODO: コントラクトから取得
                applicantAddr: applicantAddr,
                applicantName: app.applicantName,
                applicantContact: app.applicantContact,
                useLocation: app.useLocation,
                useDetails: app.useDetails,
                startDate: startDate,
                endDate: endDate,
                cancellationDate: cancellationDate,
                createdDate: createdDate
            }

            const contract = minter.getContractWriter();
            const signer = minter.getSigner();
            const message = JSON.stringify(application_json);
            
            // ダイジェスト化
            const messageDigest = await contract.getMessageHash(message);
            // string型から32長のバイト列に変換する。
            const messageDigest_arr = ethers.toBeArray(messageDigest);

            // TODO: 確認フォーム
            const isValided = confirm(`以下の内容で署名して申請します。\n${message}\nメッセージダイジェスト: ${messageDigest}`);
            if(isValided){
                // 署名: `\x19Ethereum Signed Message:\n`がprefixdされてからHash化される。
                // 末尾の`n`は署名するメッセージの長さを指定する。
                const signature = await signer.signMessage(messageDigest_arr);
                // console.log(signature);

                // 発行。
                await contract.mint(
                    workAddr,
                    workId,
                    startDate,
                    endDate,
                    cancellationDate,
                    message,
                    signature
                );
            }


        }else{
            console.error("mint: ", state);
        }
    }
}