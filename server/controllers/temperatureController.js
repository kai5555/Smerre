
const Temperature = require('../modals/temperatureModal')

createTemperature = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a temperature',
        })
    }

    const temperature = new Temperature(body)

    if (!temperature) {
        return res.status(400).json({ success: false, error: err })
    }

    temperature
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: temperature._id,
                message: 'Temperature created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Temperature not created!',
            })
        })
}

updateTemperature = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Temperature.findOne({ _id: req.params.id })
        .then(temperature => {
            temperature.name = body.name
            temperature.time = body.time
            temperature.rating = body.rating
            temperature
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: temperature._id,
                        message: 'Temperature updated!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Temperature not updated!',
                    })
                })
        })
}

deleteTemperature = async (req, res) => {
    await Temperature.findOneAndDelete({ _id: req.params.id })
        .then(temperature => {
            if (!temperature) {
                return res
                    .status(404)
                    .json({ success: false, error: `Temperature not found` })
            }
            return res.status(200).json({ success: true, data: temperature })
            })
        .catch(err => console.log(err))
}

getTemperatureById = async (req, res) => {
    await Temperature.findOne({ _id: req.params.id })
        .then(temperature => {
            if (!temperature) {
                return res
                    .status(404)
                    .json({ success: false, error: `Temperature not found` })
            }
            return res.status(200).json({ success: true, data: temperature })
        })
        .catch(err => console.log(err))
}

getTemperatures = async (req, res) => {
    await Temperature.find({})
        .then(temperatures => {
            if (!temperatures.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Temperatures list empty` })
            }
            return res.status(200).json({ success: true, data: temperatures })
        })
        .catch(err => console.log(err))
}

module.exports = {
    createTemperature,
    updateTemperature,
    deleteTemperature,
    getTemperatures,
    getTemperatureById,
}