# 🐢 Tartaruga Musical — Micromundo dos Intervalos

**Um ambiente para explorar, criar e compreender melodias por meio de intervalos musicais.**

[Acesse o aplicativo](https://glauberlasantiago.github.io/micromundo-dos-intervalos/)

## Sobre o aplicativo

O Tartaruga Musical é um recurso educacional para o ensino e a aprendizagem de música por meio da experimentação e da criação melódica. Inspirado nos micromundos de Seymour Papert e na linguagem LOGO, permite construir sequências musicais com comandos de intervalos.

Uma tartaruga percorre o caminho entre as notas enquanto o aplicativo reproduz a melodia. O estudante pode relacionar comandos, alturas sonoras, contornos visuais e ritmo, modificar suas escolhas e comparar os resultados.

## Como utilizar

O aplicativo funciona em navegadores modernos, em computadores e dispositivos móveis. Acesse o link acima ou abra o arquivo `index.html` no navegador.

1. Escolha uma música de demonstração, um contorno ou uma nota inicial para criar sua própria melodia.
2. Na caixa **Escreva os intervalos**, digite os comandos separados por espaços.
3. Observe as notas, os pontos e a linha do gráfico. Cada comando completo atualiza a sequência e toca a nota acrescentada.
4. Use **Tocar melodia** para ouvir toda a sequência ou **Próxima nota** para avançar passo a passo.
5. Experimente outro ritmo, ajuste o andamento e a reverberação ou selecione uma missão musical.
6. Para registrar a atividade, preencha o nome do aluno abaixo da caixa de intervalos e gere o relatório em PDF.

A reprodução usa a Web Audio API e pode exigir uma interação inicial para habilitar o áudio no navegador.

## Comandos de intervalos

Cada comando parte da nota anterior. Por exemplo, começando em **Dó4**:

```text
a2ma a2ma a2me
```

Produz **Dó4 → Ré4 → Mi4 → Fá4**.

| Código | Significado |
| --- | --- |
| `1j` | Primeira justa: repete a nota |
| `a2ma` | Segunda maior ascendente |
| `a2me` | Segunda menor ascendente |
| `d3me` | Terça menor descendente |
| `a5j` | Quinta justa ascendente |
| `a1aum` | Primeira aumentada ascendente |
| `d1aum` | Primeira aumentada descendente |

`a` indica movimento ascendente e `d`, descendente. As qualidades são `ma` (maior), `me` (menor), `j` (justo), `aum` (aumentado) e `dim` (diminuto). São aceitos intervalos simples e compostos até a 22ª, incluindo `a9ma`, `d10me` e `a15j`.

Os atalhos `u`, `=` e as formas `a1j` e `d1j` são convertidos para `1j` no campo de texto. As primeiras aumentadas mantêm seus comandos direcionais.

O aplicativo preserva a grafia musical: Ré♯ e Mi♭ podem ter o mesmo som no temperamento igual, mas continuam sendo notas escritas de formas diferentes. Quando notas consecutivas têm a mesma altura e o mesmo nome, o gráfico identifica apenas a primeira delas.

## Músicas de demonstração

| Música | Nota inicial | Observações |
| --- | --- | --- |
| Marcha Soldado | Sol4 | Música inicial do aplicativo |
| O Cravo Brigou com a Rosa | Fá4 | Si♭ maior, um tom abaixo do MusicXML de referência |
| Ode à Alegria | Fá♯4 | Tema da Nona Sinfonia de Beethoven |

Ao carregar uma dessas músicas, seu **ritmo original** é selecionado automaticamente. Marcha Soldado e O Cravo Brigou com a Rosa preservam as durações e pausas dos arquivos MusicXML fornecidos. Ode à Alegria mantém o ritmo original da demonstração.

A opção **Ritmo original da música** recupera essas durações após experimentar outros padrões. As referências a Ode à Alegria aparecem apenas quando essa melodia está sendo exibida. O arquivo `o-cravo-brigou-com-a-rosa.musicxml` permanece na tonalidade original como referência.

## Contornos de paisagens e objetos

O seletor de demonstrações inclui **Montanhas, Vale entre montanhas, Ilha, Prédios, Castelo, Dunas, Ponte em arco e Veleiro**, com prévia da silhueta usada para gerar cada melodia.

Há contornos diatônicos em Dó maior e contornos cromáticos. As silhuetas são amostradas e convertidas em alturas. Amostras consecutivas na mesma altura são reunidas em uma única nota mais longa, preservando a largura do trecho. O ritmo escolhido ajusta essas durações.

## Ritmos, andamento e som

Há **30 padrões rítmicos gerais**, além dos seguintes espaçamentos:

- **Uniforme:** meio pulso por nota.
- **Quadrática:** espaçamentos crescentes de 0,25 a 1,25 pulsos.
- **Logarítmica:** espaçamentos crescentes entre os mesmos limites, com outro perfil de crescimento.
- **Cossenoidal:** variação suave entre 0,25 e 1,25 pulsos.
- **Fibonacci (intervalos):** ciclo 1, 1, 2, 3, 5, 8, 13, 21, dividido por 8.
- **Aleatória (exemplo fixo):** sequência determinística, igual a cada aplicação.

A mudança de ritmo altera os tempos e preserva as notas, os comandos e a nota inicial. Nos contornos, as durações também consideram a largura dos trechos agrupados. O painel de ritmo pode ser expandido para consultar os espaçamentos em pulsos.

O andamento é ajustável entre **40 e 220 BPM**. O som utiliza síntese FM com dois operadores senoidais e envelopes. A **reverberação** varia de 0% a 100%, começa em 25% e pode ser ajustada durante a reprodução.

## Missões musicais

Os controles **Armadura / tonalidade** e **Missão** aparecem um abaixo do outro.

As atividades incluem exploração diatônica, construção de exatamente **4 ou 8 notas**, contando a inicial, e criação de **8 notas com retorno à inicial**. No retorno, a última nota deve coincidir com a primeira em altura, grafia e oitava.

Também estão disponíveis:

- Escala maior ascendente e descendente.
- Escala menor natural ascendente e descendente.
- **X7M ou Xmaj7**.
- **X7**.
- **Xm7**.
- **Xm7(b5)**.
- **Xdim7**.
- **Xm(7M) ou Xm(maj7)**.
- **X6**.

**X representa a nota inicial escolhida.** As escalas incluem a oitava final. Os acordes são construídos como arpejos ascendentes: fundamental, terça, quinta e sétima ou sexta. A avaliação confere quantidade de notas, alturas e grafia dos graus. **Começar novo desafio** preserva a nota inicial nas missões de escalas e acordes.

### Restrição pela armadura de clave

A restrição é opcional e independente das novas missões. Alguns acordes exigem alterações fora da armadura escolhida. Com a restrição ativada, a grafia deve corresponder à coleção diatônica: uma nota enarmônica escrita de outra forma não é aceita.

Comandos completos são validados imediatamente; prefixos ainda em edição aguardam sua conclusão. Com a restrição ativada, comandos inválidos digitados ou colados são removidos, e os demais são reavaliados. O aplicativo mostra o erro e emite um aviso sonoro uma vez por tentativa recusada.

Alterar a armadura ou a nota inicial revalida o texto existente, permitindo corrigir a composição. A reprodução completa e o avanço por notas verificam a validade dos comandos antes de tocar.

## Relatório em PDF

Abaixo da caixa de intervalos estão **Nome do aluno** e **Gerar relatório em PDF**. Preencha o nome, clique no botão e selecione **Salvar como PDF** na janela de impressão do navegador.

O relatório contém apenas:

- Título **Micromundo dos intervalos** e subtítulo **Relatório da atividade musical**.
- Aluno e data e horário, no fuso **America/Sao_Paulo**.
- Melodia e nota inicial.
- Restrição pela armadura e armadura / tonalidade.
- Missão.
- Gráfico da melodia.
- Rodapé com **Desenvolvido com o app Micromundo dos intervalos** e o link do aplicativo.

O layout é preparado para uma página A4, com o rodapé na parte inferior. O relatório é montado no navegador, sem enviar o nome do aluno a um servidor.

## Fundamentação pedagógica

Abaixo da caixa de intervalos há um acordeão **Fundamentação pedagógica**, inicialmente fechado, com o texto completo sobre a proposta educativa do aplicativo.

O ambiente inspira-se no construcionismo de Seymour Papert: o estudante constrói um objeto musical, escuta e observa seus resultados, modifica os comandos e investiga relações. O erro pode apoiar a reflexão sobre intervalos, notas e regras musicais.

O aplicativo pode apoiar atividades de percepção, teoria musical, criação melódica, composição e formação de professores. A mediação docente, as perguntas propostas e as oportunidades de compartilhar e discutir as produções são importantes para a aprendizagem.

## Desenvolvimento e verificação

O aplicativo é uma página HTML com CSS e JavaScript incorporados, sem etapa de compilação. Os arquivos MusicXML são referências das cantigas; não precisam ser carregados pelo navegador para executar o app.

Com Node.js instalado, execute:

```sh
node tests/challenges.cjs
node tests/fm.cjs
node tests/songs.cjs
node tests/contours.cjs
node tests/spacing.cjs
node tests/missions-report.cjs
```

Os testes verificam comandos, validação, missões, durações originais das músicas, contornos, espaçamentos, configuração do áudio e conteúdo do relatório em um ambiente simulado. A reprodução audível, o diálogo de impressão e a aparência final do PDF precisam ser conferidos no navegador.

## Créditos

**Desenvolvimento:** Professor Dr. Glauber Santiago — Departamento de Artes e Comunicação (DAC/UFSCar).

**Apoio:** [Grupo de Pesquisa Horizonte](https://grupohorizonte.ufscar.br/).

**Website do docente:** [Glauber Santiago](https://servidores.ufscar.br/glauber/).

**Aplicativo:** [Micromundo dos intervalos](https://glauberlasantiago.github.io/micromundo-dos-intervalos/).
