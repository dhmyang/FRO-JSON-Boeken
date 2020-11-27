const output = document.getElementById("boeken");
const request = new XMLHttpRequest();
const taalfilters = document.querySelectorAll(".control__cb");
const selectSort = document.querySelector(".control__select");
const amountCart = document.querySelector(".cart__amount");
request.onreadystatechange = () => {
  if (request.readyState === 4 && request.status === 200) {
    let result = JSON.parse(request.responseText);
    books.filter(result);
    books.run();
  } else {
    console.log("readystate: " + request.readyState);
    console.log("status: " + request.status);
  }
};
request.open("GET", "boeken.json", true);
request.send();

const cart = {
  order: [],
};

const books = {
  allLangu: ["Nederlands", "Chinees", "Engels"],
  es: "titel",
  oplopend: 1,

  // filter taal
  filter(info) {
    this.data = info.filter((book) => {
      let bool = false;
      this.allLangu.forEach((taal) => {
        if (book.taal === taal) {
          bool = true;
        }
      });
      return bool;
    });
  },

  // sorteer functie
  sortAll() {
    if (this.es === "titel") {
      this.data.sort((a, b) =>
        a.titel.toUpperCase() > b.titel.toUpperCase()
          ? this.oplopend
          : -1 * this.oplopend
      );
    } else if (this.es === "paginas") {
      this.data.sort((a, b) =>
        a.paginas > b.paginas ? this.oplopend : -1 * this.oplopend
      );
    } else if (this.es === "uitgave") {
      this.data.sort((a, b) =>
        a.uitgave > b.uitgave ? this.oplopend : -1 * this.oplopend
      );
    } else if (this.es === "prijs") {
      this.data.sort((a, b) =>
        a.prijs > b.prijs ? this.oplopend : -1 * this.oplopend
      );
    } else if (this.es === "auteur") {
      this.data.sort((a, b) =>
        a.auteurs[0].achternaam > b.auteurs[0].achternaam
          ? this.oplopend
          : -1 * this.oplopend
      );
    }
  },

  // make data
  run() {
    // sort everything first
    this.sortAll();
    let html = "";
    this.data.forEach((book) => {
      // put infront of titel
      let title = "";
      if (book.voortitel) {
        title += book.voortitel + " ";
      }
      title += book.titel;
      // List of Autors
      let auteurs = "";
      book.auteurs.forEach((auteur, index) => {
        let mid = auteur.tussenvoegsel ? auteur.tussenvoegsel + " " : "";
        // scheidingsteken tussen auteurs
        let separator = ", ";
        if (index >= book.auteurs.length - 2) {
          separator = " & ";
        }
        if (index >= book.auteurs.length - 1) {
          separator = "";
        }
        auteurs += auteur.voornaam + " " + mid + auteur.achternaam + separator;
      });

      html += `<section class="book">`;
      html += `<img class ="book__cover" src ="${book.cover}" alt"${title}">`;
      html += `<div class="book__info">`;
      html += `<h3 class="book__titel">${title}</h3>`;
      html += `<p class="book__authors">${auteurs}</p>`;
      html += `<span class="book__edition">${this.changingDate(
        book.uitgave
      )}</span>`;
      html += `<span class="book__ean">ean: ${book.ean}</span>`;
      html += `<span class="book__pages">${book.paginas} pagina's</span>`;
      html += `<span class="book__lang">${book.taal}</span>`;
      html += `<div class="book__price">${book.prijs.toLocaleString("nl-NL", {
        currency: "EUR",
        style: "currency",
      })}
                <a href="#" class="book__order" data-role="${
                  book.ean
                }">bestellen</a></div>`;
      html += `</div></section>`;
    });
    output.innerHTML = html;
    document.querySelectorAll(".book__order").forEach((knop) => {
      knop.addEventListener("click", (e) => {
        e.preventDefault();
        let bookID = e.target.getAttribute("data-role");
        let clickedBook = this.data.filter((b) => b.ean == bookID);
        cart.order.push(clickedBook[0]);
        amountInCart.innerHTML = ww.bestelling.length;
      });
    });
  },
  changingDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = this.giveMonthName(date.getMonth());
    return `${month} ${year}`;
  },
  giveMonthName(m) {
    let month = "";
    switch (m) {
      case 0:
        month = "januari";
        break;
      case 1:
        month = "februari";
        break;
      case 2:
        month = "maart";
        break;
      case 3:
        month = "april";
        break;
      case 4:
        month = "mei";
        break;
      case 5:
        month = "juni";
        break;
      case 6:
        month = "juli";
        break;
      case 7:
        month = "augustus";
        break;
      case 8:
        month = "september";
        break;
      case 9:
        month = "oktober";
        break;
      case 10:
        month = "november";
        break;
      case 11:
        month = "december";
        break;
      default:
        month = m;
    }
    return month;
  },
};

const applyFilter = () => {
  let checkedLang = [];
  taalfilters.forEach((cb) => {
    if (cb.checked) checkedLang.push(cb.value);
  });
  books.allLangu = checkedLang;
  books.filter(JSON.parse(request.responseText));
  books.run();
};

const changeSort = () => {
  books.es = selectSort.value;
  books.run();
};

taalfilters.forEach((cb) => cb.addEventListener("change", applyFilter));
selectSort.addEventListener("change", changeSort);
document.querySelectorAll(".controls__rb").forEach((rb) =>
  rb.addEventListener("change", () => {
    books.oplopend = rb.value;
    books.run();
  })
);
