const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());
app.use(express.json());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    return res.send(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).end();
  }
  if (persons.find((p) => p.name === body.name)) {
    return res.status(409).send({ error: "name must be unique" });
  }
  const newPerson = {
    name: body.name,
    number: body.number,
  };
  newPerson.id = parseInt(Math.random() * 10000).toString();
  persons = persons.concat(newPerson);
  res.send(newPerson);
});

app.get("/info", (req, res) => {
  const len = persons.length;
  const now = new Date();
  const reply = `<p>Phonebook has info for ${len} people</p> <p>${now}</p>`;
  res.send(reply);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("App is listening on port 3001 . . .");
});
