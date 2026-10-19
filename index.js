
import express from "express";
import axios from "axios";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

// Homepage
app.get("/", (req, res) => {
  res.render("index");
});

// Search books
app.get("/search", async (req, res) => {
  const query = req.query.q?.trim();
  if (query && query.length > 100) {
  return res.status(400).send("Search query is too long. Please use 100 characters or fewer.");
}

  if (!query) {
    return res.redirect("/");
  }

  try {
    const response = await axios.get(
      "https://openlibrary.org/search.json",
      {
        params: {
          q: query,
          limit: 12,
          fields: "title,author_name,first_publish_year,cover_i,key"
        }
      }
    );

    const books = response.data.docs;

    res.render("results", {
      books: books,
      query: query,
      errorMessage: null
    });

  } catch (error) {
    console.error("Book search failed:", error.message);

    res.status(502).render("results", {
      books: [],
      query: query,
      errorMessage: "We couldn't retrieve books right now. Please try again."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Book Corner is running at http://localhost:${PORT}`);
});
