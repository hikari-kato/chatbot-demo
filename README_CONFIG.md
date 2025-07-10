# 設定ファイルの使用方法

## 🌐 GitHub Pages（公開サイト）

GitHub Pagesでは**モックデータ**を使用します：
- `config.public.js` - モックデータ使用
- OAuth認証ボタンは非表示
- 「出社する日はいつですか？」で予想される出社パターンを表示

**URL**: https://hikari-kato.github.io/chatbot-demo

## 🔧 ローカル開発環境でのセットアップ

### 1. 設定ファイルの作成
```bash
# config.template.js を config.private.js にコピー
cp config.template.js config.private.js
```

### 2. 認証情報の設定
`config.private.js`を編集して、以下の値を設定してください：

```javascript
const GOOGLE_CONFIG = {
    // Google Cloud ConsoleのAPIキー
    API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
    
    // OAuth 2.0 クライアントID
    CLIENT_ID: 'YOUR_OAUTH_CLIENT_ID_HERE.apps.googleusercontent.com',
    
    // その他の設定...
};
```

### 3. Google Cloud Console設定

#### APIキーの作成
1. [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. + CREATE CREDENTIALS → API key
4. 制限設定:
   - HTTP referrers: `https://yourdomain.com/*`
   - API restrictions: Google Calendar API のみ

#### OAuth Client IDの作成
1. + CREATE CREDENTIALS → OAuth client ID
2. Web application を選択
3. Authorized redirect URIs に追加:
   - `https://yourdomain.com`
   - `http://localhost:8000`

### 4. OAuth同意画面
1. APIs & Services → OAuth consent screen
2. External を選択
3. 必要な情報を入力
4. Test users に使用するGoogleアカウントを追加

## 🔒 セキュリティ注意事項

- `config.private.js`は`.gitignore`で除外されています
- 認証情報をGitリポジトリにコミットしないでください
- APIキーには適切な制限を設定してください
- 定期的に認証情報をローテーションしてください

## 📂 ファイル構成

```
config.public.js    ← GitHub Pages用（モックデータ）
config.template.js  ← 設定テンプレート（GitHub公開）
config.private.js   ← 実際の設定（.gitignoreで除外）
```

## 🔄 設定の切り替え方法

### GitHub Pages用（モックデータ）
```html
<script src="config.public.js"></script>
```

### ローカル開発用（実際のAPI連携）
```html
<script src="config.private.js"></script>
```

`index.html`の40行目を変更して設定を切り替えます。

## 🚀 使用方法

設定完了後、ローカルサーバーで起動:

```bash
# 簡易サーバー起動
python -m http.server 8000
# または
npx serve .
```

http://localhost:8000 でアクセス可能です。