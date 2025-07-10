# 社内チャットボット

社内でよくある質問に自動で答えるチャットボットです。Google Calendar APIと連携して出社予定を取得できます。

## 機能

- **固定応答**
  - Wi-Fiのパスワード
  - ゴミの日
  
- **動的応答**
  - 出社予定（Google Calendar API連携）

## セットアップ

### 1. Google Calendar API の設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成またはプロジェクトを選択
3. APIs & Services > Library から「Google Calendar API」を有効化
4. APIs & Services > Credentials で「APIキー」を作成
5. APIキーを作成後、必要に応じて制限を設定

### 2. APIキーの設定

`config.js` ファイルでAPIキーを設定してください：

```javascript
const GOOGLE_CONFIG = {
    API_KEY: 'あなたのAPIキーをここに設定',
    CALENDAR_ID: 'primary', // 個人カレンダーの場合
    // その他の設定...
};
```

### 3. カレンダーの準備

Google カレンダーに出社予定のイベントを追加してください。以下のキーワードがタイトルに含まれるイベントが出社予定として認識されます：

- 出社
- 出勤
- 会社
- オフィス
- office
- 勤務

### 4. 使用方法

1. `index.html` をブラウザで開く
2. 「出社する日はいつですか？」などと質問する
3. APIキーが設定されている場合はGoogle Calendar から実際の予定を取得
4. 設定されていない場合はモックデータ（月・水・木・金）を表示

## ファイル構成

```
chatbot-demo/
├── index.html      # メインのHTMLファイル
├── style.css       # スタイルシート
├── script.js       # チャットボットの主要ロジック
├── config.js       # Google Calendar API設定
└── README.md       # このファイル
```

## 注意事項

- APIキーは公開しないよう注意してください
- GitHub Pages で公開する場合はAPIキーの取り扱いに十分注意してください
- 本番環境では OAuth 2.0 認証の使用を推奨します

## GitHub Pages での公開

1. GitHubリポジトリにファイルをアップロード
2. Settings > Pages で公開設定
3. APIキーを設定して使用開始