-- Execute with: npx wrangler d1 execute kathana-metrics --remote --file=counter-backend/schema.sql
-- Do not attempt to derive unique persons from these opaque per-browser tokens.
CREATE TABLE IF NOT EXISTS page_totals(
  page TEXT PRIMARY KEY,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO page_totals(page) VALUES('home'),('event-mini');
CREATE TABLE IF NOT EXISTS daily_visits(
  page TEXT NOT NULL,
  visitor_key TEXT NOT NULL,
  day TEXT NOT NULL,
  PRIMARY KEY(page,visitor_key,day)
);
CREATE TABLE IF NOT EXISTS likes(
  page TEXT NOT NULL,
  visitor_key TEXT NOT NULL,
  PRIMARY KEY(page,visitor_key)
);
CREATE TABLE IF NOT EXISTS download_clicks(
  page TEXT NOT NULL,
  visitor_key TEXT NOT NULL,
  day TEXT NOT NULL,
  PRIMARY KEY(page,visitor_key,day)
);
CREATE TABLE IF NOT EXISTS abuse(
  day TEXT NOT NULL,
  action TEXT NOT NULL,
  hash TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(day,action,hash)
);
CREATE INDEX IF NOT EXISTS ix_daily_visits_page_day ON daily_visits(page,day);
CREATE INDEX IF NOT EXISTS ix_download_page_day ON download_clicks(page,day);
-- Schedule deletion of abuse keys >30 days; retain aggregate totals indefinitely
-- while campaign/community metrics are offered, subject to published privacy notice.
