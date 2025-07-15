
/*
// Helper to fetch via background script
function fetchPollinations(url) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'fetch-pollinations', url },
      response => {
        if (response && response.data) resolve(response.data);
        else reject(response.error || 'Unknown error');
      }
    );
  });
}

// Utility: Pollinations API call for sentiment
async function getSentiment(text) {
  const prompt = encodeURIComponent(`Is the following text negative, positive, or neutral? Strictly reply with one word: negative, positive, or neutral. Text: ${text}`);
  const url = `https://text.pollinations.ai/${prompt}`;
  return (await fetchPollinations(url)).trim().toLowerCase();
}

// Utility: Pollinations API call for positive rewrite (body)
async function getPositiveRewrite(text) {
  const prompt = encodeURIComponent(
    `Rewrite the following text to be more positive, keeping the meaning and information the same. Only return the rewritten text, with no extra commentary, no introduction, and do not include the original text. Text: ${text}`
  );
  const url = `https://text.pollinations.ai/${prompt}`;
  return (await fetchPollinations(url)).trim();
}

// Utility: Pollinations API call for positive rewrite (title)
async function getPositiveTitleRewrite(text) {
  const prompt = encodeURIComponent(
    `Rewrite the following title to be more positive, keeping the meaning and information the same. Only return the rewritten title, with no extra commentary, no introduction, and do not include the original title. Title: ${text}`
  );
  const url = `https://text.pollinations.ai/${prompt}`;
  return (await fetchPollinations(url)).trim();
}

// Helper: Wait for element
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;
    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      elapsed += interval;
      if (elapsed >= timeout) return reject();
      setTimeout(check, interval);
    };
    check();
  });
}

// Main: Detect post open (modal or page)
function observePostOpen() {
  // For modal posts
  const modalObserver = new MutationObserver(() => {
    const modal = document.querySelector('[role="dialog"]');
    if (modal && modal.querySelector('h1, h2')) {
      processPost(modal);
    }
  });
  modalObserver.observe(document.body, { childList: true, subtree: true });

  // For page posts
  if (window.location.pathname.match(/^\/r\/.+\/comments\//)) {
    processPost(document);
  }

  // Listen for navigation (Reddit is SPA)
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      if (location.pathname.match(/^\/r\/.+\/comments\//)) {
        setTimeout(() => processPost(document), 1000);
      }
    }
  }, 800);
}

async function processPost(root) {
  // Title: h1 or h2 (modal/page)
  const titleEl = root.querySelector('h1, h2');
  const titleText = titleEl ? titleEl.innerText : '';
  if (!titleEl || !titleText) {
    console.log("no title detected");
  }

  // Body: shreddit-post (custom element)
  const postEl = root.querySelector('shreddit-post');
  let bodyText = '';
  let bodyNode = null;
  if (postEl) {
    // Try to find the first <p> or <div> with a decent amount of text
    const candidates = postEl.querySelectorAll('p, div');
    for (const el of candidates) {
      const text = el.innerText?.trim();
      if (text && text.length > 40) { // Adjust threshold as needed
        bodyText = text;
        bodyNode = el;
        break;
      }
    }
    // If not found, try shadowRoot
    if (!bodyText && postEl.shadowRoot) {
      const shadowCandidates = postEl.shadowRoot.querySelectorAll('p, div');
      for (const el of shadowCandidates) {
        const text = el.innerText?.trim();
        if (text && text.length > 40) {
          bodyText = text;
          bodyNode = el;
          break;
        }
      }
    }
  } else {
    console.log('No shreddit-post found');
  }

  // Avoid reprocessing
  if (titleEl) titleEl.dataset.positiveChecked = 'true';
  if (postEl) postEl.dataset.positiveChecked = 'true';

  // Title sentiment and rewrite
  if (titleEl && !titleEl.dataset.positiveProcessed && titleText) {
    const sentiment = await getSentiment(titleText);
    if (sentiment === 'negative') {
      console.log('Negative Title Detected, title is ', titleText);
      const positiveTitle = await getPositiveTitleRewrite(titleText);
      titleEl.innerText = positiveTitle;
    } else if (sentiment === 'positive') {
      console.log('Positive Title Detected');
    } else {
      console.log(sentiment, 'Title Detected');
    }
    titleEl.dataset.positiveProcessed = 'true';
    console.log('Done Title');
  } else {
    console.log("no title detected")
  }

  // Body sentiment and rewrite
  if (postEl && !postEl.dataset.positiveProcessed && bodyText && bodyNode) {
    console.log("body text of post for sentiment analysis is", bodyText)
    const sentiment = await getSentiment(bodyText);
    if (sentiment === 'negative') {
      console.log('Negative Body Detected');
      console.log('before post text: ', bodyText);
      const positiveBody = await getPositiveRewrite(bodyText);
      console.log('updated post text: ', positiveBody);
      // Replace only the main post content node's text
      bodyNode.innerText = positiveBody;
    } else if (sentiment === 'positive') {
      console.log('Positive Body Detected');
    } else {
      console.log(sentiment, 'Body Detected');
    }
    postEl.dataset.positiveProcessed = 'true';
    console.log('Done Body');
  } else {
    console.log('No body to process or already processed');
  }
}

// Start observing
observePostOpen();
*/


// test console.log

/*

// Helper to fetch via background script
function fetchPollinations(url) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'fetch-pollinations', url },
      response => {
        if (response && response.data) resolve(response.data);
        else reject(response.error || 'Unknown error');
      }
    );
  });
}

// Utility: Sentiment detection
async function getSentiment(text) {
  const prompt = encodeURIComponent(`Is the following text negative, positive, or neutral? Strictly reply with one word: negative, positive, or neutral. Text: ${text}`);
  const url = `https://text.pollinations.ai/${prompt}`;
  return (await fetchPollinations(url)).trim().toLowerCase();
}

// Utility: Rewrite body positively
async function getPositiveRewrite(text) {
  const prompt = encodeURIComponent(
    `Rewrite the following text to be more positive, keeping the meaning and information the same. Only return the rewritten text, with no extra commentary, no introduction, and do not include the original text. Text: ${text}`
  );
  const url = `https://text.pollinations.ai/${prompt}`;
  return (await fetchPollinations(url)).trim();
}

// Utility: Rewrite title positively
async function getPositiveTitleRewrite(text) {
  const prompt = encodeURIComponent(
    `Rewrite the following title to be more positive, keeping the meaning and information the same. Only return the rewritten title, with no extra commentary, no introduction, and do not include the original title. Title: ${text}`
  );
  const url = `https://text.pollinations.ai/${prompt}`;
  return (await fetchPollinations(url)).trim();
}

// Observe when Reddit opens a post (modal or page)
function observePostOpen() {
  // For modal posts
  const modalObserver = new MutationObserver(() => {
    const modal = document.querySelector('[role="dialog"]');
    if (modal && modal.querySelector('h1, h2')) {
      processPost(modal);
    }
  });
  modalObserver.observe(document.body, { childList: true, subtree: true });

  // For full-page posts
  if (window.location.pathname.match(/^\/r\/.+\/comments\//)) {
    processPost(document);
  }

  // Handle SPA navigation changes
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      if (location.pathname.match(/^\/r\/.+\/comments\//)) {
        setTimeout(() => processPost(document), 1000);
      }
    }
  }, 800);
}

async function processPost(root) {
  console.log('⏩ processPost called');
  console.log('⏩ Current URL:', location.href);
  console.log('⏩ Root node:', root);

  // TITLE
  const titleEl = root.querySelector('h1, h2');
  const titleText = titleEl?.innerText ?? '';
  if (!titleText) console.warn('⚠️ No title text found');
  else console.log('✅ Title detected:', titleText);

  // BODY
  const postEl = root.querySelector('shreddit-post');
  let bodyText = '';
  let bodyNode = null;

  if (!postEl) {
    console.warn('❌ <shreddit-post> NOT found. HTML preview:', root.innerHTML.slice(0, 300));
    return;
  }

  console.log('✅ <shreddit-post> found:', postEl);

  const lightCandidates = postEl.querySelectorAll('p, div');
  console.log(`🔍 Light DOM candidates: ${lightCandidates.length}`);
  logCandidates(lightCandidates, 'L');

  for (const el of lightCandidates) {
    const text = el.innerText.trim();
    if (text.length > 40) {
      bodyText = text;
      bodyNode = el;
      break;
    }
  }

  if (!bodyText && postEl.shadowRoot) {
    const shadowCandidates = postEl.shadowRoot.querySelectorAll('p, div');
    console.log(`🔍 Shadow DOM candidates: ${shadowCandidates.length}`);
    logCandidates(shadowCandidates, 'S');

    for (const el of shadowCandidates) {
      const text = el.innerText.trim();
      if (text.length > 40) {
        bodyText = text;
        bodyNode = el;
        break;
      }
    }
  }

  if (!bodyText) {
    console.error('🚫 No post body text >40 chars found.');
    console.dir(postEl);
    if (postEl.shadowRoot) console.dir(postEl.shadowRoot);
    return;
  }

  console.log(`✅ Body text selected (length ${bodyText.length}):`, bodyText.slice(0, 100));

  // Prevent reprocessing
  if (titleEl) titleEl.dataset.positiveChecked = 'true';
  if (postEl) postEl.dataset.positiveChecked = 'true';

  // TITLE SENTIMENT & REWRITE
  if (titleEl && !titleEl.dataset.positiveProcessed && titleText) {
    const sentiment = await getSentiment(titleText);
    if (sentiment === 'negative') {
      console.log('🟥 Negative Title Detected:', titleText);
      const positiveTitle = await getPositiveTitleRewrite(titleText);
      titleEl.innerText = positiveTitle;
      console.log('✅ Rewritten Title:', positiveTitle);
    } else {
      console.log(`🟩 ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Title`);
    }
    titleEl.dataset.positiveProcessed = 'true';
    console.log('✅ Title processing complete');
  }

  // BODY SENTIMENT & REWRITE
  if (postEl && !postEl.dataset.positiveProcessed && bodyText && bodyNode) {
    console.log('🔍 Original Body Text:', bodyText);
    const sentiment = await getSentiment(bodyText);
    if (sentiment === 'negative') {
      console.log('🟥 Negative Body Detected');
      const positiveBody = await getPositiveRewrite(bodyText);
      console.log('✅ Rewritten Body Text:', positiveBody);
      bodyNode.innerText = positiveBody;
    } else {
      console.log(`🟩 ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Body`);
    }
    postEl.dataset.positiveProcessed = 'true';
    console.log('✅ Body processing complete');
  } else {
    console.log('ℹ️ No body to process or already processed');
  }
}

// Helper: Log candidate elements
function logCandidates(nodes, label) {
  [...nodes].forEach((n, i) => {
    const snippet = n.innerText?.trim().replace(/\s+/g, ' ').slice(0, 60) + '…';
    console.log(`${label}[${i}] length=${n.innerText.length} → "${snippet}"`);
  });
}

// Start observing Reddit posts
observePostOpen();

*/

// ─────────────────────────────────────────────────────────────
// Helper: Fetch via background script
// ─────────────────────────────────────────────────────────────
function fetchPollinations(url) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'fetch-pollinations', url },
      response => {
        if (response && response.data) resolve(response.data);
        else reject(response.error || 'Unknown error');
      }
    );
  });
}

// ─────────────────────────────────────────────────────────────
// Utility: Sentiment & Rewrites
// ─────────────────────────────────────────────────────────────
async function getSentiment(text) {
  const prompt = encodeURIComponent(`Is the following text negative, positive, or neutral? Strictly reply with one word: negative, positive, or neutral. Text: ${text}`);
  const url = `https://text.pollinations.ai/${prompt}`;
  return (await fetchPollinations(url)).trim().toLowerCase();
}

async function getPositiveRewrite(text) {
  const prompt = encodeURIComponent(
    `Rewrite the following text to be more positive, keeping the meaning and information the same. Only return the rewritten text, with no extra commentary, no introduction, and do not include the original text. Text: ${text}`
  );
  const url = `https://text.pollinations.ai/${prompt}`;
  return (await fetchPollinations(url)).trim();
}

async function getPositiveTitleRewrite(text) {
  const prompt = encodeURIComponent(
    `Rewrite the following title to be more positive, keeping the meaning and information the same. Only return the rewritten title, with no extra commentary, no introduction, and do not include the original title. Title: ${text}`
  );
  const url = `https://text.pollinations.ai/${prompt}`;
  return (await fetchPollinations(url)).trim();
}

// ─────────────────────────────────────────────────────────────
// Helper: Extract Post Body Text
// ─────────────────────────────────────────────────────────────
function extractBody(postEl) {
  const ARTICLE_SEL = '[property="schema:articleBody"]';
  let node =
    postEl.shadowRoot?.querySelector(ARTICLE_SEL) ||
    postEl.querySelector(ARTICLE_SEL);

  if (node && node.innerText.trim()) {
    return { text: node.innerText.trim(), node };
  }

  node =
    postEl.shadowRoot?.querySelector('[slot="text-body"]') ||
    postEl.querySelector('[slot="text-body"]');

  if (node) {
    const paragraphs = node.querySelectorAll('p');
    const text = [...paragraphs]
      .map(p => p.innerText.trim())
      .filter(Boolean)
      .join('\n')
      .trim();

    if (text) {
      return { text, node: paragraphs[0] || node };
    }
  }

  const candidates = [
    ...postEl.querySelectorAll('p, div'),
    ...(postEl.shadowRoot ? postEl.shadowRoot.querySelectorAll('p, div') : [])
  ];

  let longest = '';
  let longestNode = null;

  for (const el of candidates) {
    const txt = el.innerText.trim();
    if (txt.length > longest.length) {
      longest = txt;
      longestNode = el;
    }
  }

  return { text: longest, node: longestNode };
}

// ─────────────────────────────────────────────────────────────
// Main Logic: Observe Reddit for Post Open
// ─────────────────────────────────────────────────────────────
function observePostOpen() {
  const modalObserver = new MutationObserver(() => {
    const modal = document.querySelector('[role="dialog"]');
    if (modal && modal.querySelector('h1, h2')) {
      processPost(modal);
    }
  });
  modalObserver.observe(document.body, { childList: true, subtree: true });

  if (window.location.pathname.match(/^\/r\/.+\/comments\//)) {
    processPost(document);
  }

  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      if (location.pathname.match(/^\/r\/.+\/comments\//)) {
        setTimeout(() => processPost(document), 1000);
      }
    }
  }, 800);
}

// ─────────────────────────────────────────────────────────────
// Process Single Reddit Post (modal or page)
// ─────────────────────────────────────────────────────────────
async function processPost(root) {
  console.log('⏩ processPost called');
  console.log('⏩ Current URL:', location.href);

  // Title
  const titleEl = root.querySelector('h1, h2');
  const titleText = titleEl?.innerText ?? '';
  if (!titleText) {
    console.warn('⚠️ No title text found');
  } else {
    console.log('✅ Title detected:', titleText);
  }

  const postEl = root.querySelector('shreddit-post');
  if (!postEl) {
    console.warn('❌ <shreddit-post> not found');
    return;
  }

  const { text: bodyText, node: bodyNode } = extractBody(postEl);

  if (!bodyText) {
    console.error('🚫 Could not extract body text');
    console.dir(postEl);
    if (postEl.shadowRoot) console.dir(postEl.shadowRoot);
    return;
  }

  console.log(
    `✅ Extracted body (len ${bodyText.length}):`,
    bodyText.slice(0, 120).replace(/\s+/g, ' ') + '…'
  );

  if (titleEl) titleEl.dataset.positiveChecked = 'true';
  if (postEl) postEl.dataset.positiveChecked = 'true';

  // Title Sentiment
  if (titleEl && !titleEl.dataset.positiveProcessed && titleText) {
    const sentiment = await getSentiment(titleText);
    if (sentiment === 'negative') {
      console.log('🟥 Negative Title Detected:', titleText);
      const positiveTitle = await getPositiveTitleRewrite(titleText);
      titleEl.innerText = positiveTitle;
      console.log('✅ Rewritten Title:', positiveTitle);
    } else {
      console.log(`🟩 ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Title`);
    }
    titleEl.dataset.positiveProcessed = 'true';
    console.log('✅ Title processing complete');
  }

  // Body Sentiment
  if (postEl && !postEl.dataset.positiveProcessed && bodyText && bodyNode) {
    console.log('🔍 Original Body Text:', bodyText);
    const sentiment = await getSentiment(bodyText);
    if (sentiment === 'negative') {
      console.log('🟥 Negative Body Detected');
      const positiveBody = await getPositiveRewrite(bodyText);
      console.log('✅ Rewritten Body Text:', positiveBody);
      bodyNode.innerText = positiveBody;
    } else {
      console.log(`🟩 ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Body`);
    }
    postEl.dataset.positiveProcessed = 'true';
    console.log('✅ Body processing complete');
  } else {
    console.log('ℹ️ No body to process or already processed');
  }
}

// ─────────────────────────────────────────────────────────────
// Start Script
// ─────────────────────────────────────────────────────────────
observePostOpen();

