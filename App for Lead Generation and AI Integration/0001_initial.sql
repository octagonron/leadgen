-- Migration number: 0001 	 2025-04-26
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS keywords;
DROP TABLE IF EXISTS lead_interests;
DROP TABLE IF EXISTS lead_scores;
DROP TABLE IF EXISTS counters;
DROP TABLE IF EXISTS access_logs;

-- Lead information table
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  location TEXT,
  source TEXT,
  current_occupation TEXT,
  experience_level TEXT,
  motivation_level INTEGER DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Keywords for targeting
CREATE TABLE IF NOT EXISTS keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Lead interests based on keywords
CREATE TABLE IF NOT EXISTS lead_interests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  keyword_id INTEGER NOT NULL,
  interest_level INTEGER DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (keyword_id) REFERENCES keywords(id)
);

-- Lead scoring table
CREATE TABLE IF NOT EXISTS lead_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  total_score INTEGER DEFAULT 0,
  go_getter_score INTEGER DEFAULT 0,
  travel_interest_score INTEGER DEFAULT 0,
  sales_aptitude_score INTEGER DEFAULT 0,
  ai_qualification_notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

-- Counters for analytics
CREATE TABLE IF NOT EXISTS counters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Access logs for tracking
CREATE TABLE IF NOT EXISTS access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  path TEXT,
  accessed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Initial data
INSERT INTO counters (name, value) VALUES 
  ('page_views', 0),
  ('form_submissions', 0),
  ('qualified_leads', 0);

-- Initial keywords based on user requirements
INSERT INTO keywords (keyword, category, priority) VALUES
  ('make money online', 'income', 3),
  ('side hustle', 'income', 3),
  ('remote work', 'work_style', 2),
  ('freelance writer', 'occupation', 1),
  ('Uber driver', 'occupation', 1),
  ('gig worker', 'work_style', 2),
  ('taskrabbit', 'platform', 1),
  ('virtual assistant', 'occupation', 2),
  ('MLM survivor', 'experience', 2),
  ('work from home', 'work_style', 3),
  ('cash flow ideas', 'income', 2),
  ('single mom income', 'demographic', 2),
  ('no degree jobs', 'qualification', 2),
  ('digital nomad', 'lifestyle', 3),
  ('travel affiliate', 'travel', 4),
  ('how to sell travel', 'travel', 5),
  ('work from laptop', 'work_style', 2),
  ('zoom business', 'tool', 1),
  ('fire your boss', 'motivation', 3),
  ('financial freedom', 'goal', 3),
  ('affiliate marketing', 'marketing', 3),
  ('social media income', 'income', 2),
  ('business from phone', 'tool', 2),
  ('side income 2025', 'income', 3),
  ('bold over 30', 'demographic', 2),
  ('work from phone', 'work_style', 2),
  ('online entrepreneur', 'identity', 3),
  ('black woman in tech', 'demographic', 2),
  ('introvert business ideas', 'personality', 2),
  ('residual income', 'income', 3),
  ('build your team', 'team_building', 4),
  ('mompreneurs', 'demographic', 2),
  ('women over 40 income', 'demographic', 2),
  ('$500 a week online', 'income', 3),
  ('lead generator', 'marketing', 2),
  ('booking clients fast', 'sales', 3),
  ('simple sales funnel', 'marketing', 2),
  ('credit repair leads', 'niche', 1),
  ('dropshipping 2025', 'business_model', 1),
  ('AI virtual assistant', 'tool', 2),
  ('mobile business tools', 'tool', 2),
  ('$79 business startup', 'startup', 2),
  ('facebook automation leads', 'marketing', 2),
  ('tiktok business coaching', 'marketing', 2),
  ('travelpreneur', 'travel', 5),
  ('sell travel online', 'travel', 5),
  ('team building funnel', 'team_building', 4),
  ('go getters', 'personality', 5);

-- Create indexes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_keywords_keyword ON keywords(keyword);
CREATE INDEX idx_keywords_category ON keywords(category);
CREATE INDEX idx_lead_interests_lead_id ON lead_interests(lead_id);
CREATE INDEX idx_lead_scores_lead_id ON lead_scores(lead_id);
CREATE INDEX idx_lead_scores_total_score ON lead_scores(total_score);
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at);
CREATE INDEX idx_counters_name ON counters(name);
