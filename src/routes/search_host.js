const express = require('express');
const path = require('path');
const app = express.Router();
const { searchHosts } = require('../services/zabbix');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/search-hosts', async (req, res) => {
  const query = req.query.query;
  if (!query || query.length < 3) {
    return res.json([]);
  }

  try {
    const hosts = await searchHosts(query);
    res.json(hosts);
  } catch (err) {
    console.error('Erro ao buscar hosts:', err);
    res.status(500).send('Erro interno');
  }
});

module.exports = app;