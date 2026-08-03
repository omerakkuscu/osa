-- oSa Command Center — CMS, ayarlar, galeri ve genişletilmiş ürün alanları
-- Neon konsolunda "SQL Editor" sekmesine yapıştırıp "Run" deyin.

-- Site geneli düzenlenebilir metinler (duyuru çubuğu, hero alt başlığı, yasal sayfa gövdeleri vb.)
CREATE TABLE IF NOT EXISTS site_content (
  key         TEXT NOT NULL,
  lang        TEXT NOT NULL,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (key, lang)
);

-- Tekil ayar satırı (admin şifre hash'i burada saklanır — env var değişmez, bu üzerine yazar)
CREATE TABLE IF NOT EXISTS site_settings (
  id                   INTEGER PRIMARY KEY DEFAULT 1,
  admin_password_hash  TEXT,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- oSa Productions "Yollarda oSa" galerisi (ürüne bağlı olmayan genel medya)
CREATE TABLE IF NOT EXISTS gallery_images (
  id          SERIAL PRIMARY KEY,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ürünlere ek teknik alanlar + Vanguard vitrin rozeti
ALTER TABLE products ADD COLUMN IF NOT EXISTS airbag_included BOOLEAN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stitching TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS vanguard_edition BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS vanguard_edition_limit INTEGER;
