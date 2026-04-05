
-- Tabela de capítulos do ebook
CREATE TABLE ebook_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  chapter_number INTEGER NOT NULL UNIQUE,
  icon TEXT,
  subtitle TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de seções do ebook
CREATE TABLE ebook_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES ebook_chapters(id),
  chapter_number INTEGER NOT NULL,
  section_title TEXT NOT NULL,
  subsection_title TEXT,
  content TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('text','table','checklist','tool','protocol')),
  tags TEXT[],
  situation TEXT[],
  keywords TEXT[],
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de protocolos SOS
CREATE TABLE sos_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  situation TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  exercise_sequence JSONB NOT NULL DEFAULT '[]',
  total_time_minutes INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para busca
CREATE INDEX idx_ebook_sections_chapter ON ebook_sections(chapter_number);
CREATE INDEX idx_ebook_sections_active ON ebook_sections(is_active);
CREATE INDEX idx_sos_protocols_situation ON sos_protocols(situation);

-- RLS
ALTER TABLE ebook_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_protocols ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública
CREATE POLICY "Public read ebook_chapters" ON ebook_chapters FOR SELECT USING (true);
CREATE POLICY "Public read ebook_sections" ON ebook_sections FOR SELECT USING (true);
CREATE POLICY "Public read sos_protocols" ON sos_protocols FOR SELECT USING (true);

-- Políticas temporárias de INSERT para importação
CREATE POLICY "Temp public insert ebook_sections" ON ebook_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Temp public insert sos_protocols" ON sos_protocols FOR INSERT WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admins can manage ebook_chapters" ON ebook_chapters FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage ebook_sections" ON ebook_sections FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage sos_protocols" ON sos_protocols FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Inserir os 13 capítulos
INSERT INTO ebook_chapters (chapter_number, title, icon, sort_order, is_active) VALUES
(0, 'Introdução e Prefácio', '📖', 0, true),
(1, 'O Que É o Lipedema?', '🔍', 1, true),
(2, 'As Origens, Estágios e o Caminho para o Diagnóstico', '🧬', 2, true),
(3, 'Os Pilares do Cuidado Conservador', '🏛️', 3, true),
(4, 'Nutrição Estratégica e Consciente', '🥗', 4, true),
(5, 'Movimento como Medicina', '🏃‍♀️', 5, true),
(6, 'A Intervenção Cirúrgica', '🏥', 6, true),
(7, 'A Paisagem Interior', '🧠', 7, true),
(8, 'A Arquitetura do Autocuidado', '🏗️', 8, true),
(9, 'A Oficina de Autogestão', '🔧', 9, true),
(10, 'O Investimento em Si Mesma', '💰', 10, true),
(11, 'A Sinfonia do Autocuidado', '🎵', 11, true),
(12, 'O Seu Bem-Estar É a Sua Prioridade', '⭐', 12, true);
