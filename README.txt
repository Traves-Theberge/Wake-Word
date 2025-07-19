# Wake Word Detector

A simple, open-source, and privacy-focused wake word detection application for Windows that listens for "Hey Claude" and then executes predefined commands, such as opening a terminal with a specific profile.

This application runs locally on your machine. It uses Picovoice's Porcupine wake word engine for efficient and accurate wake word detection.

## Features

-   **Voice-Activated:** Listens for the "Hey Claude" wake word.
-   **Command Execution:** Executes custom commands in WSL or native Windows.
-   **Customizable:** Configure everything from the `.env` file.
-   **Lightweight:** Minimal resource usage, runs in the background.
-   **Privacy-Focused:** All voice processing happens locally. No data is sent to the cloud for wake word detection.

## Installation

1.  Run the `Claude-Wake-Word-Detector-Setup.exe` installer.
2.  Follow the on-screen instructions. You can choose to:
    -   Create a Desktop Shortcut.
    -   Create Start Menu shortcuts.
    -   Have the application start automatically with Windows.
3.  Once installed, launch the application.

## Configuration

After installation, you need to configure the application by editing the `.env` file located in the installation directory (e.g., `C:\Program Files\Claude Wake Word Detector`).

1.  **PICOVOICE_ACCESS_KEY:** This is the most important step.
    -   Go to the [Picovoice Console](https://console.picovoice.ai/).
    -   Sign up or log in.
    -   Create a new Access Key.
    -   Copy the key and paste it into the `.env` file.

2.  **Terminal and Commands:** Customize what happens when "Hey Claude" is detected.
    -   `USE_WSL`: Set to `true` to run commands in WSL, `false` for native Windows.
    -   `TERMINAL_TITLE`: The title of the terminal window that opens.
    -   `DEFAULT_COMMAND`: The primary command to execute.
    -   And many more options for multiple execution steps. See the `.env` file for detailed comments.

## How to Use

1.  Make sure the application is running (you can see its icon in the system tray).
2.  Say "Hey Claude".
3.  The configured commands will be executed.

The system tray icon will be green when listening and red when there is an error or it's paused.

## Building from Source

If you want to build the application yourself:

1.  Clone the repository.
2.  Install Node.js and npm.
3.  Run `npm install`.
4.  Run `npm run dist` to build the application.
5.  Run `npm run installer` to create the installer package.

## License

This project is licensed under the MIT License. See the `LICENSE.txt` file for details.
