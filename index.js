const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json()); // Con esto se usa Body Parser, te devuelve lo que creaste con el POST
app.use(cors());

let notes = [
  {
    id: 1,
    content: 'este es un contenido de relleno xd',
    important: true,
  },
  {
    id: 2,
    content: 'Otro contenido para pruebas de API',
    important: false,
  },
  {
    id: 3,
    content: "Hey! how's it goin'? this is another content",
    important: true,
  },
];

app.get('/', (request, response) => {
  response.send('<h2>Hey! Hello World perro</h2>').status(200);
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  note ? response.json(note) : response.status(404).end();
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id !== id);
  response.status(204).end();
});

app.post('/api/notes', (request, response) => {
  const note = request.body;
  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing',
    });
  }
  const ids = notes.map((note) => note.id);
  const maxIds = Math.max(...ids);
  const newNote = {
    id: maxIds + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
  };
  notes = [...notes, newNote]; // notes = notes.concat(newNote)
  response.json(newNote).status(201);
});

// Middleware
app.use((request, response, next) => {
  const pathRequest = request.path;
  response.status(404).json({
    error: `${pathRequest} Does not exist`,
  });
});

const PORT = 3001;
// Listen es Asincrono, le pasamos un callback que se ejecuta solo cuando ya se
// levanto el server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
