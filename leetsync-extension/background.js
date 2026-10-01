chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SYNC_SUBMISSION") {
    handleSync(request.data).then(sendResponse);
    return true;
  }
});

async function handleSync(data) {
  const { ghToken, ghRepo } = await chrome.storage.local.get(['ghToken', 'ghRepo']);

  if (!ghToken || !ghRepo) {
    return { success: false, message: 'Missing GitHub Auth or Repository in LeetSync Extension.' };
  }

  const header = `/*\n * Problem: ${data.title}\n * Runtime Stats: ${data.runtime} | Memory: ${data.memory}\n */\n\n`;
  const codeContent = header + data.code;
  const folderName = `${data.id.padStart(4, '0')}-${data.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const codePath = `${folderName}/solution.${getFileExtension(data.language)}`;
  const readmePath = `${folderName}/README.md`;

  try {
    await commitFileToGitHub(ghRepo, codePath, codeContent, `Auto-commit: Solved ${data.id}. ${data.title}`, ghToken);

    const readmeContent = `# ${data.title}\n\n## Description\n\n${data.description}\n\n---\n*Pushed automatically via LeetSync*`;
    await commitFileToGitHub(ghRepo, readmePath, readmeContent, `Docs: Add problem description for ${data.title}`, ghToken);

    return { success: true, message: 'Successfully synced solution to GitHub!' };
  } catch (err) {
    if (err.status === 401) {
      chrome.action.setBadgeText({ text: 'ERR' });
      return { success: false, message: '401 Unauthorized: Please re-authenticate token.' };
    }
    return { success: false, message: err.message || 'GitHub Sync Failed' };
  }
}

async function commitFileToGitHub(repo, path, content, commitMessage, token) {
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  
  let sha = null;
  const getRes = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
  if (getRes.status === 200) {
    const existingData = await getRes.json();
    sha = existingData.sha;
  }

  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  const body = {
    message: commitMessage,
    content: encodedContent,
    ...(sha && { sha })
  };

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!putRes.ok) {
    const errorData = await putRes.json();
    const error = new Error(errorData.message || 'Push failed');
    error.status = putRes.status;
    throw error;
  }
}

function getFileExtension(lang) {
  const l = lang.toLowerCase();
  if (l.includes('python')) return 'py';
  if (l.includes('cpp') || l.includes('c++')) return 'cpp';
  if (l.includes('java') && !l.includes('script')) return 'java';
  if (l.includes('javascript') || l.includes('js')) return 'js';
  if (l.includes('typescript') || l.includes('ts')) return 'ts';
  if (l.includes('c#')) return 'cs';
  if (l.includes('go')) return 'go';
  return 'txt';
}