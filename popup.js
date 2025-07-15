const lensIds = ['mage-lens', 'positive-lens', 'objective-lens', 'tldr-lens', 'funny-lens'];
const allOffId = 'all-off';
const mageOptionsKeys = ['mage-img-pos', 'mage-img-style', 'mage-img-size'];

function saveLenses(lenses, mageOptions) {
  chrome.storage.sync.set({ lenses, mageOptions });
}

function loadLenses() {
  chrome.storage.sync.get(['lenses', 'mageOptions'], (data) => {
    const lenses = data.lenses || {};
    lensIds.forEach(id => {
      document.getElementById(id).checked = !!lenses[id];
    });
    document.getElementById(allOffId).checked = !lensIds.some(id => lenses[id]);
    // Mage options
    const mageOptions = data.mageOptions || {};
    mageOptionsKeys.forEach(key => {
      if (mageOptions[key]) {
        document.getElementById(key).value = mageOptions[key];
      }
    });
    document.getElementById('mage-options').style.display = lenses['mage-lens'] ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadLenses();
  lensIds.forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      const lenses = {};
      lensIds.forEach(lid => {
        lenses[lid] = document.getElementById(lid).checked;
      });
      // If any lens is checked, uncheck All Off
      if (lensIds.some(lid => lenses[lid])) {
        document.getElementById(allOffId).checked = false;
      } else {
        document.getElementById(allOffId).checked = true;
      }
      // Show/hide mage options
      document.getElementById('mage-options').style.display = lenses['mage-lens'] ? '' : 'none';
      // Save mage options too
      const mageOptions = {};
      mageOptionsKeys.forEach(key => {
        mageOptions[key] = document.getElementById(key).value;
      });
      saveLenses(lenses, mageOptions);
    });
  });
  document.getElementById(allOffId).addEventListener('change', () => {
    if (document.getElementById(allOffId).checked) {
      lensIds.forEach(id => {
        document.getElementById(id).checked = false;
      });
      saveLenses({}, {});
      document.getElementById('mage-options').style.display = 'none';
    }
  });
  mageOptionsKeys.forEach(key => {
    document.getElementById(key).addEventListener('change', () => {
      chrome.storage.sync.get('lenses', (data) => {
        const lenses = data.lenses || {};
        const mageOptions = {};
        mageOptionsKeys.forEach(k => {
          mageOptions[k] = document.getElementById(k).value;
        });
        saveLenses(lenses, mageOptions);
      });
    });
  });
}); 