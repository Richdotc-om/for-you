// Find the No button on the page using its id
const noBtn = document.getElementById("no-btn");

let placeholder = null;
let hasMoved = false;

function moveNoButton(cursorX, cursorY) {
  // The first time it moves, we prepare it
  if (!hasMoved) {
    const rect = noBtn.getBoundingClientRect();

    // Leave an invisible box of the same size where the button was,
    // so the Yes button doesn't slide to the middle
    placeholder = document.createElement("div");
    placeholder.style.width = rect.width + "px";
    placeholder.style.height = rect.height + "px";
    noBtn.parentNode.insertBefore(placeholder, noBtn);

    // Let the button float freely over the page, starting where it is now
    noBtn.style.position = "fixed";
    noBtn.style.left = rect.left + "px";
    noBtn.style.top = rect.top + "px";
    noBtn.style.zIndex = "1000";
    noBtn.offsetWidth; // forces the browser to register the start position
    noBtn.style.transition = "left 0.25s ease, top 0.25s ease";
    hasMoved = true;
  }

  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const margin = 10;
  const maxX = window.innerWidth - w - margin;
  const maxY = window.innerHeight - h - margin;

  // Pick random spots until one is far enough from the cursor
  let x, y, tries = 0;
  do {
    x = margin + Math.random() * (maxX - margin);
    y = margin + Math.random() * (maxY - margin);
    tries++;
  } while (
    tries < 30 &&
    Math.hypot(x + w / 2 - cursorX, y + h / 2 - cursorY) < 150
  );

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

// Computer: run away when the cursor gets close
document.addEventListener("mousemove", function (e) {
  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  if (Math.hypot(e.clientX - centerX, e.clientY - centerY) < 100) {
    moveNoButton(e.clientX, e.clientY);
  }
});

// Phone: run away when she taps it
noBtn.addEventListener(
  "touchstart",
  function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    moveNoButton(touch.clientX, touch.clientY);
  },
  { passive: false }
);

// Backup: if a click somehow lands on it, it still runs away
noBtn.addEventListener("click", function (e) {
  e.preventDefault();
  moveNoButton(e.clientX, e.clientY);
});
