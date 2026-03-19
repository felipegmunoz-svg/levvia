ALTER TABLE profiles ALTER COLUMN objective DROP DEFAULT;
ALTER TABLE profiles RENAME COLUMN objective TO objectives;
ALTER TABLE profiles ALTER COLUMN objectives TYPE text[] USING CASE WHEN objectives IS NOT NULL AND objectives != '' THEN ARRAY[objectives] ELSE '{}'::text[] END;
ALTER TABLE profiles ALTER COLUMN objectives SET DEFAULT '{}'::text[];