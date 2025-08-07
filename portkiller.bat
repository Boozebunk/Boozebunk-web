:: Purpose: Forcefully terminates a process using a specific network port.
:: Use when you see "address already in use" or "port XXXX already in use" errors during local development.

:: How to use:
:: 1. Open Command Prompt (CMD).
:: 2. Navigate to this script's directory: cd <path_to_script>
:: 3. Run the script: portkiller.bat
:: 4. Enter the problematic port number when prompted.

@ECHO ON
set /p portid=Enter the Port to be killed:
echo %portid%
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr %portid% ') DO (
SET /A ProcessId=%%T) &GOTO SkipLine
:SkipLine
echo ProcessId to kill = %ProcessId%
taskkill /f /pid %ProcessId%
PAUSE
