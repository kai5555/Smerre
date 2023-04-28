
const Component = require('../modals/ComponentModal');
const Data = require('../modals/DataModal')
const Plant = require('../modals/PlantModal')

getDataOfPlant = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a plant',
        })
    }

    const plant = await Plant.findOne({name: body.name});
    if (!plant) {
        return res.status(400).json({
            success: false,
            error: 'No plant found with this name',
        })
    }

    const sensors = await Component.find({block: plant.block });
    if (sensors.length <= 0) {
        return res.status(400).json({
            success: false,
            error: 'No sensors for this plant',
        })
    }
    const sensorIds = sensors.map(sensor => sensor.entity_id);

    const data = await Data.find({ sensor: { $in: sensorIds }  });
    if (data.length <= 0) {
        return res.status(400).json({
            success: false,
            error: 'No data found for this plant',
        })
    }

    // Create a structured list
    var sensorData = {};
    data.forEach((d) => {
        const subtype = sensors.find(sensor => sensor.entity_id === d.sensor)?.sub_type;
        if(!subtype) return;
        
        if(!sensorData[subtype]) {
            sensorData[subtype] = [];
        }

        sensorData[subtype].push(d);
    });
    console.log(sensorData);

    return res.json({
        success: true,
        data: sensorData,
        sensors: sensors,
    })
}

getDataOfSensor = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a sensor',
        })
    }

    const data = await Data.find({sensor: body.entity_id});
    if (!data) {
        return res.status(400).json({
            success: false,
            error: 'No data found for this sensor',
        })
    }

    return res.status(400).json({
        success: true,
        data: data,
    })
}

clearData = async (req, res) => {
    await Data.deleteMany({});
    return res.status(400).json({
        success: true,
    })
}

module.exports = {
    getDataOfPlant,
    getDataOfSensor,
    clearData,
}