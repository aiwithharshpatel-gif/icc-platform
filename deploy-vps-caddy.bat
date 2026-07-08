@echo off
echo ========================================================
echo Hostinger VPS Caddy Router Installer for ICC Platform
echo ========================================================
echo.
echo This script will SSH into your VPS (187.127.157.111) using your SSH key
echo and configure Caddy to route traffic from http://icc.thestaymaker.in
echo to the new docker container on port 3000.
echo.
echo Connecting and updating Caddyfile...

ssh -i "%USERPROFILE%\.ssh\id_icc_vps" -o StrictHostKeyChecking=no root@187.127.157.111 "echo -e '\nicc.thestaymaker.in {\n    reverse_proxy 187.127.157.111:3000\n}' >> /docker/influencia-club/Caddyfile && docker restart influencia-club-caddy-1"

echo.
echo Caddyfile updated and container restarted!
echo.
echo Verification: Try opening http://icc.thestaymaker.in in your browser.
echo ========================================================
pause
