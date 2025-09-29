
# Deployment to Android using Capacitor

This guide provides high-level steps to wrap this React web application into a native Android application using [Capacitor](https://capacitorjs.com/).

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **Node.js and npm:** [Download & Install Node.js](https://nodejs.org/)
2.  **Android Studio:** [Download & Install Android Studio](https://developer.android.com/studio)
3.  **Java JDK:** Required by Android Studio.

## Step-by-Step Guide

### Step 1: Build the React Application

First, you need to create a production build of your React application. This command will compile your code and assets into a `dist` (or `build`) folder.

```bash
npm run build
```

### Step 2: Add Capacitor to Your Project

Capacitor is a tool that allows you to run web apps natively on mobile devices.

1.  **Install Capacitor CLI and Core:**

    ```bash
    npm install @capacitor/core @capacitor/cli
    ```

2.  **Initialize Capacitor:**
    Run the init command and follow the prompts. You'll be asked for an app name and an app ID (usually in reverse domain name format, e.g., `com.company.appname`).

    ```bash
    npx cap init "Keuanganku AI" "com.keuanganku.ai"
    ```

3.  **Configure Capacitor:**
    Open the newly created `capacitor.config.ts` (or `.json`) file and ensure the `webDir` property points to your React build output folder.

    ```typescript
    // capacitor.config.ts
    import type { CapacitorConfig } from '@capacitor/cli';

    const config: CapacitorConfig = {
      appId: 'com.keuanganku.ai',
      appName: 'Keuanganku AI',
      webDir: 'dist', // or 'build' depending on your setup
      // ... other configurations
    };

    export default config;
    ```

4.  **Install the Android Platform:**

    ```bash
    npm install @capacitor/android
    npx cap add android
    ```

    This will create an `android` directory in your project root, which contains a native Android project.

### Step 3: Sync and Open in Android Studio

1.  **Sync Your Web Build:**
    Every time you make changes to your web code and rebuild it, you need to sync it with the native project.

    ```bash
    npx cap sync
    ```

2.  **Open the Project in Android Studio:**
    This command will launch Android Studio and open your native Android project.

    ```bash
    npx cap open android
    ```

### Step 4: Build and Run the App

Once the project is open in Android Studio:

1.  **Wait for Gradle Sync:** Android Studio will automatically sync the project's Gradle files. This may take a few minutes.
2.  **Select a Device:** Choose a connected physical device or a virtual device (Emulator) from the toolbar at the top of Android Studio.
3.  **Run the App:** Click the green 'Run' button (a triangle icon) in the toolbar. Android Studio will build the `.apk` file, install it on the selected device, and launch the application.

Your React application should now be running inside a native Android wrapper!

### Important Notes

*   **API Keys:** For a real application, you should not expose your Gemini API key on the frontend. Use a secure backend server to make API calls. The `process.env.API_KEY` in this project is a placeholder for development.
*   **Native Features:** With Capacitor, you can also access native device features (like Camera, Geolocation, etc.) using official or community plugins.
*   **Further Reading:** For more detailed information and troubleshooting, always refer to the [Official Capacitor Documentation](https://capacitorjs.com/docs).
