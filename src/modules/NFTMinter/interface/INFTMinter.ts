import { Contract, Signer } from "ethers";
//
export interface INFTMinter{
    connectContract(contract_address: string, chainId: number, infura_name: string, infura_apikey: string): void;
    getABI(contract_address: string, chainId: number): Promise<JSON>;
    totalSupply(): Promise<Number>;
    connectWallet(): Promise<string>;
    getContractReader(): Contract;
    getContractWriter(): Contract;
    getSigner(): Signer;
    mint(types: string[], values: string[]):void;
    getOpenedMintTermNames(): Promise<string[]>;
    checkChainId(requestedChainId: number): Promise<boolean>;
    checkAddress(address: string): string | undefined;
}