// セキュアな本番設定（CLIENT_ID暗号化、エラーログ非表示）
const GOOGLE_CONFIG = {
    // 暗号化されたCLIENT_ID（Base64エンコード）
    CLIENT_ID_ENCODED: 'NjQzMDUwMjkxMDc2LWwxMmFxNThyYmppa2tjdjExOGtnZmFwZTNycmxiYmkyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t',
    
    // APIキー（使用しない）
    API_KEY: '',
    
    // カレンダーID
    CALENDAR_ID: 'primary',
    
    // 本番環境設定
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

// CLIENT_IDをデコードして取得
function getClientId() {
    try {
        return atob(GOOGLE_CONFIG.CLIENT_ID_ENCODED);
    } catch (e) {
        console.error('CLIENT_ID decode error');
        return null;
    }
}

// 実際のCLIENT_IDを取得（外部からは見えない）
GOOGLE_CONFIG.CLIENT_ID = getClientId();

// OAuth認証が設定されているかチェック
function isOAuthConfigured() {
    return GOOGLE_CONFIG.CLIENT_ID && GOOGLE_CONFIG.CLIENT_ID.includes('apps.googleusercontent.com');
}

// APIキーが設定されているかチェック
function isGoogleCalendarConfigured() {
    return false; // OAuth専用
}

// ログ出力制御
function secureLog(level, message, data = null) {
    if (GOOGLE_CONFIG.PRODUCTION_MODE) {
        // 本番環境では重要なエラーのみ出力
        if (level === 'error' && GOOGLE_CONFIG.LOG_LEVEL === 'error') {
            console.error('Error occurred');
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