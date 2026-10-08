# 🐢 Tartaruga Musical — Micromundo dos Intervalos

**Um ambiente interativo para explorar, construir e compreender melodias por meio de intervalos musicais.**

## Sobre o aplicativo

O **Tartaruga Musical — Micromundo dos Intervalos** é um recurso educacional desenvolvido para apoiar o ensino e a aprendizagem de música por meio da experimentação, da criação melódica e da investigação de relações intervalares.

Inspirado na ideia de *micromundos* de Seymour Papert e na linguagem de programação LOGO, o aplicativo apresenta um ambiente no qual o estudante constrói melodias utilizando comandos simples que representam intervalos musicais.

Uma tartaruga percorre visualmente o caminho entre as notas, enquanto o aplicativo reproduz os sons correspondentes. Dessa maneira, o estudante pode relacionar os comandos digitados, os intervalos musicais, a representação gráfica do movimento melódico e a percepção auditiva.

O objetivo não é apenas identificar intervalos, mas compreender seu funcionamento por meio da construção e da transformação de sequências musicais.

## Como funciona

O usuário escolhe uma nota inicial e digita os intervalos que deseja executar, utilizando códigos abreviados.

Por exemplo, partindo da nota **Dó4**, a sequência:

`a2ma a2ma a2me`

Produz as notas:

**Dó – Ré – Mi – Fá**

Os comandos representam:

- `1j` — primeira justa (repetição da nota). Os atalhos `u` e `=` e as formas `a1j` e `d1j` são aceitos e convertidos no campo para `1j`.
- `a2ma` — segunda maior ascendente.
- `a2me` — segunda menor ascendente.
- `d3me` — terça menor descendente.
- `a5j` — quinta justa ascendente.
- `a1aum` — primeira aumentada ascendente.

Cada novo intervalo é calculado a partir da nota anterior, permitindo construir melodias progressivamente.

Os comandos são separados por espaços. Ao completar um comando, o aplicativo atualiza a representação musical e reproduz a nota correspondente.

## Recursos disponíveis

O aplicativo oferece:

- Construção de melodias por intervalos ascendentes e descendentes.
- Suporte a intervalos simples e compostos, até a 22ª.
- Preservação da grafia enarmônica, distinguindo, por exemplo, Ré♯ de Mi♭.
- Reprodução sonora automática durante a digitação.
- Controle de reverberação de 0% a 100%, inicialmente em 25%, ajustável durante a reprodução.
- Representação gráfica do percurso melódico.
- Tartaruga animada que se desloca entre as notas.
- Trinta padrões rítmicos gerais e seis espaçamentos: Uniforme, Quadrática, Logarítmica, Cossenoidal, Fibonacci (intervalos) e Aleatória (exemplo fixo). A troca altera apenas os tempos, preservando as notas e o código.
- Controle de andamento.
- Execução completa ou passo a passo.
- Demonstração inicial com “Marcha Soldado”.
- Seletor de músicas com “Marcha Soldado”, “O Cravo Brigou com a Rosa” e “Ode à Alegria”. O seletor de ritmos contém padrões gerais e espaçamentos, sem carregar músicas.
- Notas e pausas das duas cantigas importadas dos MusicXML fornecidos; os tempos entre as notas seguem o espaçamento escolhido. “O Cravo Brigou com a Rosa” é apresentado um tom abaixo do original, em Si♭ maior, começando em Fá4; o MusicXML de referência permanece na tonalidade original.
- Desafios de composição utilizando notas diatônicas de diferentes armaduras de clave.
- Verificação automática dos intervalos produzidos.
- Avisos visuais e sonoros quando uma nota não respeita as condições do desafio.

## Desafios musicais

Além da exploração livre, o aplicativo permite realizar desafios de construção melódica.

O estudante pode selecionar uma armadura de clave e criar melodias utilizando exclusivamente as notas pertencentes à coleção diatônica correspondente.

As missões exigem exatamente 4 ou 8 notas, contando a nota inicial. Na missão de retorno, a oitava e última nota deve coincidir com a inicial em grafia e oitava. Quantidades maiores não concluem a missão.

A restrição diatônica considera a grafia da armadura, e não apenas a equivalência sonora entre notas enarmônicas.

Comandos completos são validados imediatamente. Prefixos ainda em edição aguardam sua conclusão; espaço, Enter, saída do campo ou reprodução finalizam a validação. Quando um comando é inválido, o aplicativo indica o primeiro erro e preserva as notas válidas anteriores no gráfico. Com a restrição ativada, comandos inválidos digitados ou colados são removidos automaticamente, mantendo e reavaliando os demais comandos. O aviso sonoro ocorre uma vez por tentativa recusada. Uma alteração da armadura ou da nota inicial apenas revalida o texto existente, permitindo ajustá-lo sem apagar a composição. Tocar e avançar uma nota verificam todo o texto antes de reproduzir a melodia.

Essas restrições funcionam como elementos para a investigação musical, incentivando o estudante a experimentar diferentes soluções.

## Fundamentação pedagógica

A proposta inspira-se no **construcionismo de Seymour Papert**, especialmente em suas ideias sobre micromundos computacionais e aprendizagem pela construção de objetos significativos.

Na tradição da linguagem LOGO, o estudante utiliza comandos para controlar uma tartaruga, observa os resultados de suas ações e modifica seus procedimentos a partir da experiência.

No Tartaruga Musical, esse princípio é aplicado ao domínio musical. Os deslocamentos da tartaruga correspondem a relações intervalares, e cada percurso constitui uma construção melódica que pode ser ouvida, visualizada, modificada e investigada.

O ambiente procura favorecer uma aprendizagem baseada na exploração, na formulação de hipóteses e na resolução de problemas musicais. O erro não é tratado apenas como uma resposta incorreta, mas como uma oportunidade para examinar relações entre notas, intervalos e regras musicais.

O aplicativo pode ser utilizado em atividades de percepção musical, teoria musical, criação melódica, composição, formação de professores e introdução ao pensamento computacional aplicado à música.

## Utilização

O aplicativo funciona diretamente em navegadores modernos, em computadores ou dispositivos móveis, sem necessidade de instalação.

Para utilizá-lo:

1. Abra o arquivo HTML no navegador.
2. Escolha a nota inicial.
3. Selecione um padrão rítmico e ajuste o andamento.
4. Digite os intervalos, separando os comandos por espaços.
5. Observe o deslocamento da tartaruga e escute os resultados.
6. Experimente modificar a sequência, utilizar outras notas iniciais ou realizar os desafios disponíveis.

A reprodução sonora utiliza recursos de áudio do próprio navegador. Algumas funcionalidades podem exigir uma interação inicial do usuário para habilitar o som.

## Desenvolvimento

O Tartaruga Musical integra um conjunto de iniciativas de desenvolvimento de recursos educacionais voltados à experimentação, à criação e à investigação de práticas pedagógicas mediadas por tecnologias digitais, especialmente no campo

## Verificação da lógica

Com Node.js instalado, execute `node tests/challenges.cjs`, `node tests/fm.cjs`, `node tests/songs.cjs` `node tests/contours.cjs` e `node tests/spacing.cjs`. Os testes exercitam a validação, as missões e os eventos do aplicativo em um ambiente simulado; não verificam a reprodução audível no navegador.

## Contornos de paisagens e objetos

O seletor inclui Montanhas, Vale entre montanhas, Ilha, Prédios, Castelo, Dunas, Ponte em arco e Veleiro. Cada exemplo apresenta uma prévia da silhueta usada para criar a melodia. Há contornos diatônicos em Dó maior e outros cromáticos.

As silhuetas são amostradas e convertidas em alturas. Amostras consecutivas com a mesma altura são reunidas em uma única nota, sem comandos de repetição. A largura do trecho é preservada na duração dessa nota; o padrão rítmico escolhido ajusta essas durações.

## Ritmos e espaçamentos

Os 30 padrões rítmicos gerais foram preservados. Não há opções de ritmo que carreguem músicas ou funções. Ao final do menu estão Uniforme, Quadrática, Logarítmica, Cossenoidal, Fibonacci (intervalos) e Aleatória (exemplo fixo). Todas as opções alteram apenas os tempos, preservando as notas escritas e a nota inicial.

Uniforme usa meio pulso por nota. Quadrática e Logarítmica aumentam os espaçamentos ao longo da sequência, de 0,25 a 1,25 pulsos; Cossenoidal varia suavemente entre esses limites. Fibonacci repete o ciclo 1, 1, 2, 3, 5, 8, 13, 21 dividido por 8. Aleatória usa sempre a mesma sequência determinística. Nos contornos, esses valores são multiplicados pela largura do trecho agrupado.

## Missões de escalas e acordes

Há escalas maiores e menores naturais ascendentes e descendentes, incluindo a oitava final. Os acordes Xmaj7, X7, Xm7, Xm7(b5), Xdim7, Xm(maj7) e X6 são construídos como arpejos ascendentes a partir da nota inicial escolhida. A avaliação confere quantidade, alturas e grafia dos graus. A restrição pela armadura é opcional e independente dessas missões. Começar novo desafio preserva a nota inicial nessas atividades.

## Relatório em PDF

Preencha o nome do aluno e clique em **Gerar relatório em PDF**. Na janela de impressão do navegador, selecione **Salvar como PDF**. O relatório contém apenas o título, o subtítulo, o nome do aluno, a data e o horário, a melodia, a nota inicial, a restrição pela armadura, a tonalidade, a missão e o gráfico da melodia. A data e o horário usam America/Sao_Paulo. O rodapé traz o nome e o link do aplicativo. O relatório é preparado no navegador, sem enviar o nome do aluno a um servidor.

Execute também `node tests/missions-report.cjs` para conferir as novas missões e o conteúdo do relatório. Esses testes não verificam o diálogo de impressão nem a aparência do PDF produzido pelo navegador.

## Ritmo original das músicas

Marcha Soldado, O Cravo Brigou com a Rosa e Ode à Alegria carregam automaticamente suas durações originais. As duas primeiras preservam as durações e pausas dos arquivos MusicXML; Ode mantém o padrão original da demonstração. A opção Ritmo original da música permite recuperar essas durações após experimentar outros ritmos, sem alterar as notas.
