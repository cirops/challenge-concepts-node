const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepo);
  return response.status(200).json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const repoId = request.params.id;

  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === repoId);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository ID not found." });
  }

  const changedRepo = {
    id: repoId,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = changedRepo;

  return response.json(changedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const repoId = request.params.id;
  const repoIndex = repositories.findIndex((repo) => repo.id === repoId);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository ID not found." });
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const repoId = request.params.id;
  const repoIndex = repositories.findIndex((repo) => repo.id === repoId);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository ID not found." });
  }

  repositories[repoIndex].likes += 1;
  return response.status(200).json(repositories[repoIndex]);
});

module.exports = app;
