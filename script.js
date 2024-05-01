function Elements(tag, classname, id, text) {
  const tags = document.createElement(tag);
  tags.id = id;
  tags.classList = classname;
  tags.innerHTML = text;
  return tags;
}

const container = Elements("div", "container", "", "");
const Heading = Elements("div", "text-center", "title", "<h1>Bible Verses</h1>");
const row = Elements("div", "row", "", "");

// Define the range of books, chapters, and verses you want to fetch
const books = ["Genesis", "Exodus", "Leviticus", "Numbers" ];
const startChapter = 1;
const endChapter = 50; // Adjust this based on the number of chapters in the last book you want to fetch

// Function to fetch verses for a specific book and chapter
function fetchVerses(book, chapter) {
  return fetch(`https://bible-api.com/${book}+${chapter}`)
    .then(response => response.json())
    .catch(error => console.error("Error fetching data:", error));
}

// Iterate through each book and chapter, fetching verses
Promise.all(books.map(book => {
  const promises = [];
  for (let chapter = startChapter; chapter <= endChapter; chapter++) {
    promises.push(fetchVerses(book, chapter));
  }
  return Promise.all(promises);
}))
.then(allBooksData => {
  allBooksData.forEach((bookData, bookIndex) => {
    const bookName = books[bookIndex];
    bookData.forEach((chapterData, chapterIndex) => {
      const chapterNumber = startChapter + chapterIndex;
      const cardCol = document.createElement("div");
      cardCol.className = "col-sm-6 col-md-4 col-lg-4 col-xl-4";
      
      const card = document.createElement("div");
      card.className = "card h-100";
      card.innerHTML = `
          <div class="card-header">
              <h5 class="card-text">${bookName} ${chapterNumber}</h5>
          </div>
          <div class="card-body">
              <div class="card-text">${chapterData.verses.map(verse => `<p>${verse.text}</p>`).join('')}</div>
          </div>
      `;
      
      cardCol.appendChild(card);
      row.appendChild(cardCol);
    });
  });
})
.catch(error => console.error("Error fetching Bible:", error));

container.append(Heading, row);
document.body.appendChild(container);
