/*
=========================================================
CONFIGURAÇÃO
=========================================================
Cole a URL que termina em /exec
*/

const WEB_APP_URL =
  "COLE_AQUI_SUA_URL_DO_APPS_SCRIPT";


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

  return value.replace(
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

    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  }


  if (
    digits.length <= 10
  ) {

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  }


  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;

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
BOTÃO
=========================================================
*/

function setLoading(loading) {

  submitBtn.disabled =
    loading;


  submitText.textContent =
    loading
      ? "ENVIANDO..."
      : "QUERO ENTRAR NA LISTA VIP";


  spinner.classList.toggle(
    "hidden",
    !loading
  );

}



/*
=========================================================
MENSAGENS
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
    params.get("origem");


  if (
    !origin
  ) {

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

    loja:
      "Loja física"

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
FORMULÁRIO
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
        "Configure primeiro a URL do Apps Script no arquivo script.js.",
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
      new FormData(
        form
      );


    const payload =
      new URLSearchParams();


    for (
      const [key, value]
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


    setLoading(
      true
    );


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
        "Cadastro enviado com sucesso.",
        "success"
      );


      openSuccess();


      /*
      Atualiza o número na tela
      alguns segundos depois
      */

      setTimeout(
        loadLeadCount,
        2000
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


      setLoading(
        false
      );


    }

  }
);



/*
=========================================================
CONTAGEM REGRESSIVA
09/09/2026
=========================================================
*/

const launchDate =
  new Date(
    "2026-09-09T14:00:00-03:00"
  );


function updateCountdown() {


  const now =
    new Date();


  let difference =
    launchDate - now;


  if (
    difference <= 0
  ) {

    document.getElementById(
      "days"
    ).textContent =
      "00";


    document.getElementById(
      "hours"
    ).textContent =
      "00";


    document.getElementById(
      "minutes"
    ).textContent =
      "00";


    document.getElementById(
      "seconds"
    ).textContent =
      "00";


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
NÚMERO REAL DE PESSOAS NA LISTA
JSONP
=========================================================
*/


window.receiveLeadCount =
  function(data) {


    if (
      !data ||
      typeof data.count !== "number"
    ) {

      return;

    }


    const count =
      data.count;


    const leadCount =
      document.getElementById(
        "leadCount"
      );


    const leadText =
      document.getElementById(
        "leadText"
      );


    /*
    Só mostra número quando
    já existirem cadastros reais.
    */

    if (
      count === 0
    ) {

      leadCount.textContent =
        "Lista VIP aberta";


      leadText.textContent =
        "seja um dos primeiros a entrar";

      return;

    }


    if (
      count === 1
    ) {

      leadCount.textContent =
        "1 pessoa já entrou";


      leadText.textContent =
        "na nossa Lista VIP";

      return;

    }


    leadCount.textContent =
      `${count} pessoas já entraram`;


    leadText.textContent =
      "na nossa Lista VIP";

};



function loadLeadCount() {


  if (
    WEB_APP_URL.includes(
      "COLE_AQUI"
    )
  ) {

    return;

  }


  const previousScript =
    document.getElementById(
      "lead-count-script"
    );


  if (
    previousScript
  ) {

    previousScript.remove();

  }


  const script =
    document.createElement(
      "script"
    );


  script.id =
    "lead-count-script";


  script.src =
    `${WEB_APP_URL}?action=count&callback=receiveLeadCount&t=${Date.now()}`;


  document.body.appendChild(
    script
  );

}



loadLeadCount();



setInterval(
  loadLeadCount,
  60000
);
