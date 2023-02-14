import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import Counter from '@/components/Counter';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
          <p>Hello World</p>
          <Counter></Counter>
        </div>
      </Provider>
    </>
  )
}
