const express = require("express");
const server = express();

//Define formato json como requisições e respostas
server.use(express.json());

//Cria o array dos projetos
const projects = [];

//Cria a variável que receberá a quantidade de requisições
let numberRequests = 0;

//Middleware que checa se o projeto existe
function checkProjectIdExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ erro: "Projeto não encontrado com este ID" });
  }

  return next();
}

//Middleware que registra quantidade de requisições efetuadas até o momento
function countNumberRequests(req, res, next) {
  numberRequests++;

  console.log(`Quantidade de requisições: ${numberRequests}`);

  return next();
}

//ROTAS

//GET: /projects
server.get("/projects", countNumberRequests, (req, res) => {
  return res.json(projects);
});

//POST: /projects
server.post("/projects", countNumberRequests, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

//PUT: /projects/1
server.put(
  "/projects/:id",
  checkProjectIdExists,
  countNumberRequests,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);

    project.title = title;

    return res.json(projects);
  }
);

//DELETE: /projects/1
server.delete(
  "/projects/:id",
  checkProjectIdExists,
  countNumberRequests,
  (req, res) => {
    const { id } = req.params;

    const index = projects.findIndex(p => p.id === id);

    projects.splice(index, 1);

    return res.send();
  }
);

//POST para incluir as tarefas: /projects/1/tasks
server.post(
  "/projects/:id/tasks",
  checkProjectIdExists,
  countNumberRequests,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);

    project.tasks.push(title);

    return res.json(projects);
  }
);

server.listen(3000);
