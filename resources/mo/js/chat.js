// chat.js
window.initChat = function() {
    const btnBack = document.getElementById('btnBack');
    const flow01 = document.getElementById('flow01');
    const flow02 = document.getElementById('flow02');
    const flow03 = document.getElementById('flow03');
    const flow04 = document.getElementById('flow04');
    const flow05 = document.getElementById('flow05');
    const flowBoxes = document.getElementsByClassName('flow-box');

    // 필수 요소가 없으면 중단
    if (!flow01 || !flow02) return;

    const searchInput = flow02.querySelector('.ipt.search');
    const searchBtn = flow02.querySelector('.icoBtn_appSrch');
    const delBtn = flow02.querySelector('.icoBtn_del');
    const listBtnArea = flow02.querySelector('.list-btn');

    const chatLive = document.getElementById('chatLive');
    const btnToggleFlow = document.getElementById('btnToggleFlow');

    // 토글 이벤트
    if (btnToggleFlow && chatLive) {
        btnToggleFlow.onclick = function() {
            const isCollapsed = chatLive.classList.toggle('collapsed');
            btnToggleFlow.classList.toggle('active', !isCollapsed);
            btnToggleFlow.setAttribute('aria-expanded', !isCollapsed);
            btnToggleFlow.setAttribute('aria-label', isCollapsed ? 'ai 챗봇 대화 열기' : 'ai 챗봇 대화 닫기');
            btnToggleFlow.textContent = isCollapsed ? 'ai 챗봇 열기 ▼' : 'ai 챗봇 닫기 ▲';
        };
    }
    
    for (let i = 0; i < flowBoxes.length; i++) {
        flowBoxes[i].setAttribute('tabindex', '-1');
    }

    function switchFlow(targetFlow) {
        if (!targetFlow) return;
        [flow01, flow02, flow03, flow04, flow05].forEach(f => {
            if (f) f.style.display = 'none';
        });
        
        targetFlow.style.display = 'block';
        if (typeof targetFlow.focus === 'function') targetFlow.focus();
    }

    function initFlow(isUserAction = false) {
        switchFlow(flow01);
        if (btnBack) btnBack.style.display = 'none';

        if (searchInput) searchInput.value = '';
        if (listBtnArea) listBtnArea.style.display = 'none';

        if (isUserAction && flow01 && typeof flow01.focus === 'function') {
            flow01.focus();
        }
    }

    // 초기 화면 진입
    initFlow();

    if (btnBack) {
        btnBack.onclick = function() {
            initFlow(true);
        };
    }

    // 1. flow01 이벤트
    if (flow01) {
        flow01.onclick = function(e) {
            const btn = e.target.closest('button');
            if (!btn) return;

            switchFlow(flow02);
            if (btnBack) btnBack.style.display = 'block';
            
            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 50);
        };
    }

    // 2. flow02 검색
    function executeSearch() {
        if (listBtnArea) {
            listBtnArea.style.display = 'flex';
            const firstItem = listBtnArea.querySelector('button');
            if (firstItem) firstItem.focus();
        }
    }

    if (searchBtn) searchBtn.onclick = executeSearch;

    if (searchInput) {
        searchInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch();
            }
        };
    }

    if (delBtn) {
        delBtn.onclick = function() {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            if (listBtnArea) listBtnArea.style.display = 'none';
        };
    }

    // 3. flow02 -> flow03
    if (listBtnArea) {
        listBtnArea.onclick = function(e) {
            const labelBtn = e.target.closest('.btn-label');
            if (!labelBtn) return;

            switchFlow(flow03);
        };
    }

    // 4. flow03
    if (flow03) {
        flow03.onclick = function(e) {
            const btn = e.target.closest('button');
            if (!btn || btn.classList.contains('btnBack')) return;
            switchFlow(flow04);
        };
    }

    // 5. flow04
    if (flow04) {
        flow04.onclick = function(e) {
            const btn = e.target.closest('button');
            if (!btn || btn.classList.contains('btnBack')) return;
            switchFlow(flow05);
        };
    }
};

// 최초 자동 실행 (윈도우 팝업 및 최초 로드용)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initChat);
} else {
    window.initChat();
}

// 메시지 관련 전역 함수
window.handleKeyPress = function(event) {
    if (event.key === 'Enter') sendMessage();
};

window.sendMessage = function() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;

    const text = messageInput.value.trim();
    if (!text) return;

    appendMessage(text, 'sent');
    messageInput.value = '';

    setTimeout(() => {
        receiveMessage('전송하신 "' + text + '"에 대한 서버 응답입니다.');
    }, 1000);
};

window.receiveMessage = function(text) {
    appendMessage(text, 'received');
};

window.appendMessage = function(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = text;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};