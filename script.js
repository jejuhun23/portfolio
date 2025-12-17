document.addEventListener('DOMContentLoaded', () => {
    // 검색 기능
    const searchInput = document.getElementById('search-input');
    const searchButton = searchInput?.nextElementSibling;

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // 검색 로직 구현
                alert(`'${searchTerm}' 검색 결과를 표시합니다.`);
            }
        });
    }

    // 스크롤 애니메이션
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in');
        sectionObserver.observe(section);
    });

    // 문의하기 폼 처리
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('.submit-btn');
            const statusMessage = contactForm.querySelector('.status-message');
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Discord Webhook URL (원본)
            const WEBHOOK_URL = 'https://discord.com/api/webhooks/1450491698894602361/VIRASZfutARB70CLkRVRyfgRTGIDq6jqiGbbNykRRJSUH8kpr5vZbT03edbAVYK7lrxE';
            
            // CORS 우회 프록시 사용 (더 안정적)
            const DISCORD_WEBHOOK_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(WEBHOOK_URL)}`;

            // Discord Webhook 형식 - 간단한 content 형식 사용
            const discordPayload = {
                content: `📧 **새로운 문의가 도착했습니다!**\n\n` +
                         `👤 **이름:** ${name}\n` +
                         `📧 **이메일:** ${email}\n` +
                         `💬 **메시지:**\n${message}\n\n` +
                         `⏰ ${new Date().toLocaleString('ko-KR')}`
            };

            console.log('🚀 Discord Webhook으로 전송 시도...');
            console.log('📦 Payload:', JSON.stringify(discordPayload, null, 2));

            try {
                submitButton.disabled = true;
                submitButton.textContent = '전송 중...';
                
                // Discord Webhook으로 데이터 전송
                const response = await fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(discordPayload)
                });

                console.log('📡 Response Status:', response.status);
                console.log('📡 Response Status Text:', response.statusText);

                // 응답 본문 읽기
                const responseText = await response.text();
                console.log('📄 Response Body:', responseText);

                if (!response.ok) {
                    console.error('❌ 전송 실패 상세 정보:');
                    console.error('- Status Code:', response.status);
                    console.error('- Status Text:', response.statusText);
                    console.error('- Response:', responseText);
                    throw new Error(`전송 실패 (${response.status})`);
                }

                console.log('✅ 메시지 전송 성공!');
                statusMessage.textContent = '메시지가 성공적으로 전송되었습니다!';
                statusMessage.style.display = 'block';
                statusMessage.className = 'status-message success';
                contactForm.reset();

            } catch (error) {
                console.error('❌ 오류 발생:', error);
                console.error('오류 상세:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                
                statusMessage.textContent = `메시지 전송에 실패했습니다. 콘솔을 확인해주세요. (${error.message})`;
                statusMessage.style.display = 'block';
                statusMessage.className = 'status-message error';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = '메시지 보내기';
            }
        });
    }

    // ==========================================
    // 프로젝트 정보 탭 네비게이션 기능
    // - 카테고리 클릭 시 해당 콘텐츠만 표시
    // - 페이지 새로고침 없이 콘텐츠 전환 (SPA 방식)
    // ==========================================
    
    function initProjectTabs() {
        // 모든 탭 버튼 선택
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 클릭된 버튼의 데이터 속성 가져오기
                const targetTab = this.getAttribute('data-tab');
                const projectId = this.getAttribute('data-project');
                
                // 같은 프로젝트 내의 모든 탭 버튼에서 active 클래스 제거
                const projectButtons = document.querySelectorAll(`.tab-button[data-project="${projectId}"]`);
                projectButtons.forEach(btn => btn.classList.remove('active'));
                
                // 클릭된 버튼에 active 클래스 추가
                this.classList.add('active');
                
                // 같은 프로젝트 내의 모든 탭 콘텐츠 숨기기
                const projectContents = document.querySelectorAll(`[id^="${projectId}-tab-"]`);
                projectContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // 선택된 탭 콘텐츠만 표시
                const targetContent = document.getElementById(`${projectId}-tab-${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // 디버깅용 로그 (개발 완료 후 제거 가능)
                console.log(`📂 탭 전환: ${projectId} > ${targetTab}`);
            });
        });
        
        console.log('✅ 프로젝트 탭 네비게이션 초기화 완료');
        console.log(`   - 탭 버튼 수: ${tabButtons.length}`);
    }
    
    // 탭 네비게이션 초기화 실행
    initProjectTabs();
});