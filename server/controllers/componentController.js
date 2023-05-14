const Component = require('../modals/ComponentModal')

exports.getAllActors = async (req, res) => {
    try {
        const components = await Component.find({type: 'actor'});
        return res.status(200).json({success: true, data: components});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, error: `Server error`});
    }
}

exports.getAllSensors = async (req, res) => {
    await Component.find({type: 'sensor'})
        .then(components => {
            return res.status(200).json({ success: true, data: components })
        })
        .catch(err => console.log(err))
}

exports.getGeneralActors = async (req,res) => {
    const actors = await Component.find({block: 0});
    console.log(actors);
    if(actors.length <= 0){
        return res.status(400).json({
            success: false,
            error: 'No general actors found',
        })
    }
    return res.json({
        success: true,
        actors: actors
    })
}

exports.getGeneralSensors = async (req, res) => {
    const sensors = await Component.find({type: 'sensor', block: 0});
    console.log(sensors);
    if(sensors.length <= 0){
        return res.status(400).json({
            success: false,
            error: 'No general sensors found'
        })
    }
    return res.json({
        success: true,
        sensors: sensors
    })
}