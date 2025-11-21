/* Dynamic fields reference */
const form = document.getElementById("requestForm");

form.innerHTML = `
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
    <label>Alamat</label><input type="text" name="surat_alamat">
    <label>Gambaran isi surat</label><textarea name="surat_isi"></textarea>
  </div>

  <div id="proposalFields" class="dynamic-fields">
    <label>Nama Kegiatan</label><input type="text" name="proposal_nama">
    <label>Tujuan Proposal</label><input type="text" name="proposal_tujuan">
    <label>Batas Waktu</label><input type="date" name="proposal_deadline">
    <label>Gambaran Isi Proposal</label><textarea name="proposal_gambaran"></textarea>
    <label>Lain-lain</label><textarea name="proposal_lain"></textarea>
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
    <label>Tempat</label><input type="text" name="poster_tempat">
    <label>Tanggal</label><input type="date" name="poster_tanggal">
    <label>Detail Acara</label><textarea name="poster_detail"></textarea>
  </div>

  <div id="lainFields" class="dynamic-fields">
    <label>Detail Permintaan</label><textarea name="lain_detail"></textarea>
  </div>

  <label>Batas Waktu</label>
  <input type="date" name="deadline" required>

  <label>Material (Drag & Drop / Upload)</label>
  <div id="uploader">Klik atau drag file di sini</div>
  <div id="fileList"></div>
  <input type="hidden" id="filelink" name="filelink">

  <input type="hidden" name="token" value="YOUR_SECRET_TOKEN">

  <button type="submit">Kirim Permohonan</button>
`;

/* Dynamic field logic */
const typeSelect = document.getElementById("type");
const dynamicFields = {
  "surat": document.getElementById("suratFields"),
  "proposal": document.getElementById("proposalFields"),
  "sertifikat wakaf": document.getElementById("wakafFields"),
  "sertifikat infak": document.getElementById("infakFields"),
  "poster/flyer": document.getElementById("posterFields"),
  "lain-lain": document.getElementById("lainFields")
};

typeSelect.addEventListener("change", () => {
  Object.values(dynamicFields).forEach(div => div.style.display = "none");
  const selected = typeSelect.value;
  if (dynamicFields[selected]) dynamicFields[selected].style.display = "block";
});

/* FileStack uploader */
const client = filestack.init("YOUR_FILESTACK_API_KEY");
const uploaderDiv = document.getElementById("uploader");
const fileListDiv = document.getElementById("fileList");
let uploadedFiles = [];

uploaderDiv.addEventListener("click", () => {
  client.picker({
    maxFiles: 5,
    onUploadDone: res => {
      res.filesUploaded.forEach(file => {
        uploadedFiles.push(file.url);
        const p = document.createElement("p");
        p.textContent = file.filename;
        fileListDiv.appendChild(p);
      });
      document.getElementById("filelink").value = uploadedFiles.join("\n");
    }
  }).open();
});

/* Form submission */
form.addEventListener("submit", function(e){
  e.preventDefault();
  fetch(form.action, { method:"POST", body:new FormData(form) })
  .then(res => res.json())
  .then(data => {
    if(data.status==="ok"){
      alert("Permohonan berhasil dikirim!");
      form.reset(); fileListDiv.innerHTML=""; uploadedFiles=[];
      Object.values(dynamicFields).forEach(div => div.style.display="none");
    } else {
      alert("Terjadi error: "+data.message);
    }
  })
  .catch(err => alert("Error: "+err));
});
