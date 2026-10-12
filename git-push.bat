@echo off
chcp 65001 > nul
title Git Push Helper — Am Premium by KaaOffc

echo.
echo ╔══════════════════════════════════════╗
echo ║   Git Push Helper — by KaaOffc       ║
echo ╚══════════════════════════════════════╝
echo.

:: Cek apakah git sudah di-init
if not exist ".git" (
    echo [!] Git belum diinisialisasi. Setup sekarang...
    echo.

    set /p GH_USER="  GitHub username kamu: "
    set /p GH_REPO="  Nama repository    : "

    git init
    git branch -M main
    git remote add origin "https://github.com/%GH_USER%/%GH_REPO%.git"

    echo.
    echo [OK] Git initialized!
    echo      Remote: https://github.com/%GH_USER%/%GH_REPO%.git
    echo.
)

:: Commit message
set /p MSG="  Pesan commit (Enter = update): "
if "%MSG%"=="" set MSG=update

echo.
echo [..] Staging semua file...
git add .

echo [..] Commit: "%MSG%"
git commit -m "%MSG%"

echo [..] Pushing ke GitHub...
git push -u origin main

echo.
if %ERRORLEVEL%==0 (
    echo [OK] Berhasil push ke GitHub!
) else (
    echo [!!] Push gagal. Cek koneksi atau token GitHub kamu.
    echo.
    echo  Tips: Pastikan sudah login git:
    echo  git config --global user.name "NamaKamu"
    echo  git config --global user.email "email@kamu.com"
)
echo.
pause
