@echo off
echo ========================================
echo   Portfolio React App - Starting...
echo ========================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting development server...
echo.
echo Access the application at:
echo   Portfolio: http://localhost:5173/
echo   Admin:     http://localhost:5173/admin
echo   Login:     http://localhost:5173/login
echo.
echo Default password: admin123
echo.
call npm run dev
