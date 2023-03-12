// 申請時に署名する文章。
// 利用権 == 口頭OK == https://www.bunka.go.jp/seisaku/chosakuken/seidokaisetsu/gaiyo/riyohoho.html
export interface IApplicationJSON{
    // この申請書発行元のコントラクトアドレス
    applicationAddr: string;
    // 契約の名前
    name: string;
    // 契約の文言など
    discription: string;
    // 支払う料金
    licenseFees: number;
    // 使用するWork発行元のコントラクトアドレス
    workAddr: string;
    // 使用するWorkのトークン番号
    workId: number;
    // 著作者名
    leadAuthorName: string;
    // 著作者のウォレットアドレス
    leadAuthorAddr: string;
    // 作品のタイトル
    workTitle: string;
    // この申請書に署名する公開鍵(申請者のウォレットアドレス)
    applicantAddr: string;
    // 使用者の名前
    applicantName: string;
    // 使用者の連絡先(email or phone number, etc...)
    applicantContact: string;
    // 使用する場所(web site or address, etc...)
    useLocation: string;
    // 使用目的(DJ, Radio, cover song, etc...)
    useDetails: string;
    // Unixtimeを使用。フロントではISO8601拡張形式(YYYY-MM-DDThh:mm:ss)
    // 使用する期間
    startDate: number;
    endDate: number;
    // 申請を引き下げる日時
    // 誰も承認しなければ自動的に`licenseFees`を返金する。
    cancellationDate: number;
    createdDate: number;
}