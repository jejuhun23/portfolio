export async function onRequestPost(context) {
    try {
        // CORS 헤더 설정
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };

        // 요청 본문 파싱
        const request = await context.request.json();
        const { name, email, message } = request;

        // 입력 데이터 유효성 검사
        if (!name || !email || !message) {
            return new Response(JSON.stringify({
                success: false,
                error: '모든 필드를 입력해주세요.'
            }), {
                status: 400,
                headers: corsHeaders
            });
        }

        // D1 데이터베이스에 데이터 저장
        const stmt = context.env.DB.prepare(
            'INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, ?)'
        );

        await stmt.bind(name, email, message, new Date().toISOString())
            .run();

        return new Response(JSON.stringify({
            success: true,
            message: '메시지가 성공적으로 저장되었습니다.'
        }), {
            status: 200,
            headers: corsHeaders
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: '서버 오류가 발생했습니다.'
        }), {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });
    }
}