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
});