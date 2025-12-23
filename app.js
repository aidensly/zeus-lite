const DAILY_LIMIT = 3;

const ZEUS_LITE_PRODUCTS = [
  {
    product: "Smart Pet Feeder with Camera",
    profit: "$20–$40",
    trending: "Increased pet ownership has driven demand for smart pet monitoring solutions.",
    angle: "Appeals to busy pet owners who want peace of mind while away from home.",
    likelihood: "75–85%",
  },
  {
    product: "Compact Home Air Quality Monitor",
    profit: "$18–$30",
    trending: "Consumers are becoming more health-conscious about indoor air conditions.",
    angle: "Market as a simple way to track and improve home air quality without guesswork.",
    likelihood: "70–82%",
  },
  {
    product: "Automatic Plant Watering System",
    profit: "$22–$35",
    trending: "Urban plant owners want low-effort solutions to keep plants alive.",
    angle: "Position as a set-and-forget tool for people who forget to water plants.",
    likelihood: "72–84%",
  },
];

function getToday() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function loadUsage() {
  const raw = localStorage.getItem("zeus_lite_usage");
  const today = getToday();

  if (!raw) {
    return { date: today, used: 0 };
  }

  try {
    const data = JSON.parse(raw);
    if (data.date !== today) {
      return { date: today, used: 0 };
    }
    return data;
  } catch {
    return { date: today, used: 0 };
  }
}

function saveUsage(usage) {
  localStorage.setItem("zeus_lite_usage", JSON.stringify(usage));
}

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("generateBtn");
  const output = document.getElementById("output");
  const counter = document.getElementById("counter");

  if (!btn || !output || !counter) {
    alert("Zeus Lite error: page elements not found");
    return;
  }

  let usage = loadUsage();
  let index = usage.used;

  updateUI();

  btn.addEventListener("click", function () {
    if (usage.used >= DAILY_LIMIT) {
      return;
    }

    const product =
      ZEUS_LITE_PRODUCTS[index] ||
      ZEUS_LITE_PRODUCTS[ZEUS_LITE_PRODUCTS.length - 1];

    output.textContent =
      "Product: " + product.product + "\n" +
      "Profit per sale: " + product.profit + "\n" +
      "Why it’s trending: " + product.trending + "\n" +
      "Best marketing angle: " + product.angle + "\n" +
      "Likelihood to purchase: " + product.likelihood;

    usage.used += 1;
    usage.date = getToday();
    saveUsage(usage);
    index += 1;

    updateUI();
  });

  function updateUI() {
    const remaining = DAILY_LIMIT - usage.used;
    counter.textContent =
      "Generations remaining today: " + remaining + " / " + DAILY_LIMIT;

    if (remaining <= 0) {
      btn.disabled = true;
      btn.textContent = "Daily limit reached";
    }
  }
});

