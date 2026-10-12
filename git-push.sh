#!/bin/bash
# ============================================
# Git Push Helper — Am Premium by KaaOffc
# Cara pakai: bash git-push.sh
# ============================================

GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║   Git Push Helper — by KaaOffc       ║${RESET}"
echo -e "${CYAN}╚══════════════════════════════════════╝${RESET}"
echo ""

# Cek apakah git sudah di-init
if [ ! -d ".git" ]; then
  echo -e "${YELLOW}⚙  Git belum diinisialisasi. Setup sekarang...${RESET}"
  echo ""

  read -p "  GitHub username kamu: " GH_USER
  read -p "  Nama repository    : " GH_REPO

  git init
  git branch -M main
  git remote add origin "https://github.com/$GH_USER/$GH_REPO.git"

  echo ""
  echo -e "${GREEN}✅ Git initialized!${RESET}"
  echo -e "   Remote: ${CYAN}https://github.com/$GH_USER/$GH_REPO.git${RESET}"
  echo ""
fi

# Commit message
read -p "  Pesan commit (Enter = 'update'): " MSG
MSG=${MSG:-update}

echo ""
echo -e "${YELLOW}📦 Staging semua file...${RESET}"
git add .

echo -e "${YELLOW}💾 Commit: \"$MSG\"${RESET}"
git commit -m "$MSG"

echo -e "${YELLOW}🚀 Pushing ke GitHub...${RESET}"
git push -u origin main

echo ""
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Berhasil push ke GitHub!${RESET}"
else
  echo -e "${RED}❌ Push gagal. Cek koneksi atau token GitHub kamu.${RESET}"
  echo ""
  echo -e "  Tips: Pastikan kamu sudah login git dengan:"
  echo -e "  ${CYAN}git config --global user.name \"NamaKamu\"${RESET}"
  echo -e "  ${CYAN}git config --global user.email \"email@kamu.com\"${RESET}"
fi
echo ""
