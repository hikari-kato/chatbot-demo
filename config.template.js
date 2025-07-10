// 設定テンプレートファイル（GitHubで公開）
// 使用方法：このファイルを config.private.js にコピーして認証情報を設定してください

const GOOGLE_CONFIG = {
    // Google Cloud ConsoleでAPIキーを取得して設定してください
    API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
    
    // OAuth 2.0 クライアントID（Google Cloud Console > Credentials で作成）
    CLIENT_ID: 'YOUR_OAUTH_CLIENT_ID_HERE.apps.googleusercontent.com',
    
    // カレンダーID
    CALENDAR_ID: 'primary',
    
    // 本番環境ではOAuth認証を使用
    USE_MOCK_DATA: false,
    
    // OAuth設定
    OAUTH_SCOPES: ['https://www.googleapis.com/auth/calendar.readonly'],
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    
    // 検索対象期間（日数）
    SEARCH_DAYS: 30,
    
    // 出社関連のキーワード
    WORK_KEYWORDS: ['出社', '出勤', '会社', 'オフィス', 'office', '勤務'],
    
    // 本番環境フラグ
    PRODUCTION_MODE: true,
    
    // ログレベル（本番では'error'のみ）
    LOG_LEVEL: 'error'
};

// OAuth認証が設定されているかチェック
function isOAuthConfigured() {
    return GOOGLE_CONFIG.CLIENT_ID && GOOGLE_CONFIG.CLIENT_ID !== 'YOUR_OAUTH_CLIENT_ID_HERE.apps.googleusercontent.com';
}

// APIキーが設定されているかチェック
function isGoogleCalendarConfigured() {
    return GOOGLE_CONFIG.API_KEY && GOOGLE_CONFIG.API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE';
}

// ログ出力制御
function secureLog(level, message, data = null) {
    if (GOOGLE_CONFIG.PRODUCTION_MODE) {
        // 本番環境では重要なエラーのみ出力
        if (level === 'error' && GOOGLE_CONFIG.LOG_LEVEL === 'error') {
            console.error('エラーが発生しました');
        }
        return;
    }
    
    // 開発環境では詳細ログを出力
    if (data) {
        console[level](message, data);
    } else {
        console[level](message);
    }
}

// グローバルなログ関数として使用
window.secureLog = secureLog;