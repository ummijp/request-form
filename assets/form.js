const form = document.getElementById("requestForm");

// Dynamic fields HTML
const dynamicFieldsHTML = `
  <label>Nama</label>
  <input type="text" name="name" required>

  <label>Tim</label>
  <select id="department" name="department" required>
    <option value="">-- Pilih Tim --</option>
    <option value="Yayasan">Yayasan</option>
    <option value="Bendahara">Bendahara</option>
    <option value="Humas & Kreatif">Humas & Kreatif</option>
    <option value="Support">Support</option>
  </select>

  <label>Permohonan</label>
  <select id="type" name="type" required>
    <option value="">-- Pilih Permohonan --</option>
    <option value="surat">Surat</option>
    <option value="proposal">Proposal</option>
    <option value="sertifikat wakaf">Sertifikat Wakaf</option>
    <option value="sertifikat infak">Sertifikat Infak</option>
    <option value="poster/flyer">Poster/Flyer</option>
    <option value="lain-lain">Lain-lain</option>
  </select>

  <div id="suratFields" class="dynamic-fields">
    <label>Perihal</label><input type="text" name="surat_perihal">
    <label>Penerima</label><input type="text" name="surat_penerima">
    <label>Alamat Penerima</label><input type="text" name="surat_alamat">
    <label>Catatan Tambahan</label><textarea name="surat_catatan"></textarea>
  </div>

  <div id="proposalFields" class="dynamic-fields">
    <label>Nama Kegiatan</label><input type="text" name="proposal_nama">
    <label>Tujuan Proposal</label><input type="text" name="proposal_tujuan">
    <label>Catatan Tambahan</label><textarea name="proposal_catatan"></textarea>
  </div>

  <div id="wakafFields" class="dynamic-fields">
    <label>Nama Donatur</label><input type="text" name="wakaf_donatur">
    <label>Nominal</label><input type="text" name="wakaf_nominal">
    <label>Kontak penerima sertifikat (WA/Email)</label><input type="text" name="wakaf_kontak">
  </div>

  <div id="infakFields" class="dynamic-fields">
    <label>Nama Donatur</label><input type="text" name="infak_donatur">
    <label>Nominal</label><input type="text" name="infak_nominal">
    <label>Kontak penerima sertifikat (WA/Email)</label><input type="text" name="infak_kontak">
  </div>

  <div id="posterFields" class="dynamic-fields">
    <label>Nama Acara</label><input type="text" name="poster_nama">
    <label>Lokasi Acara</label><input type="text" name="poster_lokasi">
    <label>Tanggal Acara</label><input type="date" name="poster_tanggal">
    <label>Detail Acara</label><textarea name="poster_detail"></textarea>
  </div>

  <div id="lainFields" class="dynamic-fields">
    <label>Detail Permintaan</label><textarea name="lain_detail"></textarea>
  </div>

  <label>Deadline</label>
  <input type="date" name="deadline" required>

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

// Drag & Drop File Upload
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("files");
const fileListDiv = document.getElementById("fileList");
let selectedFiles = [];

dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("dragover"); });
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", e => { e.preventDefault(); dropZone.classList.remove("dragover"); handleFiles(e.dataTransfer.files); });
fileInput.addEventListener("change", () => handleFiles(fileInput.files));

function handleFiles(files){
  for(let file of files){
    selectedFiles.push(file);
    const p = document.createElement("p");
    p.textContent = file.name;
    fileListDiv.appendChild(p);
  }
}

// Form submission
form.addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(form);
  selectedFiles.forEach(f => fd.append("upload[]", f));

  fetch(form.action, { method:"POST", body: fd })
    .then(res => res.json())
    .then(data => {
      if(data.status==="ok"){
        alert("Permohonan berhasil dikirim!");
        form.reset();
        fileListDiv.innerHTML="";
        selectedFiles=[];
        Object.values(dynamicFields).forEach(div => div.style.display="none");
      } else {
        alert("Terjadi error: "+data.message);
      }
    })
    .catch(err => alert("Error: "+err));
});

// Manual reset fix
document.getElementById("resetBtn").addEventListener("click", function () {

    // Reset dropdowns
    const typeSelect = document.getElementById("type");
    const departmentSelect = document.getElementById("department");

    if (typeSelect) typeSelect.selectedIndex = 0;
    if (departmentSelect) departmentSelect.selectedIndex = 0;

    // Hide dynamic fields
    Object.values(dynamicFields).forEach(div => div.style.display = "none");

    // Clear uploaded file list (UI)
    fileListDiv.innerHTML = "";

    // Clear stored file array
    selectedFiles = [];

    // Reset drag highlight
    dropZone.classList.remove("dragover");
});

setTimeout(() => {
    this.blur(); // remove focus from button
}, 10);
