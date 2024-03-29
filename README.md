# 備考
これは初期の音響LINE Botのスクリプトです。
現在は使用していません。現在は[音響LINE BOT(GCP版)](https://github.com/StreetCornerSymphonyDevelopers/micpractice)を使用しています。

# 概要
私が所属しているアカペラサークルの係の1つである、音響やマイク練係(説明は後述)の仕事を楽にするために書いたプログラム(GoogleAppsScriptで作成＆動作)

# このReadMeを理解するのに必要な用語
主要な用語だけ本項目で紹介する。なお他の細かい用語に関しては、必要性が生じたらその段階で軽く紹介する。
## セクション
私が所属しているアカペラサークルに存在する係のようなもの。原則として4年間同じセクションに所属する必要がある。

## 音響
上記セクションの内の1つ。音響機材(マイク等)を管理したり、後述のマイク練を運営したりする。

## バンド
私の所属しているアカペラサークルでは、5,6人程度の「バンド」単位で活動することが多い。バンド毎に曲を練習したりする。

## マイク練
バンドが行う、学校の施設＆サークル所有のマイク・スピーカ等の機材を用いた練習のこと。マイク練を行える数には限りがある＆音響が管理している音響機材を用いて行う練習のため、バンドがマイク練を行いたい時限を申請し、事情に応じて音響が承認・否認する形を取っている。なお同じ時限に3つまで複数バンドのマイク練を入れることが出来る(これを分割という。この分割の順番決定等の処理もマイク練係が行う)。

## マイク練係
音響の中に設置された係のこと。約3ヶ月の任期で音響から1人選出される。上記マイク練の承認・否認から部屋の予約管理まで、マイク練に関することをすべて行う。本プログラムの目的はこのマイク練係の仕事を減らすことである。

## SCSポータル
サークルのHPのこと。[こちら](https://acappellascs.jp)

# 本プログラムの趣旨
SCSポータルは上記に記載のサークルHPのことである。マイクの管理にはサークルHPの他にGoogleカレンダーを併用している。これの理由として、マイク練を一覧化することが出来るためである。なおこのGoogleカレンダーの登録もマイク練かかりが行っている。
## 本プログラムが実装される前のマイク練の流れ
マイク練が申請されると、マイク練係が②から⑨の全てのことを行っていた。予定出しとは、1週間分のマイク練日程をマイク練係が音響のLINEグループに送り返信してもらうことで、マイク練時に音響機材の準備に来れる人を把握するための作業である。
![図1](https://user-images.githubusercontent.com/33088346/120684919-3b325100-c4da-11eb-911d-cc38c07c1531.png)

## どのようにマイク練係の仕事を変えようとしたのか
下記のように、人で行う必要のない仕事はプログラムによる自動化を図ろうとした。
![図3](https://user-images.githubusercontent.com/33088346/120685827-4639b100-c4db-11eb-9a96-940e6264ec8e.png)

## 本レポジトリ内のプログラムの内容
上記で示したプログラムの内下記の青枠内を含んだプログラムである。なお③⑤⑦に関してはSCSポータルの改修により実現したため、本プログラムには入っていない。
![図2](https://user-images.githubusercontent.com/33088346/120684910-3a012400-c4da-11eb-8767-dec5bff3ac68.png)

# 本プログラムの構成
本プログラムは[Google Apps Script](https://developers.google.com/gsuite/aspects/appsscript?hl=ja)で作成し、所定の曜日・時間に自動的にスクリプトが起動するように設定した。プログラムは[こちら](https://github.com/mugitti9/MikePractice/blob/main/MikeManagement.gs)に記載されている。またLINEへのpushやpostを受け取る関数などを設定することにより、LINEとの通信も実現している。

## プログラムの詳細
LINEのアクセストークンなど環境変数は、Google Drive内のSpreadSheetに記入することにより、セキュリティを高めた。またそのSpreadSheetに、送信先のLINEグループIDを格納することによって、送信先のグループを変更できるようにした。
以下関数の説明に入る。

### MikeManagement
音響への予定だしを自動的に作成し、LINEトークルームに送信する。毎週日曜日にスクリプトの定期起動が設定されている。例えば5月3日(月)の2限と5月7日(金)の3,4限にマイク練が入っている場合

5月3日(月)
②
5月7日(金)
③
④

のように作成され、それがLINEトークルームに送信される。

### AnnounceRoom
毎朝マイク練の部屋を取得し、その部屋名を送信する。毎朝8-9時にこのスクリプトの定期起動が設定されている。

### doPost(e)
LineからPostが送られてきたときに起動をする。

### ReplyMessageGroupChange(e, type)
上記doPostが、"予定出しグループ変更"または"部屋アナウンスグループ変更"のテキストで送信されたときに起動する。SpreadSheetの値を変更することによって、予定だし(MikeManagement)やマイク練部屋のアナウンス(AnnounceRoom)の送信先を変更する。

### Push(message,send_id)
messageの内容をsend_idのトークルームに送信する。LINEに送信を行う全てのスクリプトに用いられている関数である。
