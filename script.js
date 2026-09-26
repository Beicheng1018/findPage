(() => {
  "use strict";

  const input = document.querySelector("#word-input");
  const form = document.querySelector("#search-form");
  const clearButton = document.querySelector("#clear-button");
  const statusMessage = document.querySelector("#status-message");
  const suggestionList = document.querySelector("#suggestion-list");
  const result = document.querySelector("#result");
  const wordIndex = new Map();
  let isLoaded = false;

  function normalizeWord(value) {
    return value.trim().toLocaleLowerCase();
  }

  // 逐行容错解析：无效行会被跳过，不影响其他单词。
  function parseIndex(text) {
    text.split(/\r?\n/).forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length !== 2) return;

      const [word, pageText] = parts;
      const page = Number(pageText);
      if (!word || !Number.isSafeInteger(page) || page <= 0) return;

      wordIndex.set(normalizeWord(word), { word, page });
    });
  }

  function clearSuggestions() {
    suggestionList.replaceChildren();
  }

  function clearResult() {
    result.hidden = true;
    result.className = "result";
    result.replaceChildren();
  }

  function showResult(entry) {
    result.className = "result";
    result.hidden = false;
    result.replaceChildren();

    const word = document.createElement("span");
    word.className = "result-word";
    word.textContent = entry.word;
    const page = document.createElement("span");
    page.className = "result-page";
    page.textContent = `第 ${entry.page} 页`;
    result.append(word, page);
  }

  function showNotFound() {
    result.className = "result not-found";
    result.hidden = false;
    result.textContent = "未在单词书中找到该单词";
  }

  function renderSuggestions(query) {
    clearSuggestions();
    if (!query) return;

    const matches = [...wordIndex.entries()]
      .filter(([key]) => key.includes(query))
      .sort(([first], [second]) => {
        const firstStarts = first.startsWith(query);
        const secondStarts = second.startsWith(query);
        if (firstStarts !== secondStarts) return firstStarts ? -1 : 1;
        return first.localeCompare(second);
      })
      .slice(0, 8);

    matches.forEach(([, entry]) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "suggestion-button";
      button.textContent = entry.word;
      button.addEventListener("click", () => {
        input.value = entry.word;
        clearButton.hidden = false;
        clearSuggestions();
        showResult(entry);
        input.focus();
      });
      item.append(button);
      suggestionList.append(item);
    });
  }

  function search() {
    const query = normalizeWord(input.value);
    clearButton.hidden = query.length === 0;
    clearSuggestions();

    if (!query) {
      clearResult();
      return;
    }

    const entry = wordIndex.get(query);
    if (entry) {
      showResult(entry);
    } else {
      showNotFound();
    }
  }

  function handleInput() {
    if (!isLoaded) return;
    const query = normalizeWord(input.value);
    clearButton.hidden = query.length === 0;

    if (!query) {
      clearResult();
      clearSuggestions();
      return;
    }

    const exactMatch = wordIndex.get(query);
    if (exactMatch) {
      clearSuggestions();
      showResult(exactMatch);
    } else {
      showNotFound();
      renderSuggestions(query);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isLoaded) search();
  });

  input.addEventListener("input", handleInput);
  clearButton.addEventListener("click", () => {
    input.value = "";
    clearButton.hidden = true;
    clearResult();
    clearSuggestions();
    input.focus();
  });

  async function loadIndex() {
    try {
      const response = await fetch("./index.txt");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      parseIndex(await response.text());
      isLoaded = true;
      statusMessage.textContent = "";
      statusMessage.classList.remove("is-error");
      input.disabled = false;
      input.focus();
    } catch (error) {
      console.error("无法加载单词索引：", error);
      statusMessage.textContent = "单词索引加载失败，请检查 index.txt";
      statusMessage.classList.add("is-error");
      input.disabled = true;
      clearButton.hidden = true;
    }
  }

  input.disabled = true;
  loadIndex();
})();
