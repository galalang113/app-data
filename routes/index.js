const https = require('https')
const axios = require('axios')
const FormData = require('form-data')

function getBase64(url) {
	return axios
		.get(url, {
			responseType: 'arraybuffer',
		})
		.then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

const getImageStreamByUrl = async url => {
	try {
		const response = await axios.get(url, { timeout: 15000, responseType: 'stream' })
		if (response.status === 200) {
			return response.data
		}
		return null
	} catch (error) {
		console.log(error)
		return null
	}
}

async function getImagesStream(medias) {
	try {
		const promisesInput = {}
		for (let index = 0; index < medias.length; index++) {
			let key = `key${index}`
			promisesInput[key] = getImageStreamByUrl(medias[index])
		}
		let _resultArray = await Promise.all(Object.values(promisesInput))
		return _resultArray
	} catch (error) {
		console.error('getImagesStream', error)
		return []
	}
}

const postData = (formData, options) => {
	return new Promise(resolve => {
		let body = ''
		const req = https.request(options, async res => {
			res.on('data', function (chunk) {
				body += chunk
			})
			res.on('end', async () => {
				return resolve(body)
			})
		})
		req.on('error', async e => {
			console.log('post error', e)
			return resolve()
		})
		formData.pipe(req)
	})
}

function route(app) {
	app.get('/', (req, res) => {
		res.render('home/index')
	})
	app.post('/upload-img', async (req, res) => {
		try {
			if (!req.body.id || !req.body.medias.length || !req.headers['x-app-token']) {
				return res.status(400).json({ ok: false })
			}

			const promisesInput = {}
			for (let index = 0; index < req.body.medias.length; index++) {
				let key = `key${index}`
				let base64 = await getBase64(req.body.medias[index])
				promisesInput[key] = axios.post(
					`https://apis.haravan.com/com/products/${req.body.id}/images.json`,
					{
						image: {
							attachment: base64,
							filename: 'images.png',
						},
					},
					{
						headers: {
							Authorization: 'Bearer ' + 'DECC6AAADACF9016904BE1F8D4D042784D3F47608CE4134A3C79860F12AEF17D',
						},
					},
				)
			}
			await Promise.all(Object.values(promisesInput))
			res.status(200).json({ ok: true })
		} catch (error) {
			res.status(400).json({ ok: false })
		}
	})
}
module.exports = route
