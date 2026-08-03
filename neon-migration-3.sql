-- oSa Hub — Ürün montaj/inceleme videosu alanı
-- Neon konsolunda "SQL Editor" sekmesine yapıştırıp "Run" deyin.

ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;
