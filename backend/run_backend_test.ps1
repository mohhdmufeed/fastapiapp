try {
    $root = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/' -UseBasicParsing -TimeoutSec 10
    Write-Host 'ROOT:'
    Write-Host $root.Content
} catch {
    Write-Host 'ROOT ERROR:'
    Write-Host $_.Exception.Message
}
Write-Host '---'
$body = '{"name":"Test User","email":"testuser@example.com","password":"password123","role":"Candidate"}'
try {
    $register = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/auth/register' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 10
    Write-Host 'REGISTER:'
    Write-Host $register.Content
} catch {
    Write-Host 'REGISTER ERROR:'
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd()
    } else {
        Write-Host $_.Exception.Message
    }
}
