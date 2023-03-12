import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import Counter from '@/components/Counter';
import Collection from '@/components/Collection';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  //
  const collection = "BrightLicensableWorkNFT";
  
  const propsMap: {[key: string]: any} = {
    "BrightLicensableWorkNFT" : {    
      keyName: collection as string,
      viewName: "申請書NFT",
      address: "0x9810e3A30cc9081B7a3a6Cbb57037A139bcf1A48",
      infura_name: "goerli", // homestead | goerli
      infura_apiKey: "974656d5cfcb45a4bbc935807237618f",
      chainId: 5, // 1: mainnet, 5: goerli
    }
  }
  
  
  
  
  //
  return (
    <>
      <Provider store={store}>
        <Head>
          <title>Nextjs</title>
          <meta name="description" content="Nextjs" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>
          <div>
            <h1>{`${collection}`}</h1>
            <Collection {...propsMap[collection as string]} ></Collection>
          </div>
        </div>
      </Provider>
    </>
  )
}
