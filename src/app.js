const express = require('express');
const cors = require('cors');
const { uuid }  = require('uuidv4');

const validateBodyRequest = require('./middlewares/validateBodyRequest');
const validateRepositoryId = require('./middlewares/validateRepositoryId');

const app = express();

app.use(cors());
app.use(express.json());

const repositories = [];

app.use('/repositories/:id', validateRepositoryId);
app.post('/repositories', validateBodyRequest, (req, res) => {
    const { title, url, techs } = req.body;

    const repository = {
        id: uuid(),
        url,
        title,
        techs,
        likes: 0
    }

    repositories.push(repository);

    return res.json(repository);
})

app.get('/repositories', (req, res) => {
    const { title, techs } = req.query;

    let results = repositories;

    if (title && techs) {
        const parsedTechs = String(techs).split('+').join(', ');
        results = repositories.filter(repository => (
            repository.title.includes(title) && repository.techs.join(', ').includes(parsedTechs)
        ))

        return res.json(results);
    }

    if (techs && !title) {
        const parsedTechs = String(techs).split('+').join(', ');
        results = repositories.filter(repository => (
            repository.techs.join(', ').includes(parsedTechs)
        ))

        return res.json(results);
    }

    if (title && !techs) {
        results = repositories.filter(repository => (
            repository.title.includes(title)
        ))

        return res.json(results);
    }

    return res.json(results);
})

app.put('/repositories/:id', (req, res) => {
    const { id } = req.params;
    const { title, url, techs } = req.body;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    const repository = {
        id,
        url,
        title,
        techs,
        likes: 0
    }

    repositories[repositoryIndex] = repository;

    return res.json(repository);
})

app.delete('/repositories/:id', (req, res) => {
    const { id } = req.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    repositories.splice(repositoryIndex, 1);

    return res.status(204).send();
})

app.post('/repositories/:id/like', (req, res) => {
    const { id } = req.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    repositories[repositoryIndex].likes += 1;

    return res.json(repositories[repositoryIndex]);
})

module.exports = app;