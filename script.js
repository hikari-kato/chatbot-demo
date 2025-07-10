class Chatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.authButton = document.getElementById('authButton');
        this.authStatus = document.getElementById('authStatus');
        
        this.initializeEventListeners();
        this.showInitialTime();
        this.initializeOAuth();
    }
    
    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        this.authButton.addEventListener('click', () => this.handleAuthClick());
    }
    
    async initializeOAuth() {
        try {
            console.log('OAuth初期化を開始...');
            const initialized = await googleOAuth.initialize();
            
            if (initialized) {
                this.updateAuthUI();
                console.log('OAuth初期化完了');
            } else {
                console.log('OAuth設定なし、モックモード継続');
                this.authButton.style.display = 'none';
            }
        } catch (error) {
            console.error('OAuth初期化エラー:', error);
            this.updateAuthStatus('初期化エラー', 'error');
        }
    }
    
    async handleAuthClick() {
        const status = googleOAuth.getAuthStatus();
        
        if (status.isSignedIn) {
            // サインアウト
            await googleOAuth.signOut();
            this.updateAuthUI();
            this.addMessage('Googleアカウントからサインアウトしました。', 'bot');
        } else {
            // サインイン
            this.authButton.disabled = true;
            this.updateAuthStatus('認証中...', '');
            
            const success = await googleOAuth.signIn();
            
            if (success) {
                this.updateAuthUI();
                this.addMessage('Googleアカウントでサインインしました！実際のカレンダーデータを取得できます。', 'bot');
            } else {
                this.updateAuthStatus('認証失敗', 'error');
                this.addMessage('Googleアカウント認証に失敗しました。', 'bot');
            }
            
            this.authButton.disabled = false;
        }
    }
    
    updateAuthUI() {
        const status = googleOAuth.getAuthStatus();
        
        if (status.isSignedIn) {
            this.authButton.textContent = 'サインアウト';
            this.updateAuthStatus('認証済み', 'authenticated');
        } else if (status.isInitialized) {
            this.authButton.textContent = 'Googleでログイン';
            this.updateAuthStatus('未認証', '');
        } else {
            this.authButton.textContent = 'OAuth未設定';
            this.updateAuthStatus('モックデータ使用中', '');
        }
    }
    
    updateAuthStatus(text, className) {
        this.authStatus.textContent = text;
        this.authStatus.className = `auth-status ${className}`;
    }
    
    showInitialTime() {
        const initialMessage = this.chatMessages.querySelector('.bot-message .message-time');
        if (initialMessage) {
            initialMessage.textContent = this.formatTime(new Date());
        }
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (message === '') return;
        
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        setTimeout(async () => {
            const response = await this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = text;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(new Date());
        
        messageDiv.appendChild(bubbleDiv);
        messageDiv.appendChild(timeDiv);
        this.chatMessages.appendChild(messageDiv);
        
        this.scrollToBottom();
    }
    
    async generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // 固定応答（ルールベース）
        if (this.containsKeywords(lowerMessage, ['wifi', 'wi-fi', 'ワイファイ', 'パスワード'])) {
            return 'Wi-Fiのパスワードは office-1234 です。';
        }
        
        if (this.containsKeywords(lowerMessage, ['ゴミ', 'ごみ', 'ゴミの日', 'ごみの日'])) {
            return 'ゴミの日は月曜と木曜の朝です。';
        }
        
        // 動的応答（Google Calendar API連携）
        if (this.containsKeywords(lowerMessage, ['出社', '出勤', '会社', 'オフィス'])) {
            console.log('出社予定の質問を検出しました');
            return await this.getWorkScheduleResponse();
        }
        
        // その他の質問
        if (this.containsKeywords(lowerMessage, ['こんにちは', 'こんばんは', 'おはよう', 'hello', 'hi'])) {
            return 'こんにちは！何かご質問はありますか？';
        }
        
        if (this.containsKeywords(lowerMessage, ['ありがとう', 'ありがとうございます', 'thanks', 'thank you'])) {
            return 'どういたしまして！他にもご質問があればお気軽にどうぞ。';
        }
        
        if (this.containsKeywords(lowerMessage, ['ヘルプ', 'help', '使い方', '何ができる'])) {
            return '私は以下のご質問にお答えできます：\n・Wi-Fiのパスワード\n・ゴミの日\n・出社予定日\n\nお気軽にお聞きください！';
        }
        
        // デバッグ用のテスト機能を追加
        if (this.containsKeywords(lowerMessage, ['テスト', 'test', 'デバッグ', 'debug'])) {
            return `API設定テスト:\n・APIキー: ${isGoogleCalendarConfigured() ? '設定済み' : '未設定'}\n・カレンダーID: ${GOOGLE_CONFIG.CALENDAR_ID}\n・検索日数: ${GOOGLE_CONFIG.SEARCH_DAYS}日\n・キーワード: ${GOOGLE_CONFIG.WORK_KEYWORDS.join(', ')}`;
        }
        
        // API接続テスト機能
        if (this.containsKeywords(lowerMessage, ['接続テスト', 'api接続', 'apiテスト'])) {
            return await this.testAPIConnection();
        }
        
        // デフォルト応答
        return 'すみません、その質問にはお答えできません。以下のことについてお聞きください：\n・Wi-Fiのパスワード\n・ゴミの日\n・出社予定日';
    }
    
    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }
    
    async getWorkScheduleResponse() {
        console.log('getWorkScheduleResponse() 開始');
        try {
            let schedule;
            
            const oauthStatus = googleOAuth.getAuthStatus();
            
            if (oauthStatus.isSignedIn && !GOOGLE_CONFIG.USE_MOCK_DATA) {
                console.log('OAuth認証済み - Google Calendar API使用開始');
                
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => {
                        console.log('API呼び出しタイムアウト (10秒経過)');
                        reject(new Error('API呼び出しがタイムアウトしました'));
                    }, 10000)
                );
                
                schedule = await Promise.race([
                    this.fetchOAuthCalendarEvents(),
                    timeoutPromise
                ]);
                console.log('OAuth API呼び出し完了:', schedule);
                
            } else if (isGoogleCalendarConfigured() && !GOOGLE_CONFIG.USE_MOCK_DATA && !oauthStatus.isInitialized) {
                console.log('APIキー使用 - Google Calendar API使用開始');
                
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => {
                        console.log('API呼び出しタイムアウト (10秒経過)');
                        reject(new Error('API呼び出しがタイムアウトしました'));
                    }, 10000)
                );
                
                schedule = await Promise.race([
                    this.fetchGoogleCalendarEvents(),
                    timeoutPromise
                ]);
                console.log('APIキー API呼び出し完了:', schedule);
                
            } else {
                console.log('モックデータ使用 (USE_MOCK_DATA=true、認証なし、またはAPI設定なし)');
                schedule = this.getMockWorkSchedule();
            }
            
            let responseText;
            const isUsingMockData = !oauthStatus.isSignedIn;
            
            if (schedule.length === 0) {
                responseText = '今後の出社予定はありません。';
            } else {
                const nextWorkDay = schedule[0];
                const dateStr = this.formatDate(nextWorkDay.date);
                responseText = `次の出社予定日は${dateStr}です。`;
                
                if (schedule.length > 1) {
                    responseText += '\n\n今後の出社予定：';
                    schedule.slice(0, 3).forEach(event => {
                        responseText += `\n・${this.formatDate(event.date)}`;
                    });
                }
                
                if (isUsingMockData) {
                    responseText += '\n\n📝 これは予想される出社パターン（月・水・木・金）です。';
                    responseText += '\n実際のカレンダー連携にはOAuth認証が必要です。';
                }
            }
            
            console.log('レスポンステキスト生成完了:', responseText);
            console.log('getWorkScheduleResponse() 正常終了');
            return responseText;
            
        } catch (error) {
            console.error('カレンダー取得エラー:', error);
            console.error('エラー詳細:', {
                message: error.message,
                stack: error.stack,
                apiKey: GOOGLE_CONFIG.API_KEY ? 'CONFIGURED' : 'NOT_CONFIGURED',
                calendarId: GOOGLE_CONFIG.CALENDAR_ID
            });
            
            const fallbackSchedule = this.getMockWorkSchedule();
            let responseText;
            
            if (error.message && error.message.includes('403')) {
                responseText = `❌ API認証エラー\nCalendar APIが有効化されていないか、APIキーが無効です。\n\n📅 フォールバック予定:\n次の出社予定日は${this.formatDate(fallbackSchedule[0].date)}です。`;
            } else if (error.message && error.message.includes('400')) {
                responseText = `❌ APIリクエストエラー\n設定を確認してください。\n\n📅 フォールバック予定:\n次の出社予定日は${this.formatDate(fallbackSchedule[0].date)}です。`;
            } else if (error.message && error.message.includes('404')) {
                responseText = `❌ カレンダーが見つかりません\n\n解決方法:\n1. config.jsで CALENDAR_ID を個人のメールアドレスに変更\n2. または OAuth 2.0 認証を使用\n\n📅 フォールバック予定:\n次の出社予定日は${this.formatDate(fallbackSchedule[0].date)}です。`;
            } else {
                responseText = `❌ カレンダー取得エラー\n${error.message}\n\n📅 フォールバック予定:\n次の出社予定日は${this.formatDate(fallbackSchedule[0].date)}です。`;
            }
            
            return responseText;
        }
    }
    
    async fetchGoogleCalendarEvents() {
        const now = new Date();
        const endDate = new Date();
        endDate.setDate(now.getDate() + GOOGLE_CONFIG.SEARCH_DAYS);
        
        // まず primary を試す
        let calendarIds = [GOOGLE_CONFIG.CALENDAR_ID];
        
        // primary で 404 エラーの場合、よく使われる形式も試す
        if (GOOGLE_CONFIG.CALENDAR_ID === 'primary') {
            // Google アカウントのメールアドレスでも試してみる
            // この場合、ユーザーに設定してもらう必要があります
        }
        
        for (const calendarId of calendarIds) {
            try {
                const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
                    `key=${GOOGLE_CONFIG.API_KEY}&` +
                    `timeMin=${now.toISOString()}&` +
                    `timeMax=${endDate.toISOString()}&` +
                    `singleEvents=true&` +
                    `orderBy=startTime&` +
                    `maxResults=50`;
                
                console.log(`API呼び出し試行 (${calendarId}):`, url.replace(GOOGLE_CONFIG.API_KEY, 'HIDDEN_API_KEY'));
                console.log('リクエスト期間:', {
                    from: now.toISOString(),
                    to: endDate.toISOString()
                });
                
                const response = await fetch(url);
                console.log(`APIレスポンス状態 (${calendarId}):`, response.status, response.statusText);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`取得したイベント数 (${calendarId}):`, data.items ? data.items.length : 0);
                    return this.filterWorkEvents(data.items || []);
                }
                
                if (response.status === 404 && calendarId === 'primary') {
                    console.log('primary カレンダーが見つかりません。認証が必要な可能性があります。');
                    // primary で 404 の場合は続行して他の解決策を試す
                    continue;
                }
                
                // その他のエラーの場合は詳細を表示
                const errorText = await response.text();
                console.error(`APIエラーレスポンス (${calendarId}):`, errorText);
                
                let errorMessage = `Calendar API error: ${response.status}`;
                
                if (response.status === 403) {
                    if (errorText.includes('Calendar API has not been used')) {
                        errorMessage += ' - Calendar APIが有効化されていません。Google Cloud ConsoleでCalendar APIを有効にしてください。';
                    } else if (errorText.includes('API key')) {
                        errorMessage += ' - APIキーが無効です。正しいAPIキーを設定してください。';
                    } else {
                        errorMessage += ' - アクセス権限がありません。APIキーの設定とCalendar APIの有効化を確認してください。';
                    }
                } else if (response.status === 400) {
                    errorMessage += ' - リクエストが無効です。カレンダーIDやパラメータを確認してください。';
                } else {
                    errorMessage += ` - ${errorText}`;
                }
                
                throw new Error(errorMessage);
                
            } catch (error) {
                if (calendarId === calendarIds[calendarIds.length - 1]) {
                    // 最後のカレンダーIDでもエラーの場合
                    throw error;
                }
                console.log(`カレンダーID ${calendarId} でエラー、次を試行:`, error.message);
            }
        }
    }
    
    async fetchOAuthCalendarEvents() {
        console.log('OAuth経由でカレンダーイベント取得開始');
        
        try {
            const events = await googleOAuth.getCalendarEvents();
            console.log('OAuth取得イベント数:', events.length);
            return this.filterWorkEvents(events);
        } catch (error) {
            console.error('OAuth カレンダー取得エラー:', error);
            throw error;
        }
    }
    
    filterWorkEvents(events) {
        const workEvents = [];
        
        events.forEach(event => {
            const title = (event.summary || '').toLowerCase();
            const isWorkEvent = GOOGLE_CONFIG.WORK_KEYWORDS.some(keyword => 
                title.includes(keyword.toLowerCase())
            );
            
            if (isWorkEvent) {
                const startDate = event.start.date 
                    ? new Date(event.start.date + 'T00:00:00')
                    : new Date(event.start.dateTime);
                
                workEvents.push({
                    date: startDate,
                    title: event.summary || '出社予定',
                    isAllDay: !!event.start.date
                });
            }
        });
        
        return workEvents.sort((a, b) => a.date - b.date);
    }
    
    getMockWorkSchedule() {
        // モックデータ：今日から1週間の出社予定（月・水・木・金）
        const today = new Date();
        const schedule = [];
        
        for (let i = 1; i <= GOOGLE_CONFIG.SEARCH_DAYS; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5) { // 月曜(1)、水曜(3)、木曜(4)、金曜(5)
                schedule.push({
                    date: date,
                    title: '出社日',
                    isAllDay: true
                });
            }
        }
        
        return schedule;
    }
    
    async testAPIConnection() {
        try {
            const testUrl = `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CONFIG.CALENDAR_ID}?key=${GOOGLE_CONFIG.API_KEY}`;
            console.log('API接続テスト開始...');
            
            const response = await fetch(testUrl);
            console.log('テストレスポンス:', response.status, response.statusText);
            
            if (response.ok) {
                const data = await response.json();
                console.log('カレンダー情報:', data);
                return `✅ API接続成功！\nカレンダー名: ${data.summary || 'メインカレンダー'}\nタイムゾーン: ${data.timeZone || '不明'}`;
            } else {
                const errorText = await response.text();
                console.error('API接続エラー:', errorText);
                
                let errorMsg = `❌ API接続失敗 (${response.status})\n`;
                if (response.status === 403) {
                    errorMsg += '原因: Calendar APIが有効化されていないか、APIキーが無効です。';
                } else if (response.status === 400) {
                    errorMsg += '原因: APIキーの形式が正しくありません。';
                } else if (response.status === 404) {
                    errorMsg += '原因: カレンダーが見つかりません。';
                } else {
                    errorMsg += `詳細: ${errorText}`;
                }
                
                return errorMsg;
            }
        } catch (error) {
            console.error('接続テストエラー:', error);
            return `❌ 接続テスト失敗\nエラー: ${error.message}\n\nネットワークまたはCORS設定を確認してください。`;
        }
    }
    
    updateLastBotMessage(newText) {
        const botMessages = this.chatMessages.querySelectorAll('.bot-message');
        const lastBotMessage = botMessages[botMessages.length - 1];
        
        if (lastBotMessage) {
            const bubble = lastBotMessage.querySelector('.message-bubble');
            if (bubble) {
                bubble.textContent = newText;
                console.log('メッセージ更新完了:', newText);
            } else {
                console.error('メッセージバブルが見つかりません');
            }
        } else {
            console.error('最後のボットメッセージが見つかりません');
        }
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    formatDate(date) {
        return date.toLocaleDateString('ja-JP', { 
            month: 'long', 
            day: 'numeric',
            weekday: 'short'
        });
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// チャットボットを初期化
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});