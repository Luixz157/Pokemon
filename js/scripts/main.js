const slide_hero = new Swiper(".slide-hero", {
  pagination: {
    el: ".s-area-slide-hero .slide-hero .main-area .area-explore .swiper-pagination",
  },
  effect: "fade",
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  keyboard: {
    enabled: true,
  },
});

// AQUI É O CONTEÚDO DA AULA PARA LISTAR POKEMONS

// Funcao para deixar a primeira letra maiscula do pokemon
function primeiraLetraMaiuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Aqui é o geral para listar pokemons
const areaPokemons = document.getElementById("js-list-pokemons"); // Mapeando a area da listagem dos pokemon

// criacao do html do card do pokemon atraves do Javascript
function createCardPokemon(code, type, nome, imagePok) {
  // Criando a div pai do card
  let card = document.createElement("button");
  card.classList = `card-pokemon ${type} js-open-pokemon`;
  card.setAttribute("idpokemon", code);
  areaPokemons.appendChild(card);

  // criando a div da imagem dentro do card
  let image = document.createElement("div");
  image.classList = "image";
  card.appendChild(image);

  // criando a imagem dentro da div imagem
  let imageSrc = document.createElement("img");
  imageSrc.setAttribute("src", imagePok);
  image.appendChild(imageSrc);

  //criando a div info dentro do card
  let infoCardPokemon = document.createElement("div");
  infoCardPokemon.classList = "info";
  card.appendChild(infoCardPokemon);

  //criando a div que traz o code e o nome
  let divNameCode = document.createElement("div");
  infoCardPokemon.appendChild(divNameCode);

  // criando o elemento de codigo do pokemon
  let codePokemon = document.createElement("span");
  codePokemon.textContent =
    code < 10 ? `#00${code}` : code < 100 ? `#0${code}` : `#${code}`;
  divNameCode.appendChild(codePokemon);

  // criando o elemento de nome do pokemon;
  let namePokemon = document.createElement("strong");
  namePokemon.textContent = primeiraLetraMaiuscula(nome);
  divNameCode.appendChild(namePokemon);

  // criando a area do icone do tipo
  let iconTypePokemon = document.createElement("div");
  iconTypePokemon.classList = `icon`;
  infoCardPokemon.appendChild(iconTypePokemon);

  // criando a imagem do icone do pokemon
  let iconImagePokemon = document.createElement("img");
  iconImagePokemon.setAttribute("src", `img/${type}.svg`);
  iconTypePokemon.appendChild(iconImagePokemon);
}

//lista os pokemons na area selecionada
function listingPokemons(url) {
  axios({
    method: "GET",
    url: url,
  }).then((response) => {
    const { results } = response.data;

    countPoks.textContent = response.data.count;

    results.forEach((pokemon) => {
      let url = pokemon.url;

      axios({
        method: "GET",
        url: `${url}`,
      }).then((response) => {
        const { name, id, sprites, types } = response.data;

        const infoCard = {
          nome: name,
          code: id,
          image: sprites.other.dream_world.front_default,
          type: types[0].type.name,
        };

        createCardPokemon(
          infoCard.code,
          infoCard.type,
          infoCard.nome,
          infoCard.image
        );

        // eventos de clique para abrir o modal
        const cardPokemon = document.querySelectorAll(".js-open-pokemon");
        cardPokemon.forEach((card) => {
          card.addEventListener("click", openDetailsPokemon);
        });
      });
    });
  });
}

listingPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");

// AQUI TERMINA O CONTEÚDO DA AULA PARA LISTAR POKEMONS

// scripts do detalhes do pokemon
const btnCloseDetailsPokemon = document.querySelector(
  ".js-close-details-pokemon"
);

const bgModalPokemon = document.querySelector(".modal .left-container");
const iconTypeModalPokemon = document.querySelector(
  ".modal .box .left-container .icon img"
);
const imgModalPokemon = document.getElementById("js-image-pokemon");
const nomeModalPokemon = document.querySelector(
  ".modal .box .right-container .name h2"
);
const idModalPokemon = document.querySelector(
  ".modal .box .right-container .name span"
);
const typesModalPokemon = document.querySelector(
  ".modal .box .right-container .type"
);
const WeakModalPokemon = document.querySelector(
  ".modal .box .right-container .weak ul"
);
const heightModalPokemon = document.getElementById("js-pok-height");
const weightModalPokemon = document.getElementById("js-pok-weight");
const abilitieModalPokemon = document.getElementById("js-pok-abilitie");
const buttonShowMoreAbilities = document.getElementById(
  "js-show-more-abilities"
);
const ballonAbilities = document.getElementById("js-ballon-abilities");

const statsHpModalPokemon = document.getElementById("js-bar-hp");
const statsAttackModalPokemon = document.getElementById("js-bar-attack");
const statsDefenseModalPokemon = document.getElementById("js-bar-defense");
const statsSpAttackModalPokemon = document.getElementById("js-bar-sp-attack");
const statsSpDefenseModalPokemon = document.getElementById("js-bar-sp-defense");
const statsSpeedModalPokemon = document.getElementById("js-bar-speed");

// FUNCAO PARA ABRIR OS DETALHES
function openDetailsPokemon() {
  // Abrir modal
  document.documentElement.classList.add("open-modal");

  // Selecionar os elementos que ja estao na thumb do pokemon para trazer pro modal
  let idPok = this.getAttribute("idPokemon");
  let imagePok = this.firstElementChild.firstElementChild.getAttribute("src");
  let iconType =
    this.lastElementChild.lastElementChild.firstElementChild.getAttribute(
      "src"
    );

  imgModalPokemon.setAttribute("src", imagePok);
  iconTypeModalPokemon.setAttribute("src", iconType);

  // Chamada a API pra trazer as informacoes
  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${idPok}/`,
  }).then((response) => {
    let data = response.data;

    //Aqui eu crio um objeto só para organizar os itens que eu preciso.
    let infoPokemon = {
      id: idPok,
      mainType: data.types[0].type.name,
      name: primeiraLetraMaiuscula(data.name),
      types: data.types,
      urlType: data.types[0].type.url,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities,
      stats: data.stats,
    };

    // Funcao para lista os typos do pokemon
    function listingTypesPokemon() {
      let typesArray = infoPokemon.types;

      typesModalPokemon.innerHTML = "";

      typesArray.forEach((typeItem) => {
        let list = document.createElement("li");
        list.textContent = primeiraLetraMaiuscula(typeItem.type.name);
        list.classList = `tag ${typeItem.type.name}`;

        typesModalPokemon.appendChild(list);
      });
    }

    // funcao para listar as fraquezas do pokemon
    function listingWeaknesses() {
      WeakModalPokemon.innerHTML = "";

      axios({
        method: "GET",
        url: `${infoPokemon.urlType}`,
      }).then((response) => {
        let weaknessess = response.data.damage_relations.double_damage_from;

        weaknessess.forEach((weakItem) => {
          let list = document.createElement("li");
          list.textContent = primeiraLetraMaiuscula(weakItem.name);
          list.classList = `tag ${weakItem.name}`;

          WeakModalPokemon.appendChild(list);
        });
      });
    }

    // Preenchendo as informacoes
    bgModalPokemon.setAttribute("bgType", infoPokemon.mainType);
    nomeModalPokemon.textContent = infoPokemon.name;
    idModalPokemon.textContent =
      infoPokemon.id < 10
        ? `#00${infoPokemon.id}`
        : infoPokemon.id < 100
        ? `#0${infoPokemon.id}`
        : `#${infoPokemon.id}`;

    heightModalPokemon.textContent = `${infoPokemon.height / 10}m`;
    weightModalPokemon.textContent = `${infoPokemon.weight / 10}kg`;
    abilitieModalPokemon.textContent = primeiraLetraMaiuscula(
      infoPokemon.abilities[0].ability.name
    );

    if (data.abilities.length === 1) {
      buttonShowMoreAbilities.style.display = "none";
    }

    buttonShowMoreAbilities.classList = `tag ${infoPokemon.mainType}`;
    ballonAbilities.innerHTML = "";
    ballonAbilities.classList = `ballon ${infoPokemon.mainType}`;
    data.abilities.forEach((abilities, index) => {
      if (index > 0) {
        let itemType = document.createElement("strong");
        itemType.textContent = primeiraLetraMaiuscula(abilities.ability.name);
        ballonAbilities.appendChild(itemType);
      }
    });

    //aqui eu estou setando todos os stats do pokemon
    statsHpModalPokemon.style.width = `${data.stats[0].base_stat}%`;
    statsAttackModalPokemon.style.width = `${data.stats[1].base_stat}%`;
    statsDefenseModalPokemon.style.width = `${data.stats[2].base_stat}%`;
    statsSpAttackModalPokemon.style.width = `${data.stats[3].base_stat}%`;
    statsSpDefenseModalPokemon.style.width = `${data.stats[4].base_stat}%`;
    statsSpeedModalPokemon.style.width = `${data.stats[5].base_stat}%`;

    listingTypesPokemon();
    listingWeaknesses();
  });
}

// funcao para fechar o modal
function closeDetailsPokemon() {
  document.documentElement.classList.remove("open-modal");
}
btnCloseDetailsPokemon.addEventListener("click", closeDetailsPokemon);

// aqui é o script que mostrar mais das habilidades
buttonShowMoreAbilities.addEventListener("click", () => {
  buttonShowMoreAbilities.parentElement.classList.toggle("active");
});

buttonShowMoreAbilities.addEventListener("mouseleave", () => {
  buttonShowMoreAbilities.parentElement.classList.remove("active");
});

// funcao de mostrar mais pokemons
const countPoks = document.querySelector(".js-count-pokemons");

let countPagination = 10;

function showMorePokemon() {
  listingPokemons(
    `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`
  );

  countPagination = countPagination + 9;
}

const btnShowMore = document.getElementById("js-show-more");
btnShowMore.addEventListener("click", showMorePokemon);

// script da filtragem de pokemons por tipo
const areaTypes = document.getElementById("js-area-types");
const areaTypesSelect = document.querySelector(
  ".select-custom .dropdown-select"
);

axios({
  method: "GET",
  url: "https://pokeapi.co/api/v2/type/",
}).then((response) => {
  let allTypes = response.data.results;

  allTypes.forEach((type, index) => {
    if (index < 18) {
      // Criando a botao do tipo do pokemon na filtragem
      let itemType = document.createElement("li");
      areaTypes.appendChild(itemType);

      let itemTypeSelect = document.createElement("li");
      areaTypesSelect.appendChild(itemTypeSelect);

      // criando o botão do tipo
      let buttonType = document.createElement("button");
      buttonType.classList = `js-filter-type-pokemon ${type.name}`;
      buttonType.setAttribute("code-type", index + 1);
      itemType.appendChild(buttonType);

      // criando o icon do tipo
      let iconType = document.createElement("div");
      iconType.classList = "icon";
      buttonType.appendChild(iconType);

      // criando o imagem do tipo
      let imgType = document.createElement("img");
      imgType.setAttribute("src", `img/${type.name}.svg`);
      iconType.appendChild(imgType);

      // criando o texto do tipo
      let nameType = document.createElement("span");
      nameType.textContent = primeiraLetraMaiuscula(type.name);
      buttonType.appendChild(nameType);

      // aqui eu paro para verificar se tem como melhorar este código
      let buttonTypeSelect = document.createElement("button");
      buttonTypeSelect.classList = `js-filter-type-pokemon ${type.name}`;
      buttonTypeSelect.setAttribute("code-type", index + 1);
      itemTypeSelect.appendChild(buttonTypeSelect);

      let iconTypeSelect = document.createElement("div");
      iconTypeSelect.classList = "icon";
      buttonTypeSelect.appendChild(iconTypeSelect);

      let imgTypeSelect = document.createElement("img");
      imgTypeSelect.setAttribute("src", `img/${type.name}.svg`);
      iconTypeSelect.appendChild(imgTypeSelect);

      let nameTypeSelect = document.createElement("span");
      nameTypeSelect.textContent = primeiraLetraMaiuscula(type.name);
      buttonTypeSelect.appendChild(nameTypeSelect);

      // iniciar a aula mapeando os botoes do filtro
      const allButtons = document.querySelectorAll(".js-filter-type-pokemon");

      allButtons.forEach((button) => {
        button.addEventListener("click", filterByTypes);
      });
    }
  });
});

function filterByTypes() {
  // aqui estou limpando toda a area dos pokemons
  areaPokemons.innerHTML = "";

  // aqui pego o campo de pesquisa para limpar
  inputSearch.value = "";
  btnSearch.disabled = true;

  // aqui estou removendo o active a tivando somente no que esta clicavel
  const allButtonsType = document.querySelectorAll(
    ".s-all-info-pokemons .area-all .left-container ul li button"
  );

  allButtonsType.forEach((button) => {
    button.classList.remove("active");
  });
  this.classList.add("active");

  //aqui dou o scroll até o topo da sessão por questao de usabilidade
  const sectionPokemons = document.querySelector(".s-all-info-pokemons");
  const topSection = sectionPokemons.offsetTop;

  window.scrollTo({
    top: topSection + 288,
    behavior: "smooth",
  });

  let codeType = this.getAttribute("code-type");

  if (codeType) {
    btnShowMore.style.display = "none";
    axios({
      method: "GET",
      url: `https://pokeapi.co/api/v2/type/${codeType}`,
    }).then((response) => {
      let allPokemonsByType = response.data.pokemon;

      countPoks.textContent = allPokemonsByType.length;

      allPokemonsByType.forEach((pok) => {
        const { url } = pok.pokemon;

        axios({
          method: "GET",
          url: `${url}`,
        }).then((response) => {
          // aqui pode copiar igual ta no listing pokemons
          const { name, id, sprites, types } = response.data;

          const infoCard = {
            nome: name,
            code: id,
            image: sprites.other.dream_world.front_default,
            type: types[0].type.name,
          };

          if (infoCard.image !== null) {
            createCardPokemon(
              infoCard.code,
              infoCard.type,
              infoCard.nome,
              infoCard.image
            );
          }

          const cardPokemon = document.querySelectorAll(".js-open-pokemon");

          // eventos de clique para abrir o modal
          cardPokemon.forEach((card) => {
            card.addEventListener("click", openDetailsPokemon);
          });
        });
      });
    });
  } else {
    btnShowMore.style.display = "block";
    listingPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");
    countPoks.textContent = 9;
  }

  // Aqui é um simples script para o select do mobile

  areaTypesSelect.parentElement.classList.remove("active");
  let typeSelected = this.lastElementChild.textContent;

  areaTypesSelect.parentElement.firstElementChild.lastElementChild.textContent =
    typeSelected;
}

//script da parte de pesquisa do pokemon
const inputSearch = document.getElementById("js-input-search");
const btnSearch = document.getElementById("js-btn-search-pokemon");
btnSearch.disabled = true;

function searchPokemon() {
  const allButtonsType = document.querySelectorAll(".js-filter-type-pokemon");

  allButtonsType.forEach((button) => {
    button.classList.remove("active");
  });

  let valueInput =
    btnSearch.parentElement.firstElementChild.value.toLowerCase();

  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`,
  })
    .then((response) => {
      areaPokemons.innerHTML = "";
      btnShowMore.style.display = "none";
      countPoks.textContent = 1;

      const { name, id, sprites, types } = response.data;

      const infoCard = {
        nome: name,
        code: id,
        image: sprites.other.dream_world.front_default,
        type: types[0].type.name,
      };

      createCardPokemon(
        infoCard.code,
        infoCard.type,
        infoCard.nome,
        infoCard.image
      );

      const cardPokemon = document.querySelectorAll(".js-open-pokemon");

      // eventos de clique para abrir o modal
      cardPokemon.forEach((card) => {
        card.addEventListener("click", openDetailsPokemon);
      });
    })
    .catch((error) => {
      if (error.response) {
        countPoks.textContent = 0;
        areaPokemons.innerHTML = "";
        btnShowMore.style.display = "none";
        console.log("Erro da requisicao");
      }
    });
}

btnSearch.addEventListener("click", searchPokemon);

inputSearch.addEventListener("keyup", (event) => {
  if (inputSearch.value.length > 0) {
    btnSearch.disabled = false;
  } else {
    btnSearch.disabled = true;
  }
  if (event.code === "Enter") {
    searchPokemon();
  }
});

const selectCustom = document.querySelector(".js-select-custom");

function openSelectCustom() {
  this.parentElement.classList.toggle("active");
}

selectCustom.addEventListener("click", openSelectCustom);
