import json
import urllib.request
import urllib.error
import time

url = 'http://127.0.0.1:8000/auth/register'
body = {
    'name': 'Exact Output User',
    'email': f'exactoutput_{int(time.time())}@example.com',
    'password': 'ShortPass123',
    'role': 'Candidate'
}
req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    resp = urllib.request.urlopen(req, timeout=10)
    print('STATUS', resp.getcode())
    print(resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTPERR', e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print('ERR', str(e))
