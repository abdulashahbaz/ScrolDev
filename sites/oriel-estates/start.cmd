@echo off
rem Opens the Oriel site. Uses the local server when Node.js is installed,
rem otherwise opens index.html directly in your default browser.
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  node serve.mjs
) else (
  start "" "%~dp0index.html"
)
