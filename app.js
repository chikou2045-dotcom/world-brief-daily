const CATEGORY_ORDER = ["全部", "经济", "科技", "生活", "欧美热点", "中国热点", "日本热点"];
const archive = Array.isArray(window.BRIEF_ARCHIVE) ? window.BRIEF_ARCHIVE : [];
let brief = window.DAILY_BRIEF || {};
let stories = [];
let watchItems = [];
let activeCategory = "全部";

const issueDate = document.querySelector("#issue-date");
const updateTime = document.querySelector("#update-time");
const overview = document.querySelector("#overview");
const filters = document.querySelector("#filters");
const storyGrid = document.querySelector("#story-grid");
const watchList = document.querySelector("#watch-list");
const issueSelect = document.querySelector("#issue-select");
const loadStatus = document.querySelector("#load-status");

function setBrief(nextBrief) {
  brief = nextBrief || {};
  stories = Array.isArray(brief.stories) ? brief.stories : [];
  watchItems = Array.isArray(brief.watch) ? brief.watch : [];

  issueDate.textContent = brief.issueDate || "等待更新";
  updateTime.textContent = brief.updatedAt ? `更新于 ${brief.updatedAt}` : "每日 08:00 更新";
  overview.textContent =
    brief.overview || "首期晨报将在下一次自动化运行后生成。站点已经准备就绪。";

  renderFilters();
  renderStories();
  renderWatchItems();
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderStories() {
  const visibleStories =
    activeCategory === "全部"
      ? stories
      : stories.filter((story) => story.category === activeCategory);

  storyGrid.replaceChildren();

  if (!visibleStories.length) {
    storyGrid.append(
      createElement(
        "p",
        "empty-state",
        stories.length ? "这个板块今天没有入选新闻。" : "首期晨报将在下一次自动化运行后生成。",
      ),
    );
    return;
  }

  visibleStories.forEach((story, index) => {
    const card = createElement("article", "story-card");
    card.append(createElement("span", "story-number", String(index + 1).padStart(2, "0")));
    card.append(createElement("span", "tag", story.category || "生活"));
    card.append(createElement("h3", "", story.title));
    card.append(createElement("p", "story-summary", story.summary));

    const why = createElement("p", "story-why");
    const whyLabel = createElement("strong", "", "关注理由：");
    why.append(whyLabel, document.createTextNode(story.whyItMatters || "值得持续关注。"));
    card.append(why);

    const meta = createElement("div", "story-meta");
    const source = createElement("span", "", `${story.source || "来源待补充"} · ${story.date || ""}`);
    const link = createElement("a", "story-link", "查看原文");
    link.href = story.url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    meta.append(source, link);
    card.append(meta);
    storyGrid.append(card);
  });
}

function renderFilters() {
  filters.replaceChildren();
  CATEGORY_ORDER.forEach((category) => {
    const button = createElement("button", "filter-button", category);
    button.type = "button";
    if (category === activeCategory) button.classList.add("active");
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderStories();
    });
    filters.append(button);
  });
}

function renderWatchItems() {
  watchList.replaceChildren();
  if (!watchItems.length) {
    watchList.append(createElement("p", "empty-state", "今日关注主题将在晨报更新后显示。"));
  } else {
    watchItems.forEach((item) => watchList.append(createElement("div", "watch-item", item)));
  }
}

function loadArchivedBrief(file) {
  loadStatus.textContent = "正在加载所选日期...";
  const script = document.createElement("script");
  script.src = `${file}?v=${Date.now()}`;
  script.onload = () => {
    activeCategory = "全部";
    setBrief(window.DAILY_BRIEF);
    loadStatus.textContent = "";
  };
  script.onerror = () => {
    loadStatus.textContent = "该日期内容暂时无法加载，请稍后重试。";
  };
  document.body.append(script);
}

archive.forEach((entry) => {
  const option = createElement("option", "", entry.label || entry.date);
  option.value = entry.file;
  issueSelect.append(option);
});

issueSelect.addEventListener("change", () => loadArchivedBrief(issueSelect.value));
setBrief(brief);
