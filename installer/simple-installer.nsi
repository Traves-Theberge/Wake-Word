; Simple Claude Wake Word Detector Installer
; Minimal NSIS script to avoid corruption issues

Name "Claude Wake Word Detector"
OutFile "Claude-Wake-Word-Detector-Simple-Setup.exe"
InstallDir "$PROGRAMFILES64\Claude Wake Word Detector"
RequestExecutionLevel admin

; Simpler compression
SetCompressor lzma

; Basic pages
Page directory
Page instfiles

Section "Install"
  SetOutPath "$INSTDIR"
  
  ; Copy all files from release directory
  File /r "..\release\Claude Wake Word Detector-win32-x64\*"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Add to Programs and Features
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClaudeWakeWordDetector" "DisplayName" "Claude Wake Word Detector"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClaudeWakeWordDetector" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClaudeWakeWordDetector" "Publisher" "Traves Theberge"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\Claude Wake Word Detector"
  CreateShortCut "$SMPROGRAMS\Claude Wake Word Detector\Claude Wake Word Detector.lnk" "$INSTDIR\Claude-Wake-Word-Detector.exe"
  CreateShortCut "$DESKTOP\Claude Wake Word Detector.lnk" "$INSTDIR\Claude-Wake-Word-Detector.exe"
  
  MessageBox MB_OK "Installation completed successfully!"
SectionEnd

Section "Uninstall"
  ; Remove files
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\Claude Wake Word Detector.lnk"
  RMDir /r "$SMPROGRAMS\Claude Wake Word Detector"
  
  ; Remove registry entries
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClaudeWakeWordDetector"
SectionEnd
