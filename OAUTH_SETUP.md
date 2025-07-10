# OAuth 2.0 認証セットアップ手順

Google Calendar APIの完全アクセスのためのOAuth 2.0認証設定方法です。

## 📋 前提条件

- Google Cloud Console プロジェクト
- Calendar API が有効化済み
- 作業用ドメイン（localhost または実際のドメイン）

## 🔧 Google Cloud Console 設定

### 1. OAuth 2.0 クライアント ID の作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを選択
3. **APIs & Services** → **Credentials** に移動
4. **+ CREATE CREDENTIALS** → **OAuth client ID** を選択

### 2. アプリケーションタイプの選択

**Web application** を選択

### 3. 認証済みリダイレクト URI の設定

以下のURIを追加：

**開発環境:**
```
http://localhost:8000
http://localhost:3000
http://127.0.0.1:8000
```

**本番環境:**
```
https://yourdomain.com
https://youruser.github.io
```

### 4. クライアント ID をコピー

作成後、**Client ID** をコピーして保存

## ⚙️ アプリケーション設定

### config.js の更新

```javascript
const GOOGLE_CONFIG = {
    // 既存のAPIキー
    API_KEY: 'your-api-key',
    
    // 新しく作成したOAuth クライアントID
    CLIENT_ID: 'your-client-id.apps.googleusercontent.com',
    
    // OAuth認証を使用
    USE_MOCK_DATA: false,
    
    // その他の設定...
};
```

## 🌐 本番環境での追加設定

### GitHub Pages の場合

1. **Settings** → **Pages** でサイトURLを確認
2. そのURLを OAuth 設定の認証済みリダイレクト URI に追加

### カスタムドメインの場合

1. ドメインのHTTPS設定を確認
2. `https://yourdomain.com` を認証済みリダイレクト URI に追加

## 🔒 セキュリティ注意事項

### クライアント ID の公開

- OAuth クライアント ID は公開されても安全です
- ただし、不正使用を防ぐため適切なリダイレクト URI 制限が重要

### APIキーとの併用

- OAuth認証時はAPIキーは不要
- ただし、フォールバック用に設定を維持することを推奨

## 🎯 動作確認

### 1. 初期状態
- ページ読み込み時：「未認証」表示
- ログインボタン：「Googleでログイン」

### 2. 認証後
- 状態表示：「認証済み」（緑色）
- ボタン：「サインアウト」
- カレンダー取得：実際のGoogleカレンダーから取得

### 3. エラーパターン
- OAuth設定なし：ボタン非表示、モックデータ使用
- 認証失敗：「認証失敗」表示、モックデータに自動フォールバック

## 🔄 トラブルシューティング

### よくあるエラーと解決方法

#### 1. `redirect_uri_mismatch`
**原因**: リダイレクト URI が一致しない
**解決**: Google Cloud Console で正確な URL を設定

#### 2. `invalid_client`
**原因**: クライアント ID が正しくない
**解決**: config.js のクライアント ID を確認

#### 3. `access_denied`
**原因**: ユーザーが認証を拒否
**解決**: 再度ログインボタンをクリック

### デバッグ方法

ブラウザの Developer Tools → Console で以下を確認：

```
OAuth初期化を開始...
OAuth初期化完了
OAuth認証成功
OAuth経由でカレンダーイベント取得開始
OAuth取得イベント数: X
```

## 📱 完成後の機能

- ✅ 実際のGoogleカレンダーからの出社予定取得
- ✅ ユーザー認証状態の可視化
- ✅ ワンクリックでのサインイン/アウト
- ✅ 認証失敗時の自動フォールバック
- ✅ セキュアな認証フロー

これでチャットボットが完全なGoogle Calendar連携を実現します！