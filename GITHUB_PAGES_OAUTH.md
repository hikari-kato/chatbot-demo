# GitHub Pages + OAuth 設定ガイド

## 🌐 GitHub Pages 公開手順

### 1. リポジトリ作成・アップロード
```bash
# 1. GitHubで新しいリポジトリ作成: chatbot-demo
# 2. ローカルで git 初期化
git init
git add .
git commit -m "初回コミット: 社内チャットボット"
git branch -M main
git remote add origin https://github.com/hikari-kato/chatbot-demo.git
git push -u origin main

# 3. GitHub Pages を有効化
# Settings > Pages > Source: Deploy from a branch > main > Save
```

### 2. 生成されるURL
```
https://hikari-kato.github.io/chatbot-demo
```

## 🔧 Google Cloud Console OAuth 設定

### 認証済みリダイレクト URI に追加する URL

以下の **すべて** を追加してください：

```
# GitHub Pages メイン URL
https://hikari-kato.github.io/chatbot-demo

# GitHub Pages ルート（念のため）
https://hikari-kato.github.io

# 開発用ローカル環境
http://localhost:8000
http://localhost:3000
http://127.0.0.1:8000
```

### 設定手順
1. [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** > **Credentials**
3. OAuth 2.0 Client ID を選択
4. **Authorized redirect URIs** セクション
5. **+ ADD URI** で上記URLを1つずつ追加
6. **SAVE** をクリック

## ⚙️ config.js 本番用設定

公開前に以下を更新：

```javascript
const GOOGLE_CONFIG = {
    // 本番用APIキー（必要に応じて制限設定）
    API_KEY: 'your-production-api-key',
    
    // OAuth クライアントID
    CLIENT_ID: 'your-client-id.apps.googleusercontent.com',
    
    // OAuth認証を有効化
    USE_MOCK_DATA: false,
    
    // カレンダーID（OAuth後は primary が使用可能）
    CALENDAR_ID: 'primary',
    
    // その他設定...
};
```

## 🔒 セキュリティ設定

### APIキー制限（推奨）

Google Cloud Console で APIキー に制限を設定：

#### HTTP リファラー制限
```
https://hikari-kato.github.io/*
https://localhost:*
```

#### API制限
- Calendar API のみに制限

### OAuth スコープ
最小権限の原則で Calendar readonly のみ：
```javascript
OAUTH_SCOPES: ['https://www.googleapis.com/auth/calendar.readonly']
```

## 📱 公開後の動作確認

### 1. ページアクセス
```
https://hikari-kato.github.io/chatbot-demo
```

### 2. 機能テスト
- ✅ **基本機能**: Wi-Fi、ゴミの日の質問
- ✅ **OAuth認証**: 「Googleでログイン」ボタン
- ✅ **カレンダー連携**: 認証後の出社予定取得
- ✅ **フォールバック**: 認証失敗時のモックデータ表示

### 3. エラー対応
- `redirect_uri_mismatch` → URLを再確認
- `access_denied` → 再度ログイン試行
- `404 Not Found` → GitHub Pages設定を確認

## 🎯 完成チェックリスト

- [ ] GitHubリポジトリ作成・ファイルアップロード
- [ ] GitHub Pages有効化
- [ ] 公開URLの確認
- [ ] Google Cloud Console OAuth設定
- [ ] リダイレクトURI追加
- [ ] config.js本番設定
- [ ] 公開サイトでの動作確認
- [ ] OAuth認証テスト
- [ ] カレンダー連携テスト

これで完全なGoogle Calendar連携チャットボットがGitHub Pagesで公開されます！