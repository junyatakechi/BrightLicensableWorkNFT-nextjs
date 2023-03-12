import { INFTMinter } from "./NFTMinter/interface/INFTMinter"
import { NFTMinter } from "./NFTMinter/NFTMinter";

// 
export interface ICollectionFactory{
    createMinter():INFTMinter;
}

//
export class CollectionFactory implements ICollectionFactory{
    //
    createMinter():INFTMinter{
        return new NFTMinter();
    }

    //

}