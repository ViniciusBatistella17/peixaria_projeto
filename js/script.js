document.getElementById("formContato").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const whatsapp = document.getElementById("whatsapp").value;
    const assunto = document.getElementById("assunto").value;
    const mensagem = document.getElementById("mensagem").value;

    const retorno = document.querySelector('input[name="retorno"]:checked')?.value || "Não informado";

    const novidades = document.getElementById("novidade").checked
        ? "Sim"
        : "Não";

    const texto = `🐟 NOVO CONTATO — BANCA DA FEIRA MACHADO

    👤 Cliente: ${nome}
    📞 Telefone: ${whatsapp}
    📧 E-mail: ${email}

    📌 Assunto: ${assunto}

    📲 Preferência de retorno: ${retorno}

    🔥 Quer receber novidades?
    ${novidades}

    📝 Mensagem:
    ${mensagem}`;

    const numero = "5519991252954";

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

    window.open(url, "_blank");
})