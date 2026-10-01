document.addEventListener('DOMContentLoaded', () => {
  const authBtn = document.getElementById('authBtn');
  const saveBtn = document.getElementById('saveBtn');
  const repoInput = document.getElementById('repoInput');
  const statusDiv = document.getElementById('status');

  chrome.storage.local.get(['ghToken', 'ghRepo', 'ghUser'], (data) => {
    if (data.ghToken && data.ghUser) {
      authBtn.textContent = `Connected as @${data.ghUser}`;
      authBtn.style.background = '#1f6feb';
    }
    if (data.ghRepo) {
      repoInput.value = data.ghRepo;
    }
  });

  authBtn.addEventListener('click', () => {
    const token = prompt("Enter your GitHub Personal Access Token (with 'repo' scope):");
    if (!token) return;

    fetch('https://api.github.com/user', {
      headers: { 'Authorization': `token ${token}` }
    })
    .then(res => res.json())
    .then(user => {
      if (user.login) {
        chrome.storage.local.set({ ghToken: token, ghUser: user.login });
        authBtn.textContent = `Connected as @${user.login}`;
        authBtn.style.background = '#1f6feb';
        showStatus('Authentication successful!', true);
      } else {
        showStatus('Invalid token', false);
      }
    })
    .catch(() => showStatus('Authentication failed', false));
  });

  saveBtn.addEventListener('click', () => {
    const repo = repoInput.value.trim();
    if (!repo.includes('/')) {
      showStatus('Format must be: username/repository', false);
      return;
    }
    chrome.storage.local.set({ ghRepo: repo }, () => {
      showStatus('Repository settings saved!', true);
    });
  });

  function showStatus(msg, isSuccess) {
    statusDiv.textContent = msg;
    statusDiv.className = isSuccess ? 'success' : 'error';
  }
});