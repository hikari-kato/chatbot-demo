// Google Calendar API設定
const GOOGLE_CONFIG = {
    // Google Cloud ConsoleでAPIキーを取得して設定してください
    API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
    
    // OAuth 2.0 クライアントID（Google Cloud Console > Credentials で作成）
    CLIENT_ID: 'YOUR_OAUTH_CLIENT_ID_HERE.apps.googleusercontent.com',
    
    // Google Calendar ID
    CALENDAR_ID: 'primary', // OAuth認証後は 'primary' が使用可能
    
    // OAuth認証を使用する場合は false、モックデータを使用する場合は true
    USE_MOCK_DATA: true,
    
    // OAuth設定
    OAUTH_SCOPES: ['https://www.googleapis.com/auth/calendar.readonly'],
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    
    // 検索対象期間（日数）
    SEARCH_DAYS: 30,
    
    // 出社関連のキーワード（カレンダーイベントのタイトルに含まれるキーワード）
    WORK_KEYWORDS: ['出社', '出勤', '会社', 'オフィス', 'office', '勤務']
};

// OAuth認証が設定されているかチェック
function isOAuthConfigured() {
    return GOOGLE_CONFIG.CLIENT_ID && GOOGLE_CONFIG.CLIENT_ID !== 'YOUR_OAUTH_CLIENT_ID_HERE.apps.googleusercontent.com';
}

// APIキーが設定されているかチェック（旧バージョンとの互換性）
function isGoogleCalendarConfigured() {
    return GOOGLE_CONFIG.API_KEY && GOOGLE_CONFIG.API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE';
}