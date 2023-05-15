const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv')
const handlebars = require('express-handlebars')
const route = require('./routes')
dotenv.config()
const app = express()
const port = process.env.PORT || 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static('public'))

//view engine
const helper = {
	extname: '.hbs',
	helpers: {},
}
app.engine('hbs', handlebars(helper))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

route(app)

app.listen(port, () => {
	console.log('Running on port ' + port)
})
