// ============================================================
// 1) COLE AQUI A URL DO SEU GOOGLE APPS SCRIPT /exec
// Exemplo: https://script.google.com/macros/s/SEU_ID/exec
// ============================================================
const WEB_APP_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";

const form = document.getElementById("vipForm");
const submitBtn = document.getElementById("submitBtn");
const submitText = document.getElementById("submitText");
const spinner = document.getElementById("spinner");
const formMessage = document.getElementById("formMessage");
const whatsappInput = document.getElementById("whatsapp");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function formatWhatsApp(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
}

whatsappInput.addEventListener("input", (e) => {
  e.target.value = formatWhatsApp(e.target.value);
});

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitText.textContent = loading ? "ENVIANDO..." : "GARANTIR MINHA PRIORIDADE";
  spinner.classList.toggle("hidden", !loading);
}

function showMessage(text, type = "") {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
}

function openSuccess() {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeSuccess() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

closeModal.addEventListener("click", closeSuccess);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeSuccess();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("");

  if (WEB_APP_URL.includes("COLE_AQUI")) {
    showMessage("Configure a URL do Apps Script no arquivo script.js.", "error");
    return;
  }

  const rawPhone = onlyDigits(whatsappInput.value);

  if (rawPhone.length < 10 || rawPhone.length > 11) {
    showMessage("Digite um WhatsApp válido com DDD.", "error");
    whatsappInput.focus();
    return;
  }

  const data = new FormData(form);
  const payload = new URLSearchParams();

  for (const [key, value] of data.entries()) {
    payload.append(key, value);
  }

  payload.set("whatsapp", rawPhone);
  payload.set("pagina", window.location.href);
  payload.set("userAgent", navigator.userAgent);

  setLoading(true);

  try {
    // Apps Script pode redirecionar a resposta do Web App.
    // no-cors garante o envio a partir do GitHub Pages sem bloquear o cadastro.
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: payload.toString()
    });

    form.reset();
    showMessage("Cadastro enviado.", "success");
    openSuccess();
  } catch (error) {
    console.error(error);
    showMessage("Não foi possível enviar. Tente novamente em alguns instantes.", "error");
  } finally {
    setLoading(false);
  }
});

// Contagem regressiva: 09/09/2026 às 14:00 no horário de Brasília.
const targetDate = new Date("2026-09-09T14:00:00-03:00");

function updateCountdown() {
  const now = new Date();
  let diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  diff %= 60000;
  const seconds = Math.floor(diff / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
