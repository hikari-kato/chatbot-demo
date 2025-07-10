// 環境変数ベースのセキュア設定
const GOOGLE_CONFIG = {
    // 本番環境では環境変数から取得、開発環境では設定値使用
    API_KEY: typeof process !== 'undefined' && process.env ? 
        process.env.GOOGLE_API_KEY : 
        'AIzaSyB60YUtYNZuGK6Ie8lknOolgdLZNXvFDqs',
    
    CLIENT_ID: typeof process !== 'undefined' && process.env ? 
        process.env.GOOGLE_CLIENT_ID : 
        '643050291076-qeu6qnkol3u38uoabbgp4a08sf3sh6a2.apps.googleusercontent.com',
    
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
    return GOOGLE_CONFIG.CLIENT_ID && GOOGLE_CONFIG.CLIENT_ID.includes('apps.googleusercontent.com');
}

// APIキーが設定されているかチェック
function isGoogleCalendarConfigured() {
    return GOOGLE_CONFIG.API_KEY && GOOGLE_CONFIG.API_KEY.startsWith('AIza');
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