template-nextjs.md

# コマンド
- `npm run dev`
  - ローカルプレビューの起動。
- `npm run build`
  - next build && next export
  - ビルドデータ生成と`out/`に静的ホスティングデータの出力。
  - [HTML Export](https://nextjs.org/docs/advanced-features/static-html-export)

# 設計方針
## フレームワーク: Next.js
- [about-nextjs](https://nextjs.org/learn/foundations/about-nextjs)
- [getting-started](https://nextjs.org/docs/getting-started)
## GUIライブラリ: React
- 関数コンポーネントスタイルのみを使用する。
- コンポーネント毎のライフサイクルは`useEffect(() => {}, [])`を使う。
- [docs-react](https://reactjs.org/docs/components-and-props.html)
## 言語: Typescript
- [typescriptbook](https://typescriptbook.jp/)
## レンダリング: CSR(クライアントサイドレンダリング)
- ホスティング環境: S3やFirebase
## グローバルステート管理: Redux
- [3原則](https://redux.js.org/understanding/thinking-in-redux/three-principles)
  1. グローバルステートの参照元は一つに絞るべき
  2. ステートは読み取り専用にするべき
  3. 変更はシンプルな関数でするべき(非同期処理は別途仕組みが必要)
- `Redux Toolkit TypeScript`のライブラリを使用する。
  - [ReduxToolkit使い方](https://redux.js.org/tutorials/quick-start)
  - [Redux Toolkit TypeScript](https://redux.js.org/tutorials/typescript-quick-start)
- [用語](https://redux.js.org/understanding/thinking-in-redux/glossary)
- 補足用語
  - Slice.ts
    - Redux Toolkitによるreduxアーキテクチャを提供するメインモジュール。
  - store.ts
    - RootStateを設定。
    - 各sliceからreducerをconfigureStoreにアサインして一括管理する。
  - hook.ts
    - useSelectorとuseDispatchを使いやすくする。
    - 型の推論と一括管理。
### 非同期処理: Redux MiddlewareとThunk関数
- MiddlewareはReduxの機能を拡張する。
- `store.dispatch()`にActionオブジェクトではなく、関数を引数にして実行できる。
- Thunk関数
  - dispatch機能とgetState機能を受け取れるThunk関数を書く。
  - 非同期処理関数をThunk関数内で書き、処理が終わったらdispathでstateを変更する。
- Sliceファイルに`Thunk関数を返すラップした関数`を実装する。
- View側でラップした関数をdispath()でコールする。

# 各ディレクトリの役割
## pages 
- このディレクト階層がWebページのルーティングになる。
- [ルーティング](https://qiita.com/G-awa/items/639f4f83aa4d97bc1f0d#%E3%83%AB%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)
## public
- 画像などのバイナリ置き場。
- コード内でbase URL (/)から参照できる。
## components
- 表示するUIブロックをコンポーネント単位で管理する。
## store
- 状態管理用のスクリプト。
- アプリ全体からアクセス出来るグローバル変数を定義する。
- 一括管理するために、ここ以外では状態管理を定義しない。
## styles
- cssなどのスタイルデータを管理する。
- 使い方を3種類に制限する。
  1. 全体に適応するスタイル
     - `src/styles/globals.css`
  2. コンポーネントごとに適応するスタイル
     - `src/styles/${component_name}.modules.css`
     - クラス名はキャメルケースで定義する。
     - ex) camelCase
  3. JS内での記入(CSS-in-JS)
     -「inline styles」を使う。
     - ex) `<p style={{ color: 'red' }}>hi there</p>`
     - [CSS Support](https://nextjs.org/docs/basic-features/built-in-css-support)
## interfaces
- オブジェクトの実装するべき能力(メソッド)を定義する。
- データ構造を操作するための送信方法を提供し、そのデータ構造が返信すべきデータの種類を明示する。
## modules
- 特定の機能を単体で行えるプログラムの実装。
- 外部ライブラリから利用する機能をラップするモジュールの実装。
## utils
- UIにもデータ操作にも関係のないプログラム。 