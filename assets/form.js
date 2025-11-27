const form = document.getElementById("requestForm");

// Dynamic fields HTML (same as before)
const dynamicFieldsHTML = `
  <label>Nama</label>
  <input type="text" name="Nama" required>

  <label>Tim</label>
  <select id="department" name="Tim" required>
    <option value="">-- Pilih Tim --</option>
    <option value="Yayasan">Yayasan</option>
    <option value="Bendahara">Bendahara</option>
    <option value="Humas & Kreatif">Humas & Kreatif</option>
    <option value="Support">Support</option>
  </select>

  <label>Permohonan</label>
  <select id="type" name="Permohonan" required>
    <option value="">-- Pilih Permohonan --</option>
    <option value="surat">Surat</option>
    <option value="proposal">Proposal</option>
    <option value="sertifikat wakaf">Sertifikat Wakaf</option>
    <option value="sertifikat infak">Sertifikat Infak</option>
    <option value="poster/flyer">Poster/Flyer</option>
    <option value="lain-lain">Lain-lain</option>
  </select>

  <div id="suratFields" class="dynamic-fields">
    <label>Perihal</label><input type="text" name="Perihal">
    <label>Penerima</label><input type="text" name="Penerima">
    <label>Alamat Penerima</label><input type="text" name="Alamat Penerima">
    <label>Catatan Tambahan</label><textarea name="Catatan Tambahan"></textarea>
  </div>

  <div id="proposalFields" class="dynamic-fields">
    <label>Nama Kegiatan</label><input type="text" name="Nama Kegiatan">
    <label>Tujuan Proposal</label><input type="text" name="Tujuan Proposal">
    <label>Catatan Tambahan</label><textarea name="Catatan Proposal"></textarea>
  </div>

  <div id="wakafFields" class="dynamic-fields">
    <label>Nama Donatur</label><input type="text" name="Nama Donatur Wakaf">
    <label>Nominal</label><input type="text" name="Nominal Wakaf">
    <label>Kontak penerima sertifikat (WA/Email)</label><input type="text" name="Kontak Wakaf">
  </div>

  <div id="infakFields" class="dynamic-fields">
    <label>Nama Donatur</label><input type="text" name="Nama Donatur Infak">
    <label>Nominal</label><input type="text" name="Nominal Infak">
    <label>Kontak penerima sertifikat (WA/Email)</label><input type="text" name="Kontak Infak">
  </div>

  <div id="posterFields" class="dynamic-fields">
    <label>Nama Acara</label><input type="text" name="Nama Acara">
    <label>Lokasi Acara</label><input type="text" name="Lokasi Acara">
    <label>Tanggal Acara</label><input type="date" name="Tanggal Acara">
    <label>Detail Acara</label><textarea name="Detail Acara"></textarea>
  </div>

  <div id="lainFields" class="dynamic-fields">
    <label>Detail Permintaan</label><textarea name="Detail Lain"></textarea>
  </div>

  <label>Deadline</label>
  <input type="date" name="Deadline" required>

  <label>Material</label>
  <div id="dropZone" style="border:2px dashed #ccc; padding:15px; text-align:center; cursor:pointer;">
    Klik atau drag file di sini
  </div>
  <input type="file" id="files" name="upload[]" multiple style="display:none;">
  <div id="fileList"></div>
`;

form.insertAdjacentHTML("afterbegin", dynamicFieldsHTML);

// Dynamic field logic
const typeSelect = document.getElementById("type");
const dynamicFields = {
  "surat": document.getElementById("suratFields"),
  "proposal": document.getElementById("proposalFields"),
  "sertifikat wakaf": document.getElementById("wakafFields"),
  "sertifikat infak": document.getElementById("infakFields"),
  "poster/flyer": document.getElementById("posterFields"),
  "lain-lain": document.getElementById("lainFields")
};
Object.values(dynamicFields).forEach(div => div.style.display="none");

typeSelect.addEventListener("change", () => {
  Object.values(dynamicFields).forEach(div => div.style.display="none");
  const selected = typeSelect.value;
  if(dynamicFields[selected]) dynamicFields[selected].style.display="block";
});


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