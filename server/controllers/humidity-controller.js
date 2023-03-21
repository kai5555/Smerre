const Humidity = require('../modals/humdity-modal')

getHumidity = async (req, res) => {
    await Humidity.find({})
        .then(humidity => {
            if (!humidity.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Humidity list empty` })
            }
            return res.status(200).json({ success: true, data: humidity })
        })
        .catch(err => console.log(err))
}

module.exports = {
    getHumidity,
}