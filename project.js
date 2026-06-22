const projects = {
  listing: {
    number: "01",
    type: "E-commerce Visuals",
    title: "Amazon Listing Design",
    description: "主图、卖点图、场景图、尺寸图、对比图和完整 Listing 图片系统。",
    media: "media/set-10/img-0943.webp",
    format: "Listing image suite",
    focus: "Product selling points",
    galleryTitle: "Listing projects",
    next: "aplus"
  },
  aplus: {
    number: "02",
    type: "Detail Page",
    title: "Amazon A+",
    description: "A+ 模块、品牌故事、产品利益点、对比模块和详情页视觉系统。",
    media: "media/set-10/img-0944.webp",
    format: "A+ content page",
    focus: "Brand story and modules",
    galleryTitle: "A+ content groups",
    next: "packaging"
  },
  packaging: {
    number: "03",
    type: "Product Presentation",
    title: "Packaging Design",
    description: "包装结构视觉、标签设计、产品盒型展示和电商包装 Mockup。",
    media: "media/set-10/img-0945.webp",
    format: "Packaging system",
    focus: "Shelf and e-commerce presence",
    galleryTitle: "Packaging assets",
    next: "identity"
  },
  identity: {
    number: "04",
    type: "Brand System",
    title: "Brand Identity / VI",
    description: "Logo 方向、色彩系统、字体规范、视觉语言和品牌应用。",
    media: "media/set-10/img-0946.webp",
    contain: true,
    format: "Brand identity",
    focus: "VI and visual language",
    galleryTitle: "Identity assets",
    next: "motion"
  },
  motion: {
    number: "05",
    type: "Motion & Render",
    title: "3D / C4D Motion",
    description: "3D 产品渲染、动态帧、发布视觉和 C4D 产品叙事场景。",
    media: "media/set-10/img-0947.webp",
    format: "3D render and motion",
    focus: "Product scenes",
    galleryTitle: "3D render assets",
    next: "ai"
  },
  ai: {
    number: "06",
    type: "Video Creation",
    title: "Product Videos / AI Video",
    description: "产品短片、AI 辅助视频概念、动态视觉和营销创意探索。",
    media: "media/set-10/video-005.mp4",
    video: true,
    format: "Product video and AI video",
    focus: "Motion storytelling",
    galleryTitle: "Product video assets",
    next: "listing"
  }
};

const params = new URLSearchParams(window.location.search);
const key = projects[params.get("case")] ? params.get("case") : "listing";
const project = projects[key];
const next = projects[project.next];
const manifest = window.PORTFOLIO_ASSETS || {};
const projectRoot = document.querySelector("[data-project-root]");

projectRoot.dataset.project = key;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function assetUrl(value) {
  return encodeURI(value).replaceAll("#", "%23").replaceAll("&", "%26");
}

function isVideo(value) {
  return /\.(mp4|webm|mov)$/i.test(value);
}

function mediaMarkup(item, extraClass = "") {
  const source = item.media || item;
  const url = assetUrl(source);

  if (item.video || isVideo(source)) {
    return `<video class="detail-media ${extraClass}" src="${url}" autoplay muted loop playsinline controls></video>`;
  }

  const contain = item.contain ? "detail-media-contain" : "";
  return `<img class="detail-media ${contain} ${extraClass}" src="${url}" alt="" loading="lazy" decoding="async" />`;
}

function assetTile(path, isFeatured = false) {
  const className = isFeatured ? "asset-tile asset-tile-featured" : "asset-tile";
  const media = isVideo(path)
    ? `<video src="${assetUrl(path)}" autoplay muted loop playsinline controls></video>`
    : `<img src="${assetUrl(path)}" alt="" loading="lazy" decoding="async" />`;

  return `<figure class="${className}">${media}</figure>`;
}

function aplusBaseName(path) {
  const file = path.split("/").pop();
  const withoutExt = file.replace(/\.[^.]+$/, "");
  return withoutExt.replace(/[a-z]$/i, "");
}

function renderAplusItem(item, index) {
  if (item.items.length === 1) {
    return `
      <figure class="aplus-module">
        <img src="${assetUrl(item.items[0])}" alt="" loading="${index < 2 ? "eager" : "lazy"}" decoding="async" />
      </figure>
    `;
  }

  const slides = item.items
    .map(
      (path, slideIndex) => `
        <img
          class="${slideIndex === 0 ? "is-active" : ""}"
          src="${assetUrl(path)}"
          alt=""
          loading="${index < 2 ? "eager" : "lazy"}"
          decoding="async"
        />
      `
    )
    .join("");

  return `
    <figure class="aplus-module aplus-carousel" data-carousel>
      <div class="aplus-carousel-stage">${slides}</div>
      <button class="aplus-arrow aplus-arrow-prev" type="button" aria-label="Previous variant">‹</button>
      <button class="aplus-arrow aplus-arrow-next" type="button" aria-label="Next variant">›</button>
    </figure>
  `;
}

function renderAplusGroup(group, groupIndex) {
  const buckets = new Map();

  (group.items || []).forEach((path) => {
    const base = aplusBaseName(path);
    if (!buckets.has(base)) {
      buckets.set(base, []);
    }
    buckets.get(base).push(path);
  });

  const modules = Array.from(buckets.entries()).map(([label, items]) => ({
    label,
    items
  }));

  return `
    <section class="asset-group aplus-group">
      <div class="asset-group-head">
        <span>${String(groupIndex + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(group.name)}</h3>
        <p>${group.items.length} assets</p>
      </div>
      <div class="aplus-stack">${modules.map(renderAplusItem).join("")}</div>
    </section>
  `;
}

function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".aplus-carousel-stage img"));
    const prev = carousel.querySelector(".aplus-arrow-prev");
    const nextButton = carousel.querySelector(".aplus-arrow-next");
    let current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === current));
    }

    prev?.addEventListener("click", () => show(current - 1));
    nextButton?.addEventListener("click", () => show(current + 1));

    if (slides.length > 1) {
      window.setInterval(() => show(current + 1), 3600);
    }
  });
}

function renderGallery(groups) {
  if (!groups || !groups.length) {
    return `<p class="empty-gallery">Assets for this project will be added soon.</p>`;
  }

  if (key === "aplus") {
    return groups.map(renderAplusGroup).join("");
  }

  return groups
    .map((group, groupIndex) => {
      const items = group.items || [];
      const visibleItems = items.map((item, itemIndex) => assetTile(item, groupIndex === 0 && itemIndex === 0)).join("");

      return `
        <section class="asset-group">
          <div class="asset-group-head">
            <span>${String(groupIndex + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(group.name)}</h3>
            <p>${items.length} assets</p>
          </div>
          <div class="asset-grid">${visibleItems}</div>
        </section>
      `;
    })
    .join("");
}

document.title = `${project.title} | Herman`;
document.querySelector("[data-project-number]").textContent = project.number;
document.querySelector("[data-project-type]").textContent = project.type;
document.querySelector("[data-project-title]").textContent = project.title;
document.querySelector("[data-project-description]").textContent = project.description;
document.querySelector("[data-gallery-title]").textContent = project.galleryTitle;
document.querySelector("[data-project-media]").innerHTML = mediaMarkup(project);
document.querySelector("[data-project-gallery]").innerHTML = renderGallery(manifest[key]);
initCarousels();

const nextLink = document.querySelector("[data-next-project]");
nextLink.href = `project.html?case=${project.next}`;
nextLink.querySelector("strong").textContent = next.title;
