// GitHub Pages用のパブリック設定（モックデータ使用）
const GOOGLE_CONFIG = {
    // GitHub Pagesではモックデータを使用
    API_KEY: '',
    CLIENT_ID: '',
    CALENDAR_ID: 'primary',
    
    // モックデータを使用する設定
    USE_MOCK_DATA: true,
    
    // OAuth設定
    OAUTH_SCOPES: ['https://www.googleapis.com/auth/calendar.readonly'],
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    
    // 検索対象期間（日数）
    SEARCH_DAYS: 30,
    
    // 出社関連のキーワード（カレンダーイベントのタイトルに含まれるキーワード）
    WORK_KEYWORDS: ['出社', '出勤', '会社', 'オフィス', 'office', '勤務'],
    
    // 本番環境フラグ
    PRODUCTION_MODE: true,
    
    // ログレベル（本番では'error'のみ）
    LOG_LEVEL: 'error'
};

// OAuth認証が設定されているかチェック
function isOAuthConfigured() {
    return false; // GitHub Pagesではfalseに固定
}

// APIキーが設定されているかチェック（旧バージョンとの互換性）
function isGoogleCalendarConfigured() {
    return false; // GitHub Pagesではfalseに固定
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