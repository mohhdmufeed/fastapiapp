import pathlib
import sqlite3
import urllib.request
import urllib.error
import json

print('cwd', pathlib.Path('.').resolve())
path = pathlib.Path('test.db')
print('db exists', path.exists())
if path.exists():
    con = sqlite3.connect(path)
    cur = con.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    print('tables', cur.fetchall())
    try:
        cur.execute('PRAGMA table_info(users)')
        print('users cols', cur.fetchall())
    except Exception as e:
        print('users table error', e)
    con.close()

url = 'http://127.0.0.1:8011/auth/register'
payload = {
    'name': 'Test User',
    'email': 'testuser@example.com',
    'password': 'password123',
    'role': 'Candidate'
}
body = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print('STATUS', resp.getcode())
        print(resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTPERR', e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print('ERR', e)
