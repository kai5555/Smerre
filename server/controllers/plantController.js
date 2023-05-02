const Plant = require('../modals/PlantModal');
const Component = require('../modals/ComponentModal')
const {plantValidation }  = require("../utils/validation");

exports.getAllPlants = async (req, res) => {
    await Plant.find({})
        .then(plants => {
            if (!plants.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Plants list empty` })
            }
            return res.status(200).json({ success: true, data: plants })
        })
        .catch(err => console.log(err))
}

exports.getPlantByName = async (req, res) => {
    await Plant.findOne({name: req.body.name})
        .then(plant => {
            if (!plant) {
                return res
                    .status(404)
                    .json({ success: false, error: `Plant not found` })
            }
            return res.status(200).json({ success: true, data: plant })
        })
        .catch(err => console.log(err))
}

exports.createPlant = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body',
        })
    }
 
    const validationError = plantValidation(body).error
    if (validationError) {
        return res.json({success: false, message: validationError.details[0].message})
    }

    const plant = new Plant({
        name: body.name,
        block: body.block,
        description: body.description,
    })
    if (!plant) {
        return res.status(400).json({ success: false, message: "Something went wrong" })
    }

    // Check if plant with this name or block doesn't exist yet
    var existPlant = await Plant.findOne({name: plant.name});
    if(existPlant){
        return res.json({ success: false, message: "Plant with this name already exists" })
    }

    existPlant = await Plant.findOne({block: plant.block});
    if(existPlant){
        return res.json({ success: false, message: "Another plant already uses this block" })
    }

    await plant
        .save()
        .then(() => {
            console.log("Plant created");
        })
        .catch(error => {
            return res.status(400).json({
                success: false,
                message: 'Plant not created!',
            })
        })

    return res.json({success: true});
}

exports.updatePlant = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const plant = await Plant.findOne({ name: body.name });
    if (plant == null) {
      return res.status(404).json({success: false, message: "Plant not found" });
    }

    // Update plant
    plant.block = body.block;
    plant.description = body.description;

    try {
      await plant.save();
      console.log("Plant "+plant.name+" updated");
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'Plant '+plant.name+' not updated!',
      })
    }
        
    console.log("Plant updated");
    return res.json({success: true});
}

exports.deletePlant = async (req, res) => {
    const body = req.body

    const plant = await Plant.findOne({ name: body.name  });
    if(plant == null) return res.status(404).json({success: false, message: "Plant not found"});

    await Plant.deleteOne({ name: body.name});
        
    console.log("Plant deleted");
    return res.json({success: true});
}