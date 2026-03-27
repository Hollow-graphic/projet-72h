@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
for /f %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
set RED=%ESC%[31m
set YELLOW=%ESC%[33m
set BLUE=%ESC%[34m
set RESET=%ESC%[0m

:startup
set /A nbCables=2 + !RANDOM! * 4 / 32768 + 1

for /l %%i in (1,1,!nbCables!) do (
    set /A listColor[%%i]=!RANDOM! * 4 / 32768 + 1
    call :intToColor !listColor[%%i]!
    echo %%i!color!~~~~~~~!RESET!
)
pause
set /A response="(x to exit) which cables to you cut ?:"
call :verifyCables !response!
goto startup

REM 1=RED 2=YELLOW 3=BLUE 4=BLACK
:intToColor
if "%~1"=="1" (
    set color=!RED!
) else if "%~1"=="2" (
    set color=!YELLOW!
) else if "%~1"=="3" (
    set color=!BLUE!
) else (
    set color=!RESET!
)
exit /b

REM S'il n'y a pas de fil rouge, coupez le deuxième fil.
REM Sinon, si le dernier fil est blanc, coupez le dernier fil.
REM Sinon, s'il y a plus d'un fil bleu, coupez le dernier fil bleu.
REM Sinon, coupez le dernier fil.

:verifyCables
set rules1 = 0
set rules2 = 0
set rules3 = 0
set rules3bis = 0
if !nbCables!=3 (
	for /l %%i in (1,1,!nbCables!) do (
		if listColor[%%i]=1 (rules1=1)
		else if listColor[%%i]=3 (
			rules3=!rule3!+1
			rules3bis=%%i
		)
	)
	if rules1=0
	if listColor[!nbCables!]=4 (rule2=1)
	
) else (
	echo undifined rules
)
exit /b

