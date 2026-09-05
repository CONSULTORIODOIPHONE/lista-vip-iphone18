/*
=========================================================
CONFIGURAÇÃO
=========================================================
*/

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyjw9SpnmHrnliBjXTg5OXlJJQASZ5_ldGDALt7hvi0lRVx1LlK6ASyCU_-bGDC7Y8/exec";


/*
=========================================================
CONTADOR INICIAL
=========================================================

Use 10 somente se esses 10 interessados representarem
pessoas que vocês realmente já possuem na campanha.
*/

const BASE_LIST_COUNT =
  10;



/*
=========================================================
ELEMENTOS
=========================================================
*/

const form =
  document.getElementById("vipForm");

const submitBtn =
  document.getElementById("submitBtn");

const submitText =
  document.getElementById("submitText");

const submitArrow =
  document.getElementById("submitArrow");

const spinner =
  document.getElementById("spinner");

const formMessage =
  document.getElementById("formMessage");

const whatsappInput =
  document.getElementById("whatsapp");

const modal =
  document.getElementById("successModal");

const closeModal =
  document.getElementById("closeModal");



/*
=========================================================
WHATSAPP
=========================================================
*/

function onlyDigits(value) {

  return String(
    value || ""
  )
    .replace(
      /\D/g,
      ""
    );

}



function formatWhatsApp(value) {

  const digits =
    onlyDigits(value)
      .slice(
        0,
        11
      );


  if (
    digits.length <= 2
  ) {

    return digits;

  }


  if (
    digits.length <= 7
  ) {

    return `(${digits.slice(0,2)}) ${digits.slice(2)}`;

  }


  if (
    digits.length <= 10
  ) {

    return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;

  }


  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;

}



whatsappInput.addEventListener(
  "input",
  event => {

    event.target.value =
      formatWhatsApp(
        event.target.value
      );

  }
);



/*
=========================================================
LOADING
=========================================================
*/

function setLoading(loading) {

  submitBtn.disabled =
    loading;


  submitText.textContent =
    loading
      ? "ENVIANDO..."
      : "ENTRAR NA LISTA VIP";


  spinner.classList.toggle(
    "hidden",
    !loading
  );


  submitArrow.classList.toggle(
    "hidden",
    loading
  );

}



/*
=========================================================
MENSAGEM
=========================================================
*/

function showMessage(
  text,
  type = ""
) {

  formMessage.textContent =
    text;


  formMessage.className =
    `form-message ${type}`;

}



/*
=========================================================
MODAL
=========================================================
*/

function openSuccess() {

  modal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "modal-open"
  );

}



function closeSuccess() {

  modal.classList.add(
    "hidden"
  );


  document.body.classList.remove(
    "modal-open"
  );

}



closeModal.addEventListener(
  "click",
  closeSuccess
);



modal.addEventListener(
  "click",
  event => {

    if (
      event.target === modal
    ) {

      closeSuccess();

    }

  }
);



/*
=========================================================
ORIGEM AUTOMÁTICA
=========================================================
*/

function detectOrigin() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const origin =
    params.get(
      "origem"
    );


  if (!origin) {
    return;
  }


  const select =
    document.getElementById(
      "origem"
    );


  const mapping = {

    brunao:
      "Instagram Brunão do iPhone",

    consultorio:
      "Instagram Consultório do iPhone",

    vip:
      "WhatsApp / Grupo VIP",

    whatsapp:
      "WhatsApp / Grupo VIP",

    loja:
      "Loja física",

    indicacao:
      "Indicação"

  };


  if (
    mapping[origin]
  ) {

    select.value =
      mapping[origin];

  }

}



detectOrigin();



/*
=========================================================
ENVIO
=========================================================
*/

form.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    showMessage("");


    if (
      WEB_APP_URL.includes(
        "COLE_AQUI"
      )
    ) {

      showMessage(
        "Configure a URL do Apps Script.",
        "error"
      );

      return;

    }


    const phone =
      onlyDigits(
        whatsappInput.value
      );


    if (
      phone.length < 10 ||
      phone.length > 11
    ) {

      showMessage(
        "Digite um WhatsApp válido com DDD.",
        "error"
      );


      whatsappInput.focus();

      return;

    }


    const data =
      new FormData(form);


    const payload =
      new URLSearchParams();


    for (
      const [key,value]
      of data.entries()
    ) {

      payload.append(
        key,
        value
      );

    }


    payload.set(
      "whatsapp",
      phone
    );


    payload.set(
      "pagina",
      window.location.href
    );


    setLoading(true);


    try {


      await fetch(
        WEB_APP_URL,
        {

          method:
            "POST",

          mode:
            "no-cors",

          headers: {

            "Content-Type":
              "application/x-www-form-urlencoded;charset=UTF-8"

          },

          body:
            payload.toString()

        }
      );


      form.reset();


      showMessage(
        "Cadastro enviado.",
        "success"
      );


      openSuccess();


      setTimeout(
        loadStats,
        1800
      );


    }

    catch (
      error
    ) {


      console.error(
        error
      );


      showMessage(
        "Não foi possível enviar. Tente novamente.",
        "error"
      );


    }

    finally {

      setLoading(false);

    }

  }
);



/*
=========================================================
COUNTDOWN
=========================================================
*/

const launchDate =
  new Date(
    "2026-09-09T14:00:00-03:00"
  );


const countdownCard =
  document.getElementById(
    "countdownCard"
  );


const postLaunchCard =
  document.getElementById(
    "postLaunchCard"
  );



function showPostLaunch() {

  countdownCard.classList.add(
    "hidden"
  );


  postLaunchCard.classList.remove(
    "hidden"
  );

}



function updateCountdown() {

  const now =
    new Date();


  let difference =
    launchDate -
    now;


  if (
    difference <= 0
  ) {

    showPostLaunch();

    return;

  }


  const days =
    Math.floor(
      difference /
      86400000
    );


  difference %=
    86400000;


  const hours =
    Math.floor(
      difference /
      3600000
    );


  difference %=
    3600000;


  const minutes =
    Math.floor(
      difference /
      60000
    );


  difference %=
    60000;


  const seconds =
    Math.floor(
      difference /
      1000
    );


  document.getElementById(
    "days"
  ).textContent =
    String(days)
      .padStart(
        2,
        "0"
      );


  document.getElementById(
    "hours"
  ).textContent =
    String(hours)
      .padStart(
        2,
        "0"
      );


  document.getElementById(
    "minutes"
  ).textContent =
    String(minutes)
      .padStart(
        2,
        "0"
      );


  document.getElementById(
    "seconds"
  ).textContent =
    String(seconds)
      .padStart(
        2,
        "0"
      );

}



updateCountdown();


setInterval(
  updateCountdown,
  1000
);



/*
=========================================================
ESTATÍSTICAS
=========================================================
*/

window.receiveVipStats =
  function(data) {

    if (!data) {
      return;
    }


    const realTotal =
      Number(
        data.total || 0
      );


    const today =
      Number(
        data.today || 0
      );


    const total =
      BASE_LIST_COUNT +
      realTotal;


    const leadCount =
      document.getElementById(
        "leadCount"
      );


    const todayCount =
      document.getElementById(
        "todayCount"
      );



    if (
      total === 1
    ) {

      leadCount.textContent =
        "1 pessoa já entrou";

    }

    else {

      leadCount.textContent =
        `${total} pessoas já entraram`;

    }



    if (
      today <= 0
    ) {

      todayCount.textContent =
        "Lista recebendo novos cadastros";

    }

    else if (
      today === 1
    ) {

      todayCount.textContent =
        "1 pessoa entrou hoje";

    }

    else {

      todayCount.textContent =
        `${today} pessoas entraram hoje`;

    }

};



function loadStats() {

  if (
    WEB_APP_URL.includes(
      "COLE_AQUI"
    )
  ) {

    return;

  }


  const previous =
    document.getElementById(
      "vip-stats-script"
    );


  if (
    previous
  ) {

    previous.remove();

  }


  const script =
    document.createElement(
      "script"
    );


  script.id =
    "vip-stats-script";


  script.src =
    `${WEB_APP_URL}?action=stats&callback=receiveVipStats&t=${Date.now()}`;


  document.body.appendChild(
    script
  );

}



loadStats();


setInterval(
  loadStats,
  60000
);
