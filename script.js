document.addEventListener("DOMContentLoaded", function () {
  const selectField = document.querySelector("#select-field");
  const selectUl = document.querySelector(".select-ul");
  const selectText = document.querySelector("#select-text");
  const listItems = document.querySelectorAll(".select-ul li");
  const arrowIcon = document.querySelector(".arrow-icon");
  const changeMode = document.querySelector("#change-mode");
  const cardFlex = document.querySelector(".card-flex");
  const searchCountry = document.querySelector("#search-country");
  const fullDataSection = document.querySelector(".full-data-section");
  const container = document.querySelector(".container");
  const backBtn = document.querySelector("#btn-back");
  ////////////////////////////////////////////////////////////
  selectField.addEventListener("click", function () {
    selectUl.classList.toggle("show");
    arrowIcon.classList.toggle("rotate");
  });

  //  light and dark mode
  changeMode.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
      changeMode.innerHTML = "☀️ Light Mode";
    } else {
      changeMode.innerHTML = '<i class="fa-regular fa-moon"></i>Dark Mode';
    }
  });

  // Geting data from API
  const getData = async () => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    data = await response.json();
    outputSelectHtml(data);
  };

  getData();

  async function searchText(searchvalue) {
    const response = await fetch("https://restcountries.com/v3.1/all");
    data = await response.json();

    let matches = data.filter((data) => {
      const regEx = new RegExp(`^${searchvalue}`, "gi");
      return data.name.common.match(regEx);
    });
    // console.log(matches);
    if (searchvalue.length === 0) {
      matches = [];
      cardFlex.innerHTML = " ";
      getData();
    }
    outputSelectHtml(matches);
  }

  searchCountry.addEventListener("keyup", () =>
    searchText(searchCountry.value)
  );

  // select field and option
  listItems.forEach((listItem) => {
    listItem.addEventListener("click", async function () {
      selectText.innerHTML = this.textContent;
      selectUl.classList.toggle("show");
      arrowIcon.classList.toggle("rotate");

      const response = await fetch("https://restcountries.com/v3.1/all");
      data = await response.json();

      let matches = data.filter((data) => {
        const regEx = new RegExp(`^${selectText.textContent}`, "gi");
        return data.region.match(regEx);
      });
      // console.log(matches.length === 0);
      if (matches.length === 0) {
        getData();
      } else {
        outputSelectHtml(matches);
      }
    });
  });

  // contverting data to html

  function outputSelectHtml(matches) {
    if (matches.length > 0) {
      // console.log(matches);

      const html = matches
        .map((match) => {
          return `<div class="country-card">
            <img src=${match.flags.png} alt="" />
             <div class="card-text">
            <h4>${match.name.common}</h4>
               <p>
                Population:
             <span>${match.population}</span>
               </p>
              <p>
                 Region:
                 <span>${match.region}</span>
               </p>
               <p>
                 Capital:
                <span>${match.capital}</span>
               </p>
             </div>
           </div>`;
        })
        .join("");
      // console.log(html);

      cardFlex.innerHTML = html;

      const countryCards = document.querySelectorAll(".country-card");
      countryCards.forEach((card) => {
        card.addEventListener("click", function (e) {
          const countryData = matches.find(
            (data) =>
              data.name.common ===
              this.children[1].firstElementChild.textContent
          );
          fullDataSection.classList.toggle("show-container");
          container.classList.toggle("show-container");
          fullDataHtml(countryData);
        });
      });
    }
  }

  function fullDataHtml(data) {
    // console.log(data.borders);
    let border;
    if (data.borders !== undefined) {
      border = data?.borders
        ?.map(
          (border) => `<span class="full-data-border-span">${border}</span>`
        )
        .join("");
    } else {
      border = `<span class="full-data-border-span">world</span>`;
    }

    const html = `<div class="full-data">
          <img src=${data.flags.png} alt="" />

          <div class="full-data-text">
            <div class="full-data-name">
              <h1>${data.name.common}</h1>
              <p>Native Name: <span>${
                Object.values(data?.name?.nativeName)[1]?.official === undefined
                  ? Object.values(data?.name?.nativeName)[0]?.official
                  : Object.values(data?.name?.nativeName)[1]?.official
              }</span></p>
              <p>Population: <span>${data.population}</span></p>
              <p>Region: <span>${data.region}</span></p>
              <p>Sub Region: <span>${data.subregion}</span></p>
              <p>Capital: <span>${data.capital}</span></p>
            </div>
            <div class="full-data-name">
              <p>Area: <span>${data.area}</span></p>
              <p>Currencies: <span>${
                Object.values(data?.currencies)[0].name
              }</span></p>
              <p>Languages: <span>${
                Object.values(data?.languages)[1] === undefined
                  ? Object.values(data?.languages)[0]
                  : Object.values(data?.languages)[1]
              }</span></p>
            </div>
            <div class="full-data-border">
              <p>
                Border Countries:
              </p>
              <p>
               ${border}
              </p>

            </div>
          </div>
        </div>`;
    const fullDataDiv = document.querySelector(".full-data-div");

    fullDataDiv.innerHTML = html;
  }

  backBtn.addEventListener("click", () => {
    fullDataSection.classList.toggle("show-container");
    container.classList.toggle("show-container");
  });
});
