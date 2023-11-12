const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()
const errorHandler = require('./middleware/error')
const routes = require('./routes')
const db = require('./database')

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

try {
  db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())


for (const idx in routes) {
  app.use('/api', routes[idx])
}

app.use(errorHandler)

module.exports = app