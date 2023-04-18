const Component = require('../modals/ComponentModal')

exports.getAllActors = async (req, res) => {
    try {
        const components = await Component.find({type: 'actor'});
        if (!components.length) {
            return res.status(404).json({success: false, error: `Components list empty`});
        }
        return res.status(200).json({success: true, data: components});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, error: `Server error`});
    }
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

