import os
import django
import sqlite3

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ncpor_portal.settings')
django.setup()

# Connect to SQLite database
db_path = 'db.sqlite3'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get existing columns
cursor.execute("PRAGMA table_info(events_event)")
columns = [row[1] for row in cursor.fetchall()]
print("Existing columns:", columns)

# Add missing columns if they don't exist
columns_to_add = [
    ("time", "ALTER TABLE events_event ADD COLUMN time TIME NULL"),
    ("event_type", "ALTER TABLE events_event ADD COLUMN event_type VARCHAR(20) DEFAULT 'workshop'"),
    ("max_participants", "ALTER TABLE events_event ADD COLUMN max_participants INTEGER DEFAULT 100"),
    ("created_at", "ALTER TABLE events_event ADD COLUMN created_at DATETIME NULL"),
    ("updated_at", "ALTER TABLE events_event ADD COLUMN updated_at DATETIME NULL"),
]

for col_name, sql in columns_to_add:
    if col_name not in columns:
        try:
            cursor.execute(sql)
            print(f"✅ Added column: {col_name}")
        except sqlite3.OperationalError as e:
            print(f"❌ Error adding {col_name}: {e}")
    else:
        print(f"⏭️  Column {col_name} already exists")

# Commit changes
conn.commit()

# Verify
cursor.execute("PRAGMA table_info(events_event)")
final_columns = [row[1] for row in cursor.fetchall()]
print("\nFinal columns:", final_columns)

conn.close()
print("\n✅ Database schema updated successfully!")
