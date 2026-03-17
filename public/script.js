document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const themeToggle = document.getElementById('theme-toggle');
    const fetchBtn = document.getElementById('fetch-btn');
    const videoUrlInput = document.getElementById('video-url');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const videoInfoSection = document.getElementById('video-info');
    const thumbnail = document.getElementById('thumbnail');
    const videoTitle = document.getElementById('video-title');
    const videoDuration = document.getElementById('video-duration');
    const formatsContainer = document.getElementById('formats-container');

    // --- State ---
    let currentVideoUrl = '';

    // --- Theme Management ---
    const setInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    };

    themeToggle.addEventListener('click', () => {
        let currentTheme = document.body.getAttribute('data-theme');
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme);
    });

    // --- UI Control Functions ---
    const showLoading = (isLoading) => {
        loader.style.display = isLoading ? 'block' : 'none';
    };

    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    };

    const hideMessages = () => {
        videoInfoSection.style.display = 'none';
        errorMessage.style.display = 'none';
    };

    // --- Main Logic ---
    fetchBtn.addEventListener('click', async () => {
        const url = videoUrlInput.value.trim();
        if (!url) {
            showError('Please enter a video URL.');
            return;
        }

        currentVideoUrl = url;
        hideMessages();
        showLoading(true);

        try {
            const response = await fetch('/video-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to fetch video info.');
            }

            const data = await response.json();
            displayVideoInfo(data);
        } catch (error) {
            console.error(error);
            showError(error.message);
        } finally {
            showLoading(false);
        }
    });

    const displayVideoInfo = (data) => {
        thumbnail.src = data.thumbnail;
        videoTitle.textContent = data.title;
        videoDuration.textContent = `Duration: ${new Date(data.duration * 1000).toISOString().substr(11, 8)}`;
        
        formatsContainer.innerHTML = ''; // Clear previous formats

        const filteredFormats = getFilteredFormats(data.formats);
        if (filteredFormats.length === 0) {
            showError("No suitable video formats found.");
            return;
        }

        filteredFormats.forEach(format => {
            const formatCard = createFormatCard(format);
            formatsContainer.appendChild(formatCard);
        });

        videoInfoSection.style.display = 'block';
    };

    const getFilteredFormats = (formats) => {
        const qualityMap = new Map();
        formats
            .filter(f => f.vcodec !== "none" && f.ext === "mp4")
            .sort((a,b) => b.filesize - a.filesize) // Prioritize larger files for better quality
            .forEach(f => {
                const quality = f.height + 'p';
                if (!qualityMap.has(quality)) {
                    qualityMap.set(quality, f);
                }
            });
        return Array.from(qualityMap.values()).sort((a, b) => b.height - a.height);
    };

    const createFormatCard = (format) => {
        const card = document.createElement('div');
        card.className = 'format-card';
        
        const quality = document.createElement('div');
        quality.className = 'format-quality';
        quality.textContent = `${format.height}p`;
        
        const meta = document.createElement('div');
        meta.className = 'format-meta';
        meta.textContent = `${format.ext.toUpperCase()} | ${(format.filesize / 1024 / 1024).toFixed(2)} MB`;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'rounded-btn download-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.addEventListener('click', (e) => {
            e.target.textContent = 'Downloading...';
            e.target.disabled = true;
            downloadVideo(format.format_id, e.target);
        });

        card.append(quality, meta, downloadBtn);
        return card;
    };

    const downloadVideo = (formatId, buttonElement) => {
        const downloadUrl = `/download?url=${encodeURIComponent(currentVideoUrl)}&formatId=${encodeURIComponent(formatId)}`;
        // Use window.location to trigger download
        window.location.href = downloadUrl;

        setTimeout(() => {
            if (buttonElement) {
                buttonElement.textContent = 'Download';
                buttonElement.disabled = false;
            }
        }, 5000);
    };

    // --- Initial Setup ---
    setInitialTheme();
});
