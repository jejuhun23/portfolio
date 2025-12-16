-- 연락처 정보를 저장하기 위한 테이블 생성
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL
);

-- 이메일 검색을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- 생성일자 기준 정렬을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);