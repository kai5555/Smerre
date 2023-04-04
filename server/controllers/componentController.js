const Component = require('../modals/ComponentModal')

exports.getAllActors = async (req, res) => {
    await Component.find({type: 'actor'})
        .then(components => {
            if (!components.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Components list empty` })
            }
            return res.status(200).json({ success: true, data: components })
        })
        .catch(err => console.log(err))
}

exports.getAllSensors = async (req, res) => {
    await Component.find({type: 'sensor'})
        .then(components => {
            if (!components.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Components list empty` })
            }
            return res.status(200).json({ success: true, data: components })
        })
        .catch(err => console.log(err))
}

