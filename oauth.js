// Google OAuth 2.0 認証管理
class GoogleOAuth {
    constructor() {
        this.isInitialized = false;
        this.isSignedIn = false;
        this.tokenClient = null;
        this.accessToken = null;
    }

    async initialize() {
        try {
            if (!isOAuthConfigured()) {
                console.log('OAuth設定が見つかりません。モックデータを使用します。');
                return false;
            }

            // Google APIs ライブラリの初期化
            await new Promise((resolve) => {
                gapi.load('client', resolve);
            });

            await gapi.client.init({
                apiKey: GOOGLE_CONFIG.API_KEY,
                discoveryDocs: [GOOGLE_CONFIG.DISCOVERY_DOC],
            });

            // OAuth 2.0 トークンクライアントの初期化
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CONFIG.CLIENT_ID,
                scope: GOOGLE_CONFIG.OAUTH_SCOPES.join(' '),
                callback: (response) => {
                    if (response.error) {
                        console.error('OAuth認証エラー:', response.error);
                        this.onAuthError(response.error);
                    } else {
                        console.log('OAuth認証成功');
                        this.accessToken = response.access_token;
                        this.isSignedIn = true;
                        this.onAuthSuccess();
                    }
                },
            });

            this.isInitialized = true;
            console.log('OAuth初期化完了');
            return true;

        } catch (error) {
            console.error('OAuth初期化エラー:', error);
            return false;
        }
    }

    async signIn() {
        if (!this.isInitialized) {
            console.error('OAuth が初期化されていません');
            return false;
        }

        if (this.isSignedIn && this.accessToken) {
            console.log('既にサインイン済みです');
            return true;
        }

        return new Promise((resolve) => {
            this.onAuthSuccess = () => resolve(true);
            this.onAuthError = () => resolve(false);
            
            // OAuth認証フローを開始
            this.tokenClient.requestAccessToken();
        });
    }

    async signOut() {
        if (this.accessToken) {
            google.accounts.oauth2.revoke(this.accessToken);
            this.accessToken = null;
        }
        this.isSignedIn = false;
        console.log('サインアウト完了');
    }

    async getCalendarEvents() {
        if (!this.isSignedIn || !this.accessToken) {
            throw new Error('OAuth認証が必要です');
        }

        const now = new Date();
        const endDate = new Date();
        endDate.setDate(now.getDate() + GOOGLE_CONFIG.SEARCH_DAYS);

        try {
            const response = await gapi.client.calendar.events.list({
                calendarId: GOOGLE_CONFIG.CALENDAR_ID,
                timeMin: now.toISOString(),
                timeMax: endDate.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
                maxResults: 50,
            });

            console.log('OAuth経由でカレンダーイベント取得完了:', response.result.items?.length || 0);
            return response.result.items || [];

        } catch (error) {
            console.error('カレンダーイベント取得エラー:', error);
            throw error;
        }
    }

    getAuthStatus() {
        return {
            isInitialized: this.isInitialized,
            isSignedIn: this.isSignedIn,
            hasToken: !!this.accessToken
        };
    }
}

// グローバルインスタンス
const googleOAuth = new GoogleOAuth();