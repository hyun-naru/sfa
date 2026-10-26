function showFlowLoading(callback, delay = 400) {
    const chatFlow = document.getElementById('chatFlow');
    if (!chatFlow) {
        if (callback) callback();
        return;
    }

    // 기존 로딩 오버레이 제거
    const existing = chatFlow.querySelector('.flow-loading-overlay');
    if (existing) existing.remove();

    // 로딩 생성
    const overlay = document.createElement('div');
    overlay.className = 'flow-loading-overlay';
    overlay.innerHTML = '<div class="flow-spinner"></div>';
    chatFlow.appendChild(overlay);

    setTimeout(() => {
        if (overlay) overlay.remove();
        if (typeof callback === 'function') callback();
    }, delay);
}

function showChatLoading() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    window.hideChatLoading();

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message received loading-dots';
    loadingDiv.id = 'chatTypingLoading';
    loadingDiv.innerHTML = '<span></span><span></span><span></span>';

    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideChatLoading() {
    const loadingDiv = document.getElementById('chatTypingLoading');
    if (loadingDiv) loadingDiv.remove();
}

// 메인 초기화 함수
window.initChat = function() {
    let currentMenuId = null;
    let currentStep = 1;

    const btnBack = document.getElementById('btnBack');
    const flow01 = document.getElementById('flow01');
    const chatFlow = document.getElementById('chatFlow');
    const chatLive = document.getElementById('chatLive');
    const btnToggleFlow = document.getElementById('btnToggleFlow');

    if (!flow01) return;

    // 접기/펼치기 토글
    // if (btnToggleFlow && chatLive) {
    //     btnToggleFlow.onclick = function() {
    //         const isCollapsed = chatLive.classList.toggle('collapsed');
    //         if (chatFlow) {
    //             chatFlow.classList.toggle('fix-no', !isCollapsed);
    //         }
    //         btnToggleFlow.classList.toggle('active', !isCollapsed);
    //         btnToggleFlow.setAttribute('aria-expanded', !isCollapsed);
    //         btnToggleFlow.setAttribute('aria-label', isCollapsed ? 'ai 챗봇 대화 열기' : 'ai 챗봇 대화 닫기');
    //         btnToggleFlow.textContent = isCollapsed ? 'ai 챗봇 열기 ▼' : 'ai 챗봇 닫기 ▲';
    //     };
    // }
    if (btnToggleFlow && chatLive) {
        // 초기 상태: 펼쳐짐
        chatLive.classList.remove('collapsed');

        if (chatFlow) {
            chatFlow.classList.add('fix-no');
        }

        btnToggleFlow.classList.add('active');
        btnToggleFlow.setAttribute('aria-expanded', 'true');
        btnToggleFlow.setAttribute('aria-label', 'ai 챗봇 대화 닫기');
        btnToggleFlow.textContent = 'ai 챗봇 닫기 ▲';

        // 접기/펼치기 토글
        btnToggleFlow.onclick = function() {
            const isCollapsed = chatLive.classList.toggle('collapsed');

            if (chatFlow) {
                chatFlow.classList.toggle('fix-no', !isCollapsed);
            }

            btnToggleFlow.classList.toggle('active', !isCollapsed);
            btnToggleFlow.setAttribute('aria-expanded', !isCollapsed);
            btnToggleFlow.setAttribute(
                'aria-label',
                isCollapsed ? 'ai 챗봇 대화 열기' : 'ai 챗봇 대화 닫기'
            );
            btnToggleFlow.textContent = isCollapsed
                ? 'ai 챗봇 열기 ▼'
                : 'ai 챗봇 닫기 ▲';
        };
    }
    
    // Step 제어 함수
    function renderStep(menuId, step) {
        // 모든 flow-box 숨김
        const allBoxes = document.querySelectorAll('.flow-box');
        allBoxes.forEach(box => box.style.display = 'none');

        if (step === 1 || !menuId) {
            if (flow01) flow01.style.display = 'block'; // 메인 화면 확실하게 display: block 처리
            if (btnBack) btnBack.style.display = 'none';
            currentMenuId = null;
            currentStep = 1;
        } else {
            const target = document.querySelector(`.menu-box[data-menu="${menuId}"][data-step="${step}"]`);
            if (target) {
                target.style.display = 'block';
                if (btnBack) btnBack.style.display = 'block';
                currentMenuId = menuId;
                currentStep = step;

                // [REQ-CH-012] 사용인 확인 라디오 토글 초기화
                if (menuId === 'REQ-CH-012' && step === 3) {
                    toggleSearchArea();
    }
            } else {
                // 매칭되는 step이 없으면 안전하게 메인 화면으로 복귀
                if (flow01) flow01.style.display = 'block';
        if (btnBack) btnBack.style.display = 'none';
            }
        }
    }

    // 초기 화면 실행
    renderStep(null, 1);

    if (btnBack) {
        btnBack.onclick = function() {
            showFlowLoading(() => {
                renderStep(null, 1);
            }, 300);
        };
    }

    // 메뉴 버튼 및 서브 메뉴 버튼 통합 클릭 처리
    if (chatFlow) {
        chatFlow.onclick = function(e) {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            // 이전 버튼 클릭
            if (btn.classList.contains('btn-prev')) {
                showFlowLoading(() => {
                    const menuId = currentMenuId;

                    // 마지막 Depth를 제외한 부모 메뉴 ID
                    const parentMenuId = menuId
                        .split('-')
                        .slice(0, -1)
                        .join('-');

                    if (currentStep === 4) {
                        renderStep(parentMenuId, 3);
                    } else if (currentStep === 3) {
                        renderStep(parentMenuId, 2);
                    } else {
                        renderStep(menuId, currentStep - 1);
                    }
                }, 300);

                return;
            }
            // 2. 다음/확인 버튼 클릭 처리
            if (btn.classList.contains('btn-next')) {
                    showFlowLoading(() => {
                    renderStep(currentMenuId, currentStep + 1);
                    }, 400);
                return;
    }

            // 3. Flow 메인 및 메뉴 depth 버튼 클릭 처리
            if (btn.id) {
                const menuId = btn.id;

                // 클릭된 ID에 대응되는 Step 2 또는 Step 3 박스 검색
                const targetStep2 = document.querySelector(`.menu-box[data-menu="${menuId}"][data-step="2"]`);
                const targetStep3 = document.querySelector(`.menu-box[data-menu="${menuId}"][data-step="3"]`);
                const targetStep4 = document.querySelector(`.menu-box[data-menu="${menuId}"][data-step="4"]`);

                if (targetStep2) {
                    showFlowLoading(() => {
                        renderStep(menuId, 2);
                    }, 400);
                } else if (targetStep3) {
                    showFlowLoading(() => {
                        renderStep(menuId, 3);
                    }, 400);
                } else if (targetStep4) {
                    showFlowLoading(() => {
                        renderStep(menuId, 4);
                    }, 400);
                }
            }
        };
    }

    // [REQ-CH-012] 라디오 전환 전용 함수
    function toggleSearchArea() {
        const iptFilt3_1 = document.getElementById('iptFilt3_1');
        const search1 = document.getElementById('search1');
        const search2 = document.getElementById('search2');

        if (!search1 || !search2) return;

        if (iptFilt3_1 && iptFilt3_1.checked) {
            search1.style.display = 'block';
            search2.style.display = 'none';
        } else {
            search1.style.display = 'none';
            search2.style.display = 'flex';
        }
    }

    const iptFilt3_1 = document.getElementById('iptFilt3_1');
    const iptFilt3_2 = document.getElementById('iptFilt3_2');
    if (iptFilt3_1) iptFilt3_1.addEventListener('change', toggleSearchArea);
    if (iptFilt3_2) iptFilt3_2.addEventListener('change', toggleSearchArea);
};

// 최초 자동 실행 (윈도우 팝업 및 최초 로드용)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initChat);
} else {
    window.initChat();
}

// =========================================================
// 라이브 대화 메세지 전역 함수 및 채팅 로딩 처리
// =========================================================
window.handleKeyPress = function(event) {
    if (event.key === 'Enter') sendMessage();
};

window.sendMessage = function() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;

    const text = messageInput.value.trim();
    if (!text) return;

    // 1. 사용자 보낸 메시지 출력
    appendMessage(text, 'sent');
    messageInput.value = '';

    // 2. 채팅 로딩(점 3개 애니메이션) 표시
    showChatLoading();

    // 3. 서버 응답 모의 처리 (1초 후 로딩 지우고 응답 메시지 출력)
    setTimeout(() => {
        hideChatLoading();
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