-- S24 ampliación sintética: categorías operativas cerradas y comentario opcional minimizado.
ALTER TABLE leave_requests DROP CONSTRAINT leave_requests_category_check;
ALTER TABLE leave_requests ADD CONSTRAINT leave_requests_category_check CHECK (category IN ('general_request','personal_management','availability_adjustment'));
ALTER TABLE leave_requests ADD COLUMN request_comment text;
ALTER TABLE leave_requests ADD CONSTRAINT leave_requests_comment_length_check CHECK (request_comment IS NULL OR char_length(request_comment) BETWEEN 1 AND 500);
