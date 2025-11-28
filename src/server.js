const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.text({type: '*/*'}));

// In-memory KV store
const store = {};

// GET /:key
app.get('/:key', (req, res) => {
  const { key } = req.params;
  if (!(key in store)) {
    return res.status(404).json({ error: 'Key not found' });
  }
  res.send(store[key]);
});

// PUT /:key { value }
app.put('/:key', (req, res) => {
  const { key } = req.params;
  store[key] = req.body;
  res.send(req.body);
});

// DELETE /:key
app.delete('/:key', (req, res) => {
  const { key } = req.params;
  delete store[key];
  res.json({ deleted: key });
});

// DELETE /* — wipe all
app.delete('/', (req, res) => {
  Object.keys(store).forEach(k => delete store[k]);
  res.json({ deleted: 'all' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`KVR listening on port ${port}`));