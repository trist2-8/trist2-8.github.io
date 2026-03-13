const storageKeys = {
  vocab: "english_b2_hub_vocab",
  grammar: "english_b2_hub_grammar",
  speaking: "english_b2_hub_speaking",
  habits: "english_b2_hub_habits"
};

const grammarItems = [
  "Present perfect vs past simple",
  "Future forms: will / going to / present continuous",
  "Modal verbs: advice, obligation, deduction",
  "Conditionals 0–3 + mixed",
  "Passive voice",
  "Reported speech",
  "Relative clauses",
  "Articles and quantifiers",
  "Gerunds and infinitives",
  "Linking words for contrast / result / opinion"
];

const speakingItems = [
  "Tôi có mở bài rõ ràng không?",
  "Tôi có dùng ví dụ cụ thể không?",
  "Tôi có dùng linking words không?",
  "Tôi có nói đủ 60–90 giây không?",
  "Tôi có ít nhất 1 từ/cụm từ hay không?",
  "Tôi có nghe lại và sửa 3 lỗi lớn nhất không?"
];

const habitItems = [
  "Học 50+ từ/collocations trong tuần",
  "Ôn ít nhất 3 chủ điểm grammar",
  "Nghe 4 bài có transcript",
  "Nghe 2 bài không transcript ngay từ đầu",
  "Đọc 3 bài và tóm tắt lại",
  "Nói 4 buổi có ghi âm",
  "Viết ít nhất 1 đoạn / 1 bài ngắn",
  "Làm 1 bài test hoặc sample task"
];

const prompts = [
  "Describe a skill you want to improve this year. Why is it important and how will you improve it?",
  "Do you think online learning is better than classroom learning? Give reasons and examples.",
  "Talk about a memorable trip or place you visited. What made it special?",
  "What are the advantages and disadvantages of using social media every day?",
  "Describe a problem students often face when learning English and suggest two solutions.",
  "Do you prefer working alone or in a team? Explain your opinion with examples.",
  "What makes a good teacher? Talk about qualities, examples and your own experience.",
  "How can young people use technology in a productive way instead of wasting time?"
];

function getSaved(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    return fallback;
  }
}

function setSaved(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function renderCheckboxList(containerId, items, storageKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const saved = getSaved(storageKey, Array(items.length).fill(false));
  container.innerHTML = items.map((item, index) => `
    <div class="check-item">
      <input type="checkbox" data-key="${storageKey}" data-index="${index}" ${saved[index] ? "checked" : ""} />
      <label>${item}</label>
    </div>
  `).join("");

  container.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const current = getSaved(storageKey, Array(items.length).fill(false));
      current[Number(checkbox.dataset.index)] = checkbox.checked;
      setSaved(storageKey, current);
      if (storageKey === storageKeys.habits) updateProgress();
    });
  });
}

function updateProgress() {
  const textEl = document.getElementById("progressText");
  const barEl = document.getElementById("progressBar");
  if (!textEl || !barEl) return;
  const data = getSaved(storageKeys.habits, Array(habitItems.length).fill(false));
  const done = data.filter(Boolean).length;
  const percent = Math.round((done / habitItems.length) * 100);
  textEl.textContent = `${done} / ${habitItems.length} thói quen hoàn thành`;
  barEl.style.width = `${percent}%`;
}

function renderVocabList() {
  const container = document.getElementById("vocabList");
  if (!container) return;
  const list = getSaved(storageKeys.vocab, []);
  if (!list.length) {
    container.innerHTML = `<div class="note">Chưa có từ nào được lưu. Hãy thêm những từ bạn gặp trong lúc nghe, đọc hoặc speaking.</div>`;
    return;
  }

  container.innerHTML = list.map((item, index) => `
    <div class="vocab-item">
      <div>
        <strong>${item.word}</strong>
        <div class="small-muted">${item.meaning}</div>
        ${item.example ? `<p style="margin-top: 8px; color: var(--muted);">${item.example}</p>` : ""}
      </div>
      <button class="icon-btn" data-remove-index="${index}" title="Xóa">✕</button>
    </div>
  `).join("");

  container.querySelectorAll("[data-remove-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.removeIndex);
      const current = getSaved(storageKeys.vocab, []);
      current.splice(index, 1);
      setSaved(storageKeys.vocab, current);
      renderVocabList();
    });
  });
}

function initVocabForm() {
  const saveBtn = document.getElementById("saveWordBtn");
  if (!saveBtn) return;
  saveBtn.addEventListener("click", () => {
    const wordInput = document.getElementById("wordInput");
    const meaningInput = document.getElementById("meaningInput");
    const exampleInput = document.getElementById("exampleInput");
    const word = wordInput.value.trim();
    const meaning = meaningInput.value.trim();
    const example = exampleInput.value.trim();

    if (!word || !meaning) {
      alert("Hãy nhập ít nhất từ/cụm từ và nghĩa.");
      return;
    }

    const current = getSaved(storageKeys.vocab, []);
    current.unshift({ word, meaning, example });
    setSaved(storageKeys.vocab, current);
    wordInput.value = "";
    meaningInput.value = "";
    exampleInput.value = "";
    renderVocabList();
  });
}

function initPrompts() {
  const promptBox = document.getElementById("promptBox");
  if (!promptBox) return;
  const renderPrompt = () => {
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    promptBox.textContent = random;
  };
  renderPrompt();
  const btn = document.getElementById("newPromptBtn");
  if (btn) btn.addEventListener("click", renderPrompt);
}

function initTabs() {
  const tabs = document.querySelectorAll(".skill-tab");
  const panels = document.querySelectorAll(".resource-panel");
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderCheckboxList("grammarChecklist", grammarItems, storageKeys.grammar);
  renderCheckboxList("speakingChecklist", speakingItems, storageKeys.speaking);
  renderCheckboxList("habitChecklist", habitItems, storageKeys.habits);
  renderVocabList();
  initVocabForm();
  initPrompts();
  updateProgress();
});
