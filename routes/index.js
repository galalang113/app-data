function route(app) {
	app.get('/', (req, res) => {
		res.send('Express on Vercel')
	})
}
module.exports = route
