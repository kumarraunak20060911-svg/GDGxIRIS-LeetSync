# Project Video & Submission Walkthrough

This document contains the official video demonstration and architectural explanation link for the **LeetSync** Chrome Extension submission.

---

## 🎥 Video Demonstration Link

Click the link below to watch the complete project demonstration:

👉 **[Watch LeetSync Project Demonstration & Code Explanation](https://drive.google.com/drive/folders/1Nc4KoOSs17oCq7KK5WP1xends0WArSz5?usp=sharing)**

---

## 📝 What is Covered in the Video

1. **Architecture & Extension Loading:**
   - Loading the Manifest V3 Chrome Extension via Developer Mode.
   - Initializing the background Service Worker and Content Script observers.

2. **GitHub Authentication & Configuration:**
   - Setting up GitHub Personal Access Tokens (PAT) securely inside `chrome.storage.local`.
   - Configuring target solution repository paths.

3. **End-to-End Live Workflow:**
   - Submitting a solution on LeetCode.
   - Detecting the `"Accepted"` DOM state using `MutationObserver`.
   - Extracting code from Monaco Editor alongside execution runtime & memory metrics.
   - Auto-scraping problem details and generating problem-specific `README.md` files.
   - Automatically pushing commits directly to GitHub via the REST API.
