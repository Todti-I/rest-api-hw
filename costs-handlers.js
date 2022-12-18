const uuid = require('uuid');
const fs = require('fs');

if (!fs.existsSync('./costs.json')) {
  fs.writeFileSync('./costs.json', JSON.stringify([]));
}

process.on('SIGINT', () => {
  fs.writeFileSync('./costs.json', JSON.stringify([...costs.values()]));
  console.log('Saved costs.json');
});

const costs = new Map(
  require('./costs.json').map((costs) => [
    costs.id,
    { ...costs, time: new Date(costs.time) },
  ])
);

const createCosts = (req, res) => {
  let { rublesCount, time } = req.body;

  rublesCount = parseFloat(rublesCount);
  time = new Date(time);

  if (Number.isNaN(rublesCount)) {
    return res.status(400).send('Invalid rublesCount');
  }
  if (time.toString() === 'Invalid Date') {
    return res.status(400).send('Invalid time');
  }

  const newCosts = {
    id: uuid.v4(),
    rublesCount,
    time,
  };

  costs.set(newCosts.id, newCosts);

  return res.status(201).send(newCosts);
};

const getCosts = (_, res) => {
  const sortedCosts = [...costs.values()].sort(
    (a, b) => b.time.getTime() - a.time.getTime()
  );

  return res.status(200).send(sortedCosts);
};

const getCostsById = (req, res) => {
  const currentCosts = costs.get(req.params.costId);

  if (!currentCosts) {
    return res.status(404).send('Not found costs');
  }

  return res.status(200).send(currentCosts);
};

const updateCostsById = (req, res) => {
  let currentCosts = costs.get(req.params.costId);

  if (!currentCosts) {
    return res.status(404).send('Not found costs');
  }

  if (req.body.rublesCount) {
    const rublesCount = parseFloat(req.body.rublesCount);

    if (Number.isNaN(rublesCount)) {
      return res.status(400).send('Invalid rublesCount');
    } else {
      currentCosts.rublesCount = rublesCount;
    }
  }

  if (req.body.time) {
    const time = new Date(req.body.time);

    if (time.toString() === 'Invalid Date') {
      return res.status(400).send('Invalid time');
    } else {
      currentCosts.time = time;
    }
  }

  costs.set(currentCosts.id, currentCosts);

  return res.status(201).send(currentCosts);
};

const deleteCostsById = (req, res) => {
  const idDeleted = costs.delete(req.params.costId);

  if (!idDeleted) {
    return res.status(404).send('Not found costs');
  }

  return res.status(204).send();
};

module.exports = {
  createCosts,
  getCosts,
  getCostsById,
  updateCostsById,
  deleteCostsById,
};
