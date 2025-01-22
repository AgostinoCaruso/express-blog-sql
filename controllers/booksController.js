import CustomError from "../classes/CustomError.js";
import connection from "../connection.js";

function index(req, res) {
  const sql = `SELECT * FROM pizzas`;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({
      error: `Database query failed`
    });
    res.json(results);
  })
}

function show(req, res) {
  const id = req.params.id

  const sql = 
  `SELECT pizzas.id, pizzas.name AS pizza_name, ingredients.name AS ingredient_name
  FROM pizzas
  JOIN ingredient_pizza
    ON pizzas.id = ingredient_pizza.pizza_id
  JOIN ingredients
    ON ingredient_pizza.ingredient_id = ingredients.id
  WHERE pizzas.id = ?`;

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({
      error: 'Database query failed'
    });
    if (results.length === 0) return res.status(404).json({
      error: 'Pizza not found'
    });
    const response= {
      id: results[0].id,
      pizza_name: results[0].pizza_name,
      ingredients: results.map(ele => ele.ingredient_name),
    };
    res.json(response);
  });
}

function store(req, res) {
  let newId = 0;
  for (let i = 0; i < books.length; i++) {
    if (books[i].id > newId) {
      newId = books[i].id;
    }
  }
  newId += 1;
  console.log(req.body);
  // new data is in req.body
  const newItem = {
    id: newId,
    ...req.body,
  };

  books.push(newItem);
  res.status(201).json(newItem);
}

function update(req, res) {
  const id = parseInt(req.params.id);
  const item = books.find((item) => item.id === id);
  if (!item) {
    throw new CustomError("L'elemento non esiste", 404);
  }

  //console.log(req.body);
  for (key in item) {
    if (key !== "id") {
      item[key] = req.body[key];
    }
  }

  //console.log(books);
  res.json(item);
}

function destroy(req, res) {

  const { id } = req.params;
  
  connection.query('DELETE FROM pizzas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({
      error: 'Failed to delete pizza'
    });
    res.sendStatus(204)
  });
}

export { index, show, store, update, destroy };
