// === DROPZONE HANDLING ===
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
let selectedFiles = [];

// Click → open file input
dropZone.addEventListener("click", () => fileInput.click());

// When selecting file via dialog
fileInput.addEventListener("change", (e) => {
  for (const f of e.target.files) {
    selectedFiles.push(f);
  }
  displayFiles();
});

// Drag over effect
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

// Drag leave
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

// Drop file
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  for (const f of e.dataTransfer.files) {
    selectedFiles.push(f);
  }
  displayFiles();
});

// Show selected file names
function displayFiles() {
  fileList.innerHTML = "";
  selectedFiles.forEach(f => {
    const div = document.createElement("div");
    div.textContent = f.name;
    fileList.appendChild(div);
  });
}

// === FORM SUBMISSION ===
const form = document.getElementById("requestForm");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const fd = new FormData(form);

  // append files properly!
  selectedFiles.forEach(file => fd.append("files", file));

  const res = await fetch(form.action, {
    method: "POST",
    body: fd
  });

  const result = await res.json();
  alert("Form berhasil dikirim!");
});

// Reset button clears files too
document.getElementById("resetBtn").addEventListener("click", () => {
  selectedFiles = [];
  fileList.innerHTML = "";
});