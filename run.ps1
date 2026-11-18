Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Starting Iris Classifier Full-Stack App " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check Python and Node
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js/npm is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

$backendPort = 8000
$frontendPort = 5173

Write-Host "Starting Backend FastAPI on http://localhost:$backendPort ..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "app.main:app", "--app-dir", "backend", "--port", "$backendPort", "--reload" -PassThru

Write-Host "Starting Frontend Vite on http://localhost:$frontendPort ..." -ForegroundColor Green
Set-Location frontend
$frontendProcess = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev", "--", "--port", "$frontendPort" -PassThru
Set-Location ..

Write-Host ""
Write-Host "Backend API docs: http://localhost:$backendPort/docs" -ForegroundColor Yellow
Write-Host "Frontend web app: http://localhost:$frontendPort" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to exit and stop both servers." -ForegroundColor Gray

try {
    while ($true) {
        Start-Sleep -Seconds 2
    }
}
finally {
    Write-Host "Stopping servers..." -ForegroundColor Magenta
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
}
