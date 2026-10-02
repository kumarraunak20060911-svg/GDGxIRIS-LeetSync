# LeetSync 🚀

> **Automated LeetCode-to-GitHub Synchronizer**  
> *A Manifest V3 Chrome Extension that captures accepted LeetCode submissions and automatically pushes source code, problem descriptions, and performance metrics to GitHub using the REST API.*

---

## 📌 Executive Summary

**LeetSync** is an automated browser extension designed to help developers track their competitive programming journey seamlessly. Built on Chrome Extension Manifest V3, LeetSync monitors LeetCode problem pages in real time, extracts submission details upon an accepted verdict, and pushes organized solutions directly to a target GitHub repository without manual intervention.

---

## ✨ Features

- **Automated Solution Sync:** Employs a DOM `MutationObserver` on LeetCode problem pages to detect when a submission achieves an `"Accepted"` status and automatically triggers the commit pipeline.
- **GitHub REST API Integration:** Connects securely with GitHub via Personal Access Tokens (PAT) and leverages the REST API to manage remote repository files seamlessly.
- **Smart Directory Structure:** Organizes submissions cleanly by problem ID and slugified problem title.
- **Version Control & Overwrites:** Checks for pre-existing solutions to update files seamlessly when better or revised solutions are submitted.

---

## 🏆 Bonus Features Implemented

1. **Auto-Generated Problem READMEs:** Scrapes the LeetCode problem description and constraints directly from the DOM and generates a dedicated `README.md` alongside the solution code inside each problem folder.
2. **Embedded Performance Metrics:** Extracts execution runtime and memory consumption statistics from the submission screen and appends them as a structured comment header at the top of the pushed source code file.

---

## 📁 Repository Structure

### 1. Extension Source Code (This Repository)
```text
LeetSync/
├── manifest.json      # Chrome Extension Manifest V3 configuration
├── popup.html         # Extension UI popup window
├── popup.js           # UI logic & token authentication handler
├── background.js      # Service worker handling GitHub REST API requests
├── content.js         # Content script monitoring LeetCode DOM & extracting code
├── icon.png           # Extension toolbar icon
└── README.md          # Project documentation
