let isSyncing = false;

const observer = new MutationObserver(() => {
  const statusElement = document.querySelector('[data-e2e-locator="submission-result"]');
  if (statusElement && statusElement.innerText.includes('Accepted') && !isSyncing) {
    isSyncing = true;
    showToast('Accepted submission detected! Syncing with GitHub...', '#ffa116');
    extractAndSync();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

async function extractAndSync() {
  try {
    const titleElem = document.querySelector('.text-title-large a, [data-cy="question-title"]');
    const titleText = titleElem ? titleElem.innerText : "Problem";
    const titleMatch = titleText.match(/^(\d+)\.\s*(.*)$/) || [null, "0000", titleText];
    const problemId = titleMatch[1];
    const problemTitle = titleMatch[2];

    const runtimeElem = document.querySelector('.font-semibold.text-sd-text-primary') || { innerText: 'N/A' };
    const memoryElem = document.querySelectorAll('.font-semibold.text-sd-text-primary')[1] || { innerText: 'N/A' };

    const codeContainer = document.querySelector('.monaco-editor') || document.querySelector('textarea');
    let rawCode = "";
    if (window.monaco && window.monaco.editor) {
      const models = window.monaco.editor.getModels();
      if (models.length > 0) rawCode = models[0].getValue();
    } else if (codeContainer) {
      rawCode = codeContainer.innerText || codeContainer.value;
    }

    const descElem = document.querySelector('[data-track-load="description_content"]');
    const description = descElem ? descElem.innerText : "Description unavailable.";

    const langElem = document.querySelector('#editor-language-select button') || { innerText: 'cpp' };

    const payload = {
      id: problemId,
      title: problemTitle,
      language: langElem.innerText,
      code: rawCode,
      runtime: runtimeElem.innerText,
      memory: memoryElem.innerText,
      description: description
    };

    chrome.runtime.sendMessage({ action: "SYNC_SUBMISSION", data: payload }, (res) => {
      if (res && res.success) {
        showToast('Successfully pushed solution to GitHub!', '#2ea043');
      } else {
        showToast(`Sync Failed: ${res ? res.message : 'Unknown Error'}`, '#f85149');
      }
      setTimeout(() => { isSyncing = false; }, 10000);
    });

  } catch (err) {
    showToast('Error parsing LeetCode page', '#f85149');
    isSyncing = false;
  }
}

function showToast(text, bgColor) {
  const id = 'leetsync-toast';
  let toast = document.getElementById(id);
  if (!toast) {
    toast = document.createElement('div');
    toast.id = id;
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 999999;
      padding: 12px 18px; border-radius: 8px; color: white;
      font-weight: bold; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.style.backgroundColor = bgColor;
  toast.innerText = text;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 4000);
}