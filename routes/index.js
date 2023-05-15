function route(app) {
	app.get('/', (req, res) => {
		res.render('home/index')
	})
}
module.exports = route
