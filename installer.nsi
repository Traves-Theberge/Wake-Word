; Wake Word Detector Installer Script
; NSIS Modern User Interface

!include "MUI2.nsh"
!include "FileFunc.nsh"

; Define application information
!define APP_NAME "Wake Word Detector"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Wake Word Detector Team"
!define APP_URL "https://github.com/wakeword-detector"
!define APP_EXECUTABLE "Wake-Word-Detector.exe"
!define APP_REGKEY "Software\${APP_NAME}"
!define APP_UNINSTALLER "Uninstall.exe"

; Installer settings
Name "${APP_NAME}"
OutFile "Wake-Word-Detector-Setup.exe"
InstallDir "$PROGRAMFILES\${APP_NAME}"
InstallDirRegKey HKLM "${APP_REGKEY}" "InstallPath"
RequestExecutionLevel admin

; Modern UI Configuration
!define MUI_ABORTWARNING
!define MUI_ICON "assets\app.ico"
!define MUI_UNICON "assets\app.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "assets\app.ico"
!define MUI_WELCOMEFINISHPAGE_BITMAP "assets\app.ico"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_EXECUTABLE}"
!define MUI_FINISHPAGE_RUN_TEXT "Start ${APP_NAME}"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\README.md"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Show README"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Languages
!insertmacro MUI_LANGUAGE "English"

; Version Information
VIProductVersion "1.0.0.0"
VIAddVersionKey /LANG=${LANG_ENGLISH} "ProductName" "${APP_NAME}"
VIAddVersionKey /LANG=${LANG_ENGLISH} "CompanyName" "${APP_PUBLISHER}"
VIAddVersionKey /LANG=${LANG_ENGLISH} "LegalCopyright" "© 2024 ${APP_PUBLISHER}"
VIAddVersionKey /LANG=${LANG_ENGLISH} "FileDescription" "${APP_NAME} Installer"
VIAddVersionKey /LANG=${LANG_ENGLISH} "FileVersion" "${APP_VERSION}"
VIAddVersionKey /LANG=${LANG_ENGLISH} "ProductVersion" "${APP_VERSION}"

; Installer Sections
Section "Core Application" SecCore
    SectionIn RO ; Read-only section
    
    ; Set output path
    SetOutPath "$INSTDIR"
    
    ; Copy application files
    File /r "release\Wake Word Detector-win32-x64\*"
    
    ; Create uninstaller
    WriteUninstaller "$INSTDIR\${APP_UNINSTALLER}"
    
    ; Write registry entries
    WriteRegStr HKLM "${APP_REGKEY}" "InstallPath" "$INSTDIR"
    WriteRegStr HKLM "${APP_REGKEY}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKLM "${APP_REGKEY}" "DisplayVersion" "${APP_VERSION}"
    WriteRegStr HKLM "${APP_REGKEY}" "Publisher" "${APP_PUBLISHER}"
    WriteRegStr HKLM "${APP_REGKEY}" "URLInfoAbout" "${APP_URL}"
    WriteRegStr HKLM "${APP_REGKEY}" "UninstallString" "$INSTDIR\${APP_UNINSTALLER}"
    WriteRegStr HKLM "${APP_REGKEY}" "QuietUninstallString" "$INSTDIR\${APP_UNINSTALLER} /S"
    
    ; Add to Programs and Features
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$INSTDIR\${APP_UNINSTALLER}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayIcon" "$INSTDIR\${APP_EXECUTABLE}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayVersion" "${APP_VERSION}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "Publisher" "${APP_PUBLISHER}"
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoModify" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoRepair" 1
    
    ; Get installed size
    ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
    IntFmt $0 "0x%08X" $0
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "EstimatedSize" "$0"
SectionEnd

Section "Desktop Shortcut" SecDesktop
    CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXECUTABLE}" "" "$INSTDIR\${APP_EXECUTABLE}" 0
SectionEnd

Section "Start Menu Shortcut" SecStartMenu
    CreateDirectory "$SMPROGRAMS\${APP_NAME}"
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXECUTABLE}" "" "$INSTDIR\${APP_EXECUTABLE}" 0
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\Uninstall ${APP_NAME}.lnk" "$INSTDIR\${APP_UNINSTALLER}" "" "$INSTDIR\${APP_UNINSTALLER}" 0
SectionEnd

Section "Start with Windows" SecAutoStart
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}" "$INSTDIR\${APP_EXECUTABLE} --startup"
SectionEnd

Section "Pin to Taskbar" SecTaskbar
    ; Note: Programmatic taskbar pinning is restricted in newer Windows versions
    ; This section creates a helper script for manual pinning
    FileOpen $0 "$INSTDIR\pin-to-taskbar.bat" w
    FileWrite $0 "@echo off$\r$\n"
    FileWrite $0 "echo To pin ${APP_NAME} to the taskbar:$\r$\n"
    FileWrite $0 "echo 1. Right-click on ${APP_NAME} in the Start Menu$\r$\n"
    FileWrite $0 "echo 2. Select 'Pin to taskbar'$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 "echo Or right-click the desktop shortcut and select 'Pin to taskbar'$\r$\n"
    FileWrite $0 "pause$\r$\n"
    FileClose $0
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${SecCore} "Core application files (required)"
    !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} "Create desktop shortcut"
    !insertmacro MUI_DESCRIPTION_TEXT ${SecStartMenu} "Create Start Menu shortcuts"
    !insertmacro MUI_DESCRIPTION_TEXT ${SecAutoStart} "Start ${APP_NAME} automatically when Windows starts"
    !insertmacro MUI_DESCRIPTION_TEXT ${SecTaskbar} "Instructions for pinning to taskbar"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Functions
Function .onInit
    ; Check if already installed
    ReadRegStr $R0 HKLM "${APP_REGKEY}" "InstallPath"
    StrCmp $R0 "" done
    
    MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
        "${APP_NAME} is already installed. $\n$\nClick OK to remove the previous version or Cancel to cancel this upgrade." \
        IDOK uninst
    Abort
    
    uninst:
        ClearErrors
        ExecWait '$R0\${APP_UNINSTALLER} _?=$R0'
        
        IfErrors no_remove_uninstaller done
            Delete $R0\${APP_UNINSTALLER}
            RMDir $R0
        no_remove_uninstaller:
    
    done:
FunctionEnd

; Uninstaller Section
Section "Uninstall"
    ; Kill running processes
    nsExec::ExecToLog 'taskkill /f /im "${APP_EXECUTABLE}" /t'
    
    ; Remove from startup
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}"
    
    ; Remove files
    Delete "$INSTDIR\${APP_UNINSTALLER}"
    Delete "$INSTDIR\pin-to-taskbar.bat"
    RMDir /r "$INSTDIR"
    
    ; Remove shortcuts
    Delete "$DESKTOP\${APP_NAME}.lnk"
    RMDir /r "$SMPROGRAMS\${APP_NAME}"
    
    ; Remove registry entries
    DeleteRegKey HKLM "${APP_REGKEY}"
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
    
    ; Remove installation directory if empty
    RMDir "$INSTDIR"
SectionEnd

; Post-install function
Function .onInstSuccess
    MessageBox MB_YESNO "${APP_NAME} has been installed successfully!$\n$\nWould you like to view the installation folder?" IDNO +2
    ExecShell "explore" "$INSTDIR"
FunctionEnd
