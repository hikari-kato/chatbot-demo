# 🚀 セットアップ手順

## ⚠️ 重要: 初回セットアップ

このリポジトリをクローンした後、以下の手順を必ず実行してください：

### 1. 設定ファイルの作成

```bash
# config.example.js をコピーして config.js を作成
cp config.example.js config.js
```

### 2. Google Cloud Console設定

#### APIキーの取得
1. [Google Cloud Console](https://console.cloud.google.com/)
2. 新しいプロジェクトを作成
3. **APIs & Services** → **Library** → **Google Calendar API** を有効化
4. **APIs & Services** → **Credentials** → **+ CREATE CREDENTIALS** → **API key**
5. 作成されたAPIキーをコピー

#### OAuth 2.0 クライアントIDの作成
1. **APIs & Services** → **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**
2. **Web application** を選択
3. **Authorized redirect URIs** に以下を追加：
   ```
   https://hikari-kato.github.io/chatbot-demo
   https://hikari-kato.github.io
   http://localhost:8000
   ```
4. 作成されたクライアントIDをコピー

### 3. config.js の設定

作成した `config.js` ファイルを編集：

```javascript
const GOOGLE_CONFIG = {
    // 取得したAPIキーを設定
    API_KEY: 'AIzaSy...',
    
    // 取得したOAuthクライアントIDを設定
    CLIENT_ID: 'your-client-id.apps.googleusercontent.com',
    
    // OAuth認証を使用する場合は false に設定
    USE_MOCK_DATA: false,
    
    // その他の設定はそのまま...
};
```

### 4. 動作確認

1. ローカルサーバーで起動：
   ```bash
   # Python 3の場合
   python -m http.server 8000
   
   # Node.jsの場合
   npx serve .
   ```

2. ブラウザで `http://localhost:8000` にアクセス

3. 「Googleでログイン」をクリックして認証テスト

## 🔒 セキュリティ注意事項

- **config.js は絶対にコミットしないでください**
- APIキーとクライアントIDは秘密情報として管理
- 本番環境では適切なAPI制限を設定

## 📱 GitHub Pages公開

設定完了後、GitHub Pagesで公開できます。
詳細は `GITHUB_PAGES_OAUTH.md` を参照してください。

## 🆘 トラブルシューティング

問題が発生した場合は：
1. `OAUTH_SETUP.md` の詳細手順を確認
2. ブラウザのコンソールでエラーメッセージを確認
3. Google Cloud Consoleの設定を再確認