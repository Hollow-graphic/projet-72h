@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
for /f %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
set result=""
set timerMinute = %time:~3,2%
set /A timerMinute = !timerMinute!+3
set /A timerSecond = %time:~6,2%
set RED=%ESC%[31m
set YELLOW=%ESC%[33m
set BLUE=%ESC%[34m
set RESET=%ESC%[0m

set nbMod=3

:Startup
cls
set str1=┌
set str2=│
set str3=│
set str4=│
set str5=└

for /l %%i in (1,1,%nbMod%) do (
    REM set /A listMod[%%i]=!RANDOM! * 3 / 32768 + 1
    set listMod[%%i]=1
    
    set str1=!str1!───────
    call :moduleDisplay !listMod[%%i]!
    set str5=!str5!───────

    if %%i==%nbMod% (
        set str1=!str1!┐
        set str5=!str5!┘
    ) else (
        set str1=!str1!┬
        set str5=!str5!┴
    )
)
goto base
exit /b

:failed
echo failed
echo with %timerMinute%:%timerSecond%
pause
goto startup

:win
echo you Win
pause
goto startup

:base
cls
set result=%nbMod%
for /l %%i in (1,1,%nbMod%) do (
    if !listMod[%%i]!==-1 (
        set /A result=!result!-1
    )
)
if %time:~3,2% GEQ %timerMinute% if  %time:~6,2% GEQ %timerSecond% (goto failed)
echo %timerSecond%
if !result!==0 (goto win)
echo need %result% to finish / %time:~3,2%:%time:~6,2%
echo !str1!
echo !str2!
echo !str3!
echo !str4!
echo !str5!

set /P input="Choose module: "
call :modRedirect %input%
goto base

REM 1=Wire 2=Button 3=Keypad
:moduleDisplay
if "%~1"=="1" (
    set str2=!str2!~~~~~~~│
    set str3=!str3!~~~~~~~│
    set str4=!str4!~~~~~~~│
) else if "%~1"=="2" (
    set str2=!str2! /───\ │
    set str3=!str3!  ---  │
    set str4=!str4! \───/ │
) else if "%~1"=="3" (
    set str2=!str2! ┌─┬─┐ │
    set str3=!str3! ├─┼─┤ │
    set str4=!str4! └─┴─┘ │
) else if "%~1"=="-1" (
    set str2=!str2!       │
    set str3=!str3!       │
    set str4=!str4!       │
) else (
    set str2=!str2! error │
    set str3=!str3! error │
    set str4=!str4! error │
)
exit /b

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

:modRedirect
if "!listMod[%~1]!"=="1" (call :modWires %~1)
if "!listMod[%~1]!"=="2" (call :modButton %~1)
if "!listMod[%~1]!"=="3" (call :modKeypad %~1)
echo !listMod[%~1]!
goto base
exit /b

:modWires
REM set /A nbWire=2 + !RANDOM! * 4 / 32768 + 1
set nbWire=3
for /l %%i in (1,1,!nbWire!) do (
    set /A listColor[%%i]=!RANDOM! * 4 / 32768 + 1
    call :intToColor !listColor[%%i]!
    echo %%i!color!~~~~~~~!RESET!
)
set /P response="(x to exit) which Wires to you cut ?: "
call :verifyWires !response!
goto startup

REM S'il n'y a pas de fil rouge, coupez le deuxième fil.
REM Sinon, si le dernier fil est blanc, coupez le dernier fil.
REM Sinon, s'il y a plus d'un fil bleu, coupez le dernier fil bleu.
REM Sinon, coupez le dernier fil.

:verifyWires
set rules1=0
set rules2=0
set rules3=0
set rules3bis=0
if !nbWire!==3 (
	for /l %%i in (1,1,!nbWire!) do (
		if !listColor[%%i]!==1 (set rules1=1)
		if !listColor[%%i]!==3 (
			set /A rules3=!rules3!+1
			set rules3bis=%%i
		)
	)
	if !rules1!==0 (set correctWire=2
	) else if !listColor[%nbWire%]!==4 (set correctWire=%nbWire%
    ) else if !rules3! GTR 1 (set correctWire=!rules3bis!
    ) else (set correctWire=%nbWire%)
	if %~1==!correctWire! (
        set listMod[%input%]=-1
        goto base
    ) else (
        echo %~1
        echo !correctWire!
        goto failed
    )
) else (
	echo undifined rules
    echo nbWire: !nbWire!
)
pause
exit /b

:modButton
echo button
pause
exit /b

:modKeypad
echo keypad
pause
exit /b

