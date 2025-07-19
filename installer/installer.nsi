; Claude Wake Word Detector - NSIS Installer Script
; Professional Windows installer with wizard interface

; Include modern UI and other required libraries
!include "MUI2.nsh"
!include "nsDialogs.nsh"
!include "LogicLib.nsh"
!include "x64.nsh"
!include "WinMessages.nsh"

; Define application information
!define APP_NAME "Claude Wake Word Detector"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Traves Theberge"
!define APP_EXE "Claude-Wake-Word-Detector.exe"
!define APP_ID "ClaudeWakeWordDetector"
!define APP_DESCRIPTION "Voice-activated wake word detection for 'Hey Claude'"

; Define installer properties
Name "${APP_NAME}"
OutFile "Claude-Wake-Word-Detector-Setup.exe"
InstallDir "$PROGRAMFILES64\${APP_NAME}"
InstallDirRegKey HKLM "Software\${APP_NAME}" "Install_Dir"

; Request application privileges
RequestExecutionLevel admin

; Set compression
SetCompressor /SOLID lzma

; Version information
VIProductVersion "${APP_VERSION}.0"
VIAddVersionKey /LANG=1033 "ProductName" "${APP_NAME}"
VIAddVersionKey /LANG=1033 "CompanyName" "${APP_PUBLISHER}"
VIAddVersionKey /LANG=1033 "LegalCopyright" "Copyright (C) 2025 ${APP_PUBLISHER}"
VIAddVersionKey /LANG=1033 "FileDescription" "${APP_DESCRIPTION}"
VIAddVersionKey /LANG=1033 "FileVersion" "${APP_VERSION}"
VIAddVersionKey /LANG=1033 "ProductVersion" "${APP_VERSION}"

; Interface Settings
!define MUI_ABORTWARNING
!define MUI_ICON "..\assets\Install.ico"
!define MUI_UNICON "..\assets\Install.ico"
; Banner images are optional - comment out if not available
; !define MUI_WELCOMEFINISHPAGE_BITMAP "..\assets\installer-banner.bmp"
; !define MUI_UNWELCOMEFINISHPAGE_BITMAP "..\assets\installer-banner.bmp"

; Modern UI Settings
!define MUI_WELCOMEPAGE_TITLE "Welcome to ${APP_NAME} Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${APP_NAME}.\r\n\r\n${APP_DESCRIPTION}\r\n\r\nClick Next to continue."

!define MUI_LICENSEPAGE_TEXT_TOP "Please read the following license agreement before installing ${APP_NAME}."

!define MUI_COMPONENTSPAGE_TEXT_TOP "Select the components you want to install. Click Next to continue."

!define MUI_DIRECTORYPAGE_TEXT_TOP "Setup will install ${APP_NAME} in the following folder. To install in a different folder, click Browse and select another folder. Click Next to continue."

!define MUI_FINISHPAGE_TITLE "Installation Complete"
!define MUI_FINISHPAGE_TEXT "${APP_NAME} has been installed on your computer.\r\n\r\nClick Finish to close this wizard."
!define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_EXE}"
!define MUI_FINISHPAGE_RUN_TEXT "Launch ${APP_NAME}"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\README.txt"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Show README"

; Uninstaller Settings
!define MUI_UNCONFIRMPAGE_TEXT_TOP "${APP_NAME} will be removed from the following folder. Click Uninstall to start the uninstallation."

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Languages
!insertmacro MUI_LANGUAGE "English"

; Reserve files - not needed for MUI2
; !insertmacro MUI_RESERVEFILE_INSTALLOPTIONS

; Installer Sections
Section "Main Application" SecMain
  SectionIn RO
  SetOutPath "$INSTDIR"
  
  ; Copy the real application files
  File /r "..\release\Claude Wake Word Detector-win32-x64\*.*"
  
  ; Copy README and LICENSE files
  File "README.txt"
  File "LICENSE.txt"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Write registry information for add/remove programs
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "DisplayIcon" "$INSTDIR\${APP_EXE}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "Publisher" "${APP_PUBLISHER}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "URLInfoAbout" "https://github.com/yourusername/wake-word-detector"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "HelpLink" "https://github.com/yourusername/wake-word-detector/issues"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "NoRepair" 1
  
  ; Write install directory to registry
  WriteRegStr HKLM "Software\${APP_NAME}" "Install_Dir" "$INSTDIR"
SectionEnd

Section "Desktop Shortcut" SecDesktop
  CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0
SectionEnd

Section "Start Menu Shortcut" SecStartMenu
  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\Uninstall.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe" 0
SectionEnd

Section "Auto-start with Windows" SecAutoStart
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}" '"$INSTDIR\${APP_EXE}"'
SectionEnd

; Section descriptions
LangString DESC_SecMain ${LANG_ENGLISH} "Main application files (required)"
LangString DESC_SecDesktop ${LANG_ENGLISH} "Create a shortcut on the desktop"
LangString DESC_SecStartMenu ${LANG_ENGLISH} "Create shortcuts in the Start Menu"
LangString DESC_SecAutoStart ${LANG_ENGLISH} "Automatically start ${APP_NAME} when Windows starts"

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecMain} $(DESC_SecMain)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} $(DESC_SecDesktop)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStartMenu} $(DESC_SecStartMenu)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecAutoStart} $(DESC_SecAutoStart)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Uninstaller Section
Section "Uninstall"
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}"
  DeleteRegKey HKLM "Software\${APP_NAME}"
  DeleteRegValue HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}"
  
  ; Remove files and uninstaller
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\${APP_NAME}.lnk"
  RMDir /r "$SMPROGRAMS\${APP_NAME}"
  
  ; Remove install directory if empty
  RMDir "$INSTDIR"
SectionEnd

; Functions
Function .onInit
  ; Check if already installed
  ReadRegStr $R0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}" "UninstallString"
  StrCmp $R0 "" done
  
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
    "${APP_NAME} is already installed. $\n$\nClick 'OK' to remove the previous version or 'Cancel' to cancel this update." \
    IDOK uninst
  Abort
  
  uninst:
    ExecWait '$R0 _?=$INSTDIR'
    
  done:
FunctionEnd

Function .onInstSuccess
  MessageBox MB_YESNO|MB_ICONQUESTION \
    "Installation completed successfully!$\n$\nWould you like to launch ${APP_NAME} now?" \
    IDNO NoLaunch
    Exec "$INSTDIR\${APP_EXE}"
  NoLaunch:
FunctionEnd 