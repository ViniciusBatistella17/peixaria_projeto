document.addEventListener('DOMContentLoaded', function(){

    const container = document.querySelector('.carousel');
    const listaSlides = document.querySelector('.carousel-track');
    if(!container || !listaSlides) return;

    const itens = Array.from(listaSlides.children);
    const totalSlides = itens.length;
    if(totalSlides === 0) return;

    const tempoAnimacao = 600; // ms
    const tempoAutoPlay = 3000; // ms

    let slidesVisiveis = 1;

    function calcularSlidesVisiveis(){
        const primeiroSlide = listaSlides.children[0];
        if(!primeiroSlide) return 1;

        const slideRect = primeiroSlide.getBoundingClientRect();
        const estilo = getComputedStyle(listaSlides);
        const gap = parseFloat(estilo.gap) || 0;
        const larguraContainer = container.clientWidth;

        const quantidade = Math.max(
            1,
            Math.ceil((larguraContainer + gap) / (slideRect.width + gap))
        );

        return quantidade;
    }

    function removerClones(){
        Array.from(listaSlides.querySelectorAll('.clone')).forEach(el => el.remove());
    }

    function criarClones(){
        removerClones();

        slidesVisiveis = calcularSlidesVisiveis();
        const slidesAtuais = Array.from(listaSlides.children);
        const tamanho = slidesAtuais.length;

        // clona últimos para o começo
        for(let i = tamanho - slidesVisiveis; i < tamanho; i++){
            const clone = slidesAtuais[i].cloneNode(true);
            clone.classList.add('clone');
            listaSlides.insertBefore(clone, listaSlides.firstChild);
        }

        // clona primeiros para o final
        for(let i = 0; i < slidesVisiveis; i++){
            const clone = slidesAtuais[i].cloneNode(true);
            clone.classList.add('clone');
            listaSlides.appendChild(clone);
        }
    }

    criarClones();

    let indiceAtual = slidesVisiveis;

    function calcularPasso(){
        const slide = listaSlides.querySelector('.slide');
        const slideRect = slide.getBoundingClientRect();
        const estilo = getComputedStyle(listaSlides);
        const gap = parseFloat(estilo.gap) || 0;

        return slideRect.width + gap;
    }

    function definirPosicaoInicial(){
        const passo = calcularPasso();

        listaSlides.style.transition = 'none';
        listaSlides.style.transform = `translateX(-${indiceAtual * passo}px)`;

        void listaSlides.offsetWidth;

        listaSlides.style.transition = `transform ${tempoAnimacao}ms ease`;
    }

    setTimeout(definirPosicaoInicial, 50);

    // bolinhas
    const containerBolinhas = container.querySelector('.carousel-dots');
    const bolinhas = [];

    for(let i = 0; i < totalSlides; i++){
        const botao = document.createElement('button');

        if(i === 0) botao.classList.add('active');

        botao.addEventListener('click', ()=>{
            irParaSlide(i + slidesVisiveis);
            reiniciarAutoPlay();
        });

        containerBolinhas.appendChild(botao);
        bolinhas.push(botao);
    }

    function atualizarBolinhas(){
        const ativo = (indiceAtual - 1 + totalSlides) % totalSlides;

        bolinhas.forEach((b, i)=>{
            b.classList.toggle('active', i === ativo);
        });
    }

    let animando = false;

    function fimDaAnimacao(){
        if(indiceAtual >= totalSlides + slidesVisiveis){
            listaSlides.style.transition = 'none';
            indiceAtual = slidesVisiveis;

            const passo = calcularPasso();
            listaSlides.style.transform = `translateX(-${indiceAtual * passo}px)`;
        }

        if(indiceAtual < slidesVisiveis){
            listaSlides.style.transition = 'none';
            indiceAtual = totalSlides + slidesVisiveis - 1;

            const passo = calcularPasso();
            listaSlides.style.transform = `translateX(-${indiceAtual * passo}px)`;
        }

        void listaSlides.offsetWidth;

        listaSlides.style.transition = `transform ${tempoAnimacao}ms ease`;

        atualizarBolinhas();
        animando = false;

        listaSlides.removeEventListener('transitionend', fimDaAnimacao);
    }

    function irParaSlide(novoIndice){
        if(animando) return;

        indiceAtual = novoIndice;

        const passo = calcularPasso();

        animando = true;

        listaSlides.addEventListener('transitionend', fimDaAnimacao);

        listaSlides.style.transition = `transform ${tempoAnimacao}ms ease`;
        listaSlides.style.transform = `translateX(-${indiceAtual * passo}px)`;

        atualizarBolinhas();
    }

    function proximoSlide(){
        if(animando) return;
        indiceAtual++;
        irParaSlide(indiceAtual);
    }

    function slideAnterior(){
        if(animando) return;
        indiceAtual--;
        irParaSlide(indiceAtual);
    }

    // botões
    const botaoProximo = container.querySelector('.carousel-btn.next');
    const botaoAnterior = container.querySelector('.carousel-btn.prev');

    if(botaoProximo){
        botaoProximo.addEventListener('click', ()=>{
            proximoSlide();
            reiniciarAutoPlay();
        });
    }

    if(botaoAnterior){
        botaoAnterior.addEventListener('click', ()=>{
            slideAnterior();
            reiniciarAutoPlay();
        });
    }

    // autoplay
    let intervalo = setInterval(proximoSlide, tempoAutoPlay);

    function reiniciarAutoPlay(){
        clearInterval(intervalo);
        intervalo = setInterval(proximoSlide, tempoAutoPlay);
    }

    // pausa no hover
    container.addEventListener('mouseenter', ()=>{
        clearInterval(intervalo);
    });

    container.addEventListener('mouseleave', ()=>{
        reiniciarAutoPlay();
    });

    // resize
    let tempoResize;

    window.addEventListener('resize', ()=>{
        clearTimeout(tempoResize);

        tempoResize = setTimeout(()=>{
            const indiceReal = (indiceAtual - slidesVisiveis + totalSlides) % totalSlides;

            criarClones();

            bolinhas.forEach((botao, i)=>{
                botao.onclick = ()=>{
                    irParaSlide(i + slidesVisiveis);
                    reiniciarAutoPlay();
                };
            });

            indiceAtual = slidesVisiveis + indiceReal;

            definirPosicaoInicial();
        }, 120);
    });

});