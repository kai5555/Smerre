const Automation = require('../modals/AutomationModal')

exports.getAllAutomations = async (req, res) => {
    await Automation.find({})
        .then(automations => {
            if (!automations.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Automations list empty` })
            }
            return res.status(200).json({ success: true, data: automations })
        })
        .catch(err => console.log(err))
}

exports.getAutomationById = async (req, res) => {
    await Automation.findOne({_id: req.body.id})
        .then(automation => {
            if (!automation) {
                return res
                    .status(404)
                    .json({ success: false, error: `Automation not found` })
            }
            return res.status(200).json({ success: true, data: automation })
        })
        .catch(err => console.log(err))
}

exports.createAutomation = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body',
        })
    }

    const automation = new Automation(body)

    if (!automation) {
        return res.status(400).json({ success: false, error: err })
    }

    automation
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: automation._id,
                message: 'Automation created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Automation not created!',
            })
        })

    // Create automation in homeassitant
}

exports.updateAutomation = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Automation.findOne({ _id: req.params.id })
        .then(automation => {
            temperature.name = body.name
            temperature.alias = body.alias
            temperature.tree = body.tree
            automation
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: automation._id,
                        message: 'Automation updated!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Automation not updated!',
                    })
                })
        })

        
    // Edit automation in homeassitant
}

exports.deleteAutomation = async (req, res) => {

    const automation = await Automation.deleteOne({ _id: body.req.id });
        
    // Delete automation in homeassitant
}

