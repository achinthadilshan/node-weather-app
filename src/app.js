const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('postman-request')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
// To set a custom folder instead of viws
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// Setup handlebars engine
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to save
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Achintha',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'Achintha',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Achintha',
        message: 'We are npm, Inc., the company behind Node package manager, the npm Registry, and npm CLI. We offer those to the community for free, but our day job is building and selling useful tools for developers like you.',
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {
        latitude,
        longitude,
        location
    } = {}) => {
        if (error) {
            return res.send({
                error
            });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address,
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search tearm'
        })
    }

    res.send({
        products: [],
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Achintha',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Achintha',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.');
})