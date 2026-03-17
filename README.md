<<<<<<< HEAD
# Universal Video Downloader

This is a modern web application that allows users to download videos from various online platforms in different formats.

## Tech Stack

-   **Frontend:** HTML, CSS, Vanilla JavaScript
-   **Backend:** Node.js with Express.js
-   **Video Processing:** `yt-dlp`

## Features

-   Clean, modern, and responsive user interface.
-   Dark mode support.
-   Fetches video title, thumbnail, and duration.
-   Lists available download formats (e.g., 360p, 720p, 1080p).
-   Streams downloads directly to the user.
-   User-friendly error handling.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd video-downloader
    ```

2.  **Install yt-dlp:**
    This project requires `yt-dlp` to be installed and accessible in your system's PATH. The recommended way to install it is using Python's package manager, pip.

    ```bash
    pip install yt-dlp
    ```
    *Ensure you have Python and pip installed. If you update `yt-dlp` in the future, run `pip install --upgrade yt-dlp`.*

3.  **Install Node.js Dependencies:**
    Navigate to the project directory and run:
    ```bash
    npm install express yt-dlp-wrap
    ```
    This will install the necessary Node.js packages.

## How to Run the Application

1.  **Start the server:**
    ```bash
    node server.js
    ```
    You will see a confirmation message in your terminal indicating that the server is running.

2.  **Access the application:**
    Open your web browser and go to the following address:
    ```
    http://localhost:3000
    ```

## How to Use

1.  **Paste URL:** Copy a video URL from a supported website (like YouTube) and paste it into the input field.
2.  **Get Info:** Click the "Get Video Info" button.
3.  **Select Format:** The application will display the video's thumbnail, title, and a list of available download formats with their respective file sizes.
4.  **Download:** Click the "Download" button next to your desired format. The download will start automatically in your browser.
=======
# Uni-Downloader
>>>>>>> ecc70ca7bedc5f0495e9c6455a7a2c53cb6ed5c1
