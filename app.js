const DAILY_LIMIT = 3;
const STORAGE_KEY = "zeus_lite_usage_v3";
const isAdmin = window.location.search.includes("admin");

const ANALYSIS_STEPS = [
  "Analyzing most searched products",
  "Analyzing top clicked items",
  "Evaluating best ad angles",
  "Estimating profit per sale",
  "Analyzing buyer likelihood"
];

const ZEUS_LITE_PRODUCTS = [
  {
    product: "Smart Pet Feeder with Camera",
    profit: "$20–$40",
    trending: "Remote pet monitoring demand continues to rise.",
    angle: "Peace of mind for busy pet owners.",
    likelihood: "75–85%"
  },
  {
    product: "Compact Home Air Quality Monitor",
    profit: "$18–$30",
    trending: "Health-focused consumers care more about indoor air.",
    angle: "Quick way to see if your space is actually healthy.",
    likelihood: "70–82%"
  },
  {
    product: "Automatic Plant Watering System",
    profit: "$22–$35",
    trending: "Urban plant owners want low-effort care solutions.",
    angle: "Set-and-forget backup for people who forget to water.",
    likelihood: "72–84%"
  }
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadUsage() {
  if (isAdmin) return { date: getToday(), used: 0 };

  const raw = localStorage.getItem(STORAGE_KEY);
  const today = getToday();

  if (!raw) return { date: today, used: 0 };

  try {
    const data = JSON.parse(raw);
    if (data.date !== today) return { date: today, used: 0 };
    if (typeof data.used !== "number") return { date: today, used: 0 };
    return data;
  } catch {
    return { date: today, used: 0 };
  }
}

function saveUsage(usage) {
  if (!isAdmin) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generateBtn");
  const output = document.getElementById("output");
  const counter = document.getElementById("counter");
  const modeLabel = document.getElementById("modeLabel");
  const statusNote = document.getElementById("statusNote");

  if (!btn || !output || !counter || !modeLabel || !statusNote) return;

  let usage = loadUsage();
  let index = usage.used;

  updateUI();

  btn.addEventListener("click", async () => {
    if (!isAdmin && usage.used >= DAILY_LIMIT) return;

    btn.disabled = true;
    let stepIndex = 0;
    output.textContent = ANALYSIS_STEPS[stepIndex];

    const loop = setInterval(() => {
      stepIndex = (stepIndex + 1) % ANALYSIS_STEPS.length;
      output.textContent = ANALYSIS_STEPS[stepIndex];
    }, 1500);

    const delay = Math.floor(Math.random() * 2000) + 6000;
    await wait(delay);
    clearInterval(loop);

    const product = ZEUS_LITE_PRODUCTS[index % ZEUS_LITE_PRODUCTS.length];

    output.textContent =
      "Product: " + product.product + "\n" +
      "Profit per sale: " + product.profit + "\n" +
      "Why it’s trending: " + product.trending + "\n" +
      "Best marketing angle: " + product.angle + "\n" +
      "Likelihood to purchase: " + product.likelihood;

    if (!isAdmin) {
      usage.used += 1;
      usage.date = getToday();
      saveUsage(usage);
    }

    index += 1;
    updateUI();
  });

  function updateUI() {
    if (isAdmin) {
      modeLabel.textContent = "Admin mode";
      counter.textContent = "Unlimited generations on this device";
      statusNote.textContent = "Demo view. Daily limits are disabled.";
      btn.disabled = false;
      btn.textContent = "Generate product";
      return;
    }

    const remaining = DAILY_LIMIT - usage.used;
    modeLabel.textContent = "Zeus Lite";
    counter.textContent = "Generations remaining today: " + remaining + " / " + DAILY_LIMIT;

    if (remaining <= 0) {
      btn.disabled = true;
      btn.textContent = "Daily limit reached";
    } else {
      btn.disabled = false;
      btn.textContent = "Generate product";
    }
  }
});

