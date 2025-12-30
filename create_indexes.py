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

# Create indexes
indexes = [
    ("events_even_date_5a7630_idx", "CREATE INDEX IF NOT EXISTS events_even_date_5a7630_idx ON events_event (date, event_type)"),
    ("events_even_locatio_0ae1f4_idx", "CREATE INDEX IF NOT EXISTS events_even_locatio_0ae1f4_idx ON events_event (location)"),
]

for idx_name, sql in indexes:
    try:
        cursor.execute(sql)
        print(f"✅ Created index: {idx_name}")
    except sqlite3.OperationalError as e:
        print(f"❌ Error creating {idx_name}: {e}")

# Commit changes
conn.commit()
conn.close()
print("\n✅ Database indexes created successfully!")
