// スマコン側のinterface: https://github.com/Conata/MetaaniDNASBTContract/blob/main/contracts/interface/IConataNFT.sol

import { INFTMinter } from "./interface/INFTMinter";
import { ethers, Contract } from "ethers";
import { Provider } from "ethers";
import { InfuraProvider, BrowserProvider } from "ethers";
import { Signer } from "ethers";
import { AbiCoder } from "ethers";

//
export class NFTMinter implements INFTMinter{
    private contract_address?: string;
    private chainId?: number; // goerli: 5, Ethereum mainnet: 1
    private provider_reader?: InfuraProvider;
    private provider_writer?: BrowserProvider;
    private contract_reader?: Contract;
    private contract_writer?: Contract;
    private abi?: any;
    private signer?: Signer;

    // エントリー関数
    async connectContract(contract_address: string, chainId: number, infura_name: string, infura_apikey: string){
        this.contract_address = contract_address;
        this.provider_reader = new InfuraProvider(infura_name, infura_apikey);
        this.chainId = chainId;
        this.abi = await this.getABI(contract_address, chainId);
        // 読み込み用を作成。
        this.contract_reader = await this._createContract(this.contract_address, this.chainId, this.provider_reader);
    }
    
    // スマコンの関数呼び出し用オブジェクト作成
    private async _createContract(address: string, chainId: number, provider: Provider | Signer): Promise<Contract>{
        this.abi = await this.getABI(address, chainId);
        return new ethers.Contract(address, this.abi, provider);
    }
    
    // ABI取得
    async getABI(contract_address: string, chainId: number): Promise<JSON>{
        const json = await fetch(`/json/${contract_address}.json`).then(res=>{return res.json()});
        // const abi = await this._fetchABIFromEtherscan(contract_address, chainId);
        return json.result;
    }
    
    // 発行数取得
    async totalSupply(): Promise<Number>{
        const contract = this.contract_reader;
        let amount = 0;
        try{
            amount = Number(await contract?.totalSupply());
        }catch(err: any){
            console.error(err);
        }
        // console.log("totalSupply: ", amount);
        return amount;
    }

    // ユーザーが最初に実行する関数
    async connectWallet(): Promise<string>{
        // メタマスクのブラウザ拡張はwindow.ethereumの変数に入れてある。
        if ((window as any).ethereum == null) {
            throw new Error("Metamaskをインストールしてください。");
        }
        else{
            // ブラウザ拡張用のProviderを設定
            this.provider_writer = new ethers.BrowserProvider((window as any).ethereum);
            // ユーザーから秘密鍵へのアクセスを許可
            try{
                this.signer = await this.provider_writer.getSigner();
            }catch(e){
                console.error(e);
            }
            // 書き込み用を作成。
            // [!] ethers.js-v6.0.3で`ContractRunner`の概念が追加され、BrowserProviderだとトランザクションが送れない(バグの可能性)
            this.contract_writer = await this._createContract(this.contract_address!, this.chainId!, this.signer!);
            const wallet = await this.signer!.getAddress();
            console.log("[!] Your Wallet: ", wallet);
            return wallet;
        }
    }

    //
    getContractReader(): Contract{
        return this.contract_reader!;
    }

    //
    getContractWriter(): Contract{
        return this.contract_writer!;
    }

    //
    getSigner(): Signer{
        return this.signer!
    }

    //
    async mint(types: string[], values: string[]){
        const args = AbiCoder.defaultAbiCoder().encode(types, values);
        const contract: Contract = this.getContractWriter();
        try{
            // [!] etherjs-v6でoverload functionの書き方が変わり`Typed`APIを使用する。
            await contract.mint(ethers.Typed.bytes(args));
        }catch(e:any){
            alert("エラーが発生しました。");
            console.error(e.message);
        }
    }

    // ミント期間が開催されているか？
    async getOpenedMintTermNames(): Promise<string[]>{
        const contract = this.getContractReader() as Contract;
        const terms: string[] = await contract.getOpenedMintTermNames();
        return terms;
    }



    // チェーンの確認
    async checkChainId(requestedChainId: number): Promise<boolean>{
        const chainId = this.chainId;
        const condition = requestedChainId == chainId;
        if (!condition) {
            alert("ネットワーク設定がサイトの想定と異なります。");
        }
        return condition;
    }

    // アドレスの不正値チェック。
    checkAddress(address: string): string | undefined{
        try {
            const result = ethers.getAddress(address);
            return result;
        } catch (e: any) {
            console.error(e.message);
            return undefined;
        }
    }

    // // Private /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //
    private _setEventListeners(){
        (window as any).ethereum.on("chainChanged", (_chainId: any) => window.location.reload());
        // event Log(string message);
        // event Minted(address account, uint tokenId);
        // event ChangedMintTerm(string termName);
    }

    // S3にABIデータを置いておく。
    private async _fetchABIFromS3(contract_address: string, chainId: number): Promise<JSON>{
        const chainIdMap: {[key: number]: string} = {
            1: "mainnet",
            5: "goerli",
        }
        const abi_uri = `https://nft-abi-list.s3.ap-northeast-1.amazonaws.com/${chainIdMap[chainId]}/${contract_address}.json`;
        console.log("abi_uri: ", abi_uri);
        const abi_raw = await fetch(abi_uri).then((res) => { return res.json()});
        const abi_str = abi_raw["result"];
        const abi = JSON.parse(abi_str);
        //console.log("abi_json: ", abi);
        return abi;
    }

    // 230215: APIの制限がかかる。verfyしていれば取って来れる。
    private async _fetchABIFromEtherscan(contract_address: string, chainId: number): Promise<JSON>{
        const schemeMap: {[key: number]: string} = {
            1: "https://api.etherscan.io/api",
            5: "https://api-goerli.etherscan.io/api",
        }
        const abi_uri = `${schemeMap[chainId]}?module=contract&action=getabi&address=${contract_address}`;
        console.log("abi_uri: ", abi_uri);
        const abi_raw = await fetch(abi_uri).then((res) => { return res.json()});
        const abi_str = abi_raw["result"];
        // console.log("abi_str: ", abi_str);
        const abi = JSON.parse(abi_str);
        //console.log("abi_json: ", abi);
        return abi;
    }

}