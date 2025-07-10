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
    WORK_KEYWORDS: ['出社', '出勤', '会社', 'オフィス', 'office', '勤務']
};

// OAuth認証が設定されているかチェック
function isOAuthConfigured() {
    return false; // GitHub Pagesではfalseに固定
}

// APIキーが設定されているかチェック（旧バージョンとの互換性）
function isGoogleCalendarConfigured() {
    return false; // GitHub Pagesではfalseに固定
}