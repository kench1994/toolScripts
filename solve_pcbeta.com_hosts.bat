@echo off
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
goto UACPrompt
) else ( goto gotAdmin )
:UACPrompt
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
"%temp%\getadmin.vbs"
exit /B
:gotAdmin
if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
pushd "%CD%"
CD /D "%~dp0"
echo 127.0.0.1 localhost >> %windir%\system32\drivers\etc\hosts
echo 218.93.127.136  pcbeta.com >> %windir%\system32\drivers\etc\hosts
echo 218.93.127.136  pcbeta.com >> %windir%\system32\drivers\etc\hosts
echo 218.93.127.136  bbs.pcbeta.com >> %windir%\system32\drivers\etc\hosts
echo 218.93.127.136  uc.pcbeta.com >> %windir%\system32\drivers\etc\hosts
echo 218.93.127.136  www.pcbeta.com >> %windir%\system32\drivers\etc\hosts
echo 218.93.127.136  cdn.pcbeta.css.inimc.com >> %windir%\system32\drivers\etc\hosts
echo 218.93.127.136  static.template.pcbeta.com >> %windir%\system32\drivers\etc\hosts
echo 218.93.127.136  i.pcbeta.com >> %windir%\system32\drivers\etc\hosts
echo 218.93.127.136  cdn.pcbeta.static.inimc.com >> %windir%\system32\drivers\etc\hosts
echo hosts文件修改完成
ipconfig /flushdns
echo DNS缓存已刷新
pause
