// Toggle between screens
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
  }
  
  function showOptions() {
    const username = document.getElementById('usernameInput').value.trim();
    if (!username) return alert('Please enter a username.');
    generateQRCode(username);
    showScreen('optionsScreen');
  }
  
  function showForm() { showScreen('formScreen'); }
  function showAdmin() { showScreen('adminScreen'); initMap(); }
  function showChat() { showScreen('chatScreen'); }
  function goBack(target) { showScreen(target); resetProgress(); }
  
  // Progress
  function showNextInput(nextId, progressPercent) {
    document.getElementById(nextId).classList.remove('hidden');
    document.getElementById("progress").style.width = progressPercent + "%";
  }
  
  function resetProgress() {
    document.getElementById("progress").style.width = "0%";
    ['districtInput', 'patientsInput', 'remarksInput'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
  }
  
  function toggleMode() {
    document.body.classList.toggle('dark-mode');
  }
  
  // Submit Form
  const form = document.getElementById('dataEntryForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const facility = document.getElementById('facility').value.trim();
    const district = document.getElementById('district').value.trim();
    const patients = document.getElementById('patients').value.trim();
    const remarks = document.getElementById('remarks').value.trim() || 'None';
    const imageInput = document.getElementById('hospitalImage');
    const imageURL = imageInput.files.length > 0 ? URL.createObjectURL(imageInput.files[0]) : '';
  
    const entryHTML = `
      <div class="entry">
        <h3>${facility} — ${district}</h3>
        <p><strong>Patients Treated:</strong> ${patients}</p>
        <p><strong>Remarks:</strong> ${remarks}</p>
        ${imageURL ? `<img src="${imageURL}" style="max-width: 100%;" />` : ''}
      </div>`;
  
    document.getElementById('adminData').innerHTML = entryHTML;
  
    form.reset();
    resetProgress();
    alert('Data submitted successfully!');
  });
  
  // Speech Recognition
  function startSpeech(inputId) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
      document.getElementById(inputId).value = event.results[0][0].transcript;
    };
  }
  
  // QR Code Generation
  function generateQRCode(text) {
    const qr = document.getElementById('qrcode');
    qr.innerHTML = '';
    new QRCode(qr, {
      text: `Hospital Verified: ${text}`,
      width: 100,
      height: 100
    });
  }
  
  // Filter Data
  function filterData() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const data = document.getElementById('adminData').innerText.toLowerCase();
    document.getElementById('adminData').style.display = data.includes(input) ? 'block' : 'none';
  }
  
  // Google Maps
  let map;
  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5,
    });
  
    new google.maps.Marker({
      position: { lat: 20.5937, lng: 78.9629 },
      map,
      title: "India",
    });
  }
  
  // Chat Support (Static Example)
  const chatContainer = document.getElementById("chatContainer");
  chatContainer.innerHTML = `
    <div class='chat-bubble'>Hello! How can I help you today?</div>
    <input type='text' id='chatInput' placeholder='Type your message...' />
    <button onclick='sendChat()'>Send</button>
  `;
  
  function sendChat() {
    const input = document.getElementById('chatInput');
    if (input.value.trim()) {
      chatContainer.innerHTML += `<div class='chat-bubble user'>${input.value}</div>`;
      setTimeout(() => {
        chatContainer.innerHTML += `<div class='chat-bubble'>Support will contact you shortly.</div>`;
      }, 1000);
      input.value = '';
    }
  }