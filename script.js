/*
========================================================
CONFIGURAÇÃO
========================================================
*/

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyjw9SpnmHrnliBjXTg5OXlJJQASZ5_ldGDALt7hvi0lRVx1LlK6ASyCU_-bGDC7Y8/exec";


/*
========================================================
BASE DO CONTADOR
========================================================
*/

const BASE_LIST_COUNT = 24;



/*
========================================================
ELEMENTOS
========================================================
*/

const form =
  document.getElementById("vipForm");

const whatsappInput =
  document.getElementById("whatsapp");

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

const modal =
  document.getElementById("successModal");

const closeModal =
  document.getElementById("closeModal");



/*
========================================================
WHATSAPP
========================================================
*/

function onlyDigits(value) {

  return String(value || "")
    .replace(/\D/g, "");

}


function formatWhatsApp(value) {

  const digits =
    onlyDigits(value)
      .slice(0, 11);


  if (digits.length <= 2) {

    return digits;

  }


  if (digits.length <= 7) {

    return `(${digits.slice(0,2)}) ${digits.slice(2)}`;

  }


  if (digits.length <= 10) {

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
========================================================
ORIGEM
========================================================
*/

function detectOrigin() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const origin =
    params.get("origem");


  if (!origin) {
    return;
  }


  const originInput =
    document.getElementById("origem");


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
      "Indicação",

    instagram:
      "Instagram"

  };


  if (mapping[origin]) {

    originInput.value =
      mapping[origin];

  }

}


detectOrigin();



/*
========================================================
LOADING
========================================================
*/

function setLoading(loading) {

  submitBtn.disabled =
    loading;


  submitText.textContent =
    loading
      ? "ENVIANDO..."
      : "ENTRAR NA LISTA DE ESPERA";


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
========================================================
MENSAGENS
========================================================
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
========================================================
MODAL
========================================================
*/

function openSuccessModal() {

  modal.classList.remove("hidden");

  document.body.classList.add(
    "modal-open"
  );

}


function closeSuccessModal() {

  modal.classList.add("hidden");

  document.body.classList.remove(
    "modal-open"
  );

}


closeModal.addEventListener(
  "click",
  closeSuccessModal
);


modal.addEventListener(
  "click",
  event => {

    if (event.target === modal) {

      closeSuccessModal();

    }

  }
);



/*
========================================================
ENVIO
========================================================
*/

form.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    showMessage("");


    /*
    URL NÃO CONFIGURADA
    */

    if (
      !WEB_APP_URL ||
      WEB_APP_URL.includes(
        "COLE_AQUI"
      )
    ) {

      showMessage(
        "Configure a URL do Apps Script no script.js.",
        "error"
      );

      return;

    }



    /*
    VALIDA WHATSAPP
    */

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



    /*
    MONTA DADOS
    */

    const formData =
      new FormData(form);


    const payload =
      new URLSearchParams();


    for (
      const [key,value]
      of formData.entries()
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



    /*
    ENVIA
    */

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


      /*
      LIMPA FORM
      */

      form.reset();


      /*
      REAPLICA ORIGEM
      */

      detectOrigin();


      /*
      SUCESSO
      */

      showMessage(
        "Cadastro enviado.",
        "success"
      );


      openSuccessModal();


      /*
      ATUALIZA CONTADOR
      */

      setTimeout(
        loadStats,
        1500
      );


    }

    catch (error) {


      console.error(error);


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
========================================================
ESTATÍSTICAS
========================================================
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


    /*
    SOMA BASE + PLANILHA
    */

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



    /*
    TOTAL
    */

    if (total === 1) {

      leadCount.textContent =
        "1 pessoa já entrou";

    }

    else {

      leadCount.textContent =
        `${total} pessoas já entraram`;

    }



    /*
    HOJE
    */

    if (today <= 0) {

      todayCount.textContent =
        "Lista recebendo novos cadastros";

    }

    else if (today === 1) {

      todayCount.textContent =
        "1 pessoa entrou hoje";

    }

    else {

      todayCount.textContent =
        `${today} pessoas entraram hoje`;

    }

};



/*
========================================================
CARREGA ESTATÍSTICAS
========================================================
*/

function loadStats() {


  if (
    !WEB_APP_URL ||
    WEB_APP_URL.includes(
      "COLE_AQUI"
    )
  ) {

    return;

  }


  const oldScript =
    document.getElementById(
      "vip-stats-script"
    );


  if (oldScript) {

    oldScript.remove();

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
