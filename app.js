const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const costsHandlers = require('./costs-handlers');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/costs', costsHandlers.createCosts);
app.get('/api/costs', costsHandlers.getCosts);
app.get('/api/costs/:costId', costsHandlers.getCostsById);
app.put('/api/costs/:costId', costsHandlers.updateCostsById);
app.delete('/api/costs/:costId', costsHandlers.deleteCostsById);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(8080, () => console.log(`Server running: http://localhost:8080`));
