-- oSa Hub — Stok kontrolü ve araç uyum verisi migration'ı
-- Neon konsolunda "SQL Editor" sekmesine yapıştırıp "Run" deyin.

ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS compatibility JSONB NOT NULL DEFAULT '[]';

-- Mevcut Carbon Direksiyon ürününe gerçek uyumluluk bilgisini ve varsayılan stok adedini işle
-- (stok adedi gerçek değilse admin panelinden düzeltin)
UPDATE products
SET compatibility = '[
  {"brand":"Audi","model":"A4","years":"2007–2016 (B8 / B8.5)"},
  {"brand":"Audi","model":"S4","years":"2007–2016 (B8 / B8.5)"},
  {"brand":"Audi","model":"RS4","years":"2007–2016 (B8 / B8.5)"},
  {"brand":"Audi","model":"A5","years":"2007–2016 (B8 / B8.5)"},
  {"brand":"Audi","model":"S5","years":"2007–2016 (B8 / B8.5)"},
  {"brand":"Audi","model":"RS5","years":"2007–2016 (B8 / B8.5)"},
  {"brand":"Audi","model":"Q5","years":"2007–2016"}
]'::jsonb,
stock = 1
WHERE name = 'High-End Carbon Custom';
