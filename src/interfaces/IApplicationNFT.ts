import { IApplicationJSON } from "./IApplicationJSON";

// 申請書NFTのメタデータ構造。
export interface IApplicationNFT {
    tokenId: number;
    name: string;
    discription: string;
    image: string;
    signature: string; // applicationへの電子署名; 秘密鍵で暗号化する。
    application: IApplicationJSON;
}