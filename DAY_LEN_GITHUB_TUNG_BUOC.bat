@echo off
chcp 65001 >nul
title DAY DU AN LOCIEDU LEN GITHUB THEO TUNG CHANG
color 0B

echo =====================================================================
echo    LOCIEDU - TUDONG DAY TOAN BO DU AN LEN GITHUB (CHIA 5 CHIEU)
echo =====================================================================
echo.
echo  Giai thich: Vi du an chua 801 tep (nang hon 2GB), neu day 1 lan
echo  se mat hon 16 phut dan den GitHub bao loi [HTTP 408 Timeout].
echo  Bo script nay se chia thanh 5 chang nhe nhang (moi chang 1-3 phut)
echo  de day 100%% day du khong thieu 1 tep nao!
echo.
echo =====================================================================
echo.

cd /d "d:\NCKH\LOCI_EDU_DEPLOY_PACKAGE"

echo [*] Cau hinh bo dem Git tang toc do va chong dut quang...
git config http.postBuffer 1048576000
git config http.lowSpeedLimit 1000
git config http.lowSpeedTime 3600
git config core.compression 1
echo [OK] Da cau hinh bo dem 1GB.
echo.

echo ---------------------------------------------------------------------
echo [1/5] Dang day MA NGUON WEB, HTML, JS, HINH ANH, AM THANH (~120MB)...
echo ---------------------------------------------------------------------
git push origin f6b9a46:refs/heads/main
if errorlevel 1 (
    echo.
    echo [!] Chang 1 chua hoan tat. Hay kiem tra mang hoac dang nhap GitHub va thu lai.
    pause
    exit /b 1
)
echo [OK] Chang 1 thanh cong! Tren GitHub da co toan bo code web va anh.
echo.

echo ---------------------------------------------------------------------
echo [2/5] Dang day MO HINH 3D BAI 6 (~60MB)...
echo ---------------------------------------------------------------------
git push origin 08058bf:refs/heads/main
if errorlevel 1 (
    echo.
    echo [!] Chang 2 gap truc trac. Hay chay lai script de tiep tuc chang nay.
    pause
    exit /b 1
)
echo [OK] Chang 2 thanh cong!
echo.

echo ---------------------------------------------------------------------
echo [3/5] Dang day MO HINH 3D BAI 7 (~160MB)...
echo ---------------------------------------------------------------------
git push origin 54e0ced:refs/heads/main
if errorlevel 1 (
    echo.
    echo [!] Chang 3 gap truc trac. Hay chay lai script de tiep tuc chang nay.
    pause
    exit /b 1
)
echo [OK] Chang 3 thanh cong!
echo.

echo ---------------------------------------------------------------------
echo [4/5] Dang day MO HINH 3D BAI 8 (~200MB)...
echo ---------------------------------------------------------------------
git push origin ae351b6:refs/heads/main
if errorlevel 1 (
    echo.
    echo [!] Chang 4 gap truc trac. Hay chay lai script de tiep tuc chang nay.
    pause
    exit /b 1
)
echo [OK] Chang 4 thanh cong!
echo.

echo ---------------------------------------------------------------------
echo [5/5] Dang day MO HINH KHONG GIAN 360 VA HOAN TAT 100%% (~50MB)...
echo ---------------------------------------------------------------------
git push -u origin main
if errorlevel 1 (
    echo.
    echo [!] Chang 5 gap truc trac. Hay chay lai script de tiep tuc chang nay.
    pause
    exit /b 1
)
echo.
echo =====================================================================
echo    CHUC MUNG! TOAN BO 801 TEP CUA LOCIEDU DA LEN GITHUB THANH CONG!
echo =====================================================================
echo  Ban co the vao: https://github.com/vuongnhatm-boop/Lociedu
echo  de kiem tra. Toan bo ma nguon, anh, am thanh va mo hinh 3D da day du.
echo =====================================================================
pause
