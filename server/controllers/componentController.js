const Component = require('../modals/ComponentModal')
const Data = require('../modals/DataModal')

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
    const sensors = await Component.find({type: 'sensor', block: 0}).lean();
    console.log(sensors);
    if(sensors.length <= 0){
        return res.status(400).json({
            success: false,
            error: 'No general sensors found'
        })
    }
    const sensorIds = sensors.map(sensor => sensor.entity_id); 
    const data = await Data.findOne({ sensor: { $in: sensorIds[0] }  });
    const data2 = await Data.findOne({ sensor: { $in: sensorIds[1] }  });
    const data3 = await Data.findOne({ sensor: { $in: sensorIds[2] }  }).lean();
    sensors[0]['value'] = `${data.value}`;
    sensors[1]['value'] = `${data2.value}`;
    sensors[2]['value'] = `${data3.value}`;
    sensors[0]['symbol'] = '%';
    sensors[1]['symbol'] = '°C';
    sensors[0]['image'] = 'dht'
    sensors[1]['image'] = 'dht'
    sensors[2]['image'] = 'ldr'
    if (data.length <= 0) {
        // return res.status(400).json({
        //     success: false,
        //     error: 'No data found for this plant',
        // })
    }
    return res.json({
        success: true,
        sensors: sensors,
        data: data3
    })
}