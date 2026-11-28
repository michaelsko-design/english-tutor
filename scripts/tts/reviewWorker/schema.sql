-- Marks made on the phone that the PC has not taken yet; a null entry is a mark taken back.
CREATE TABLE IF NOT EXISTS inbox (
  key TEXT PRIMARY KEY,
  entry TEXT,
  fp TEXT NOT NULL,
  marked_at TEXT NOT NULL
);
