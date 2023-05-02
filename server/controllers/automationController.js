const Automation = require('../modals/AutomationModal')
const fetch = require('node-fetch');

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

exports.getAutomationByName = async (req, res) => {
    await Automation.findOne({name: req.body.name})
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

    // Add to mongodb
    body.automation.alias = body.automationName;

    const automationName = body.automationName.toLowerCase().replace(/\s+/g, '_');
    const automation = new Automation({
        name: automationName,
        alias: body.automationName,
        lines: body.lines,
        boxes: body.boxes,
    })

    if (!automation) {
        return res.status(400).json({ success: false, error: err })
    }

    console.log(automation);

    await automation
        .save()
        .then(() => {
            console.log("Automation created");
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Automation not created!',
            })
        })

    // Create automation in homeassitant
     try {
        await fetch(`http://${process.env.HOMEASSISTANT_IP}:8123/api/config/automation/config/${automationName}`, {
            method: 'POST',
            body: JSON.stringify(body.automation),
            headers: {
                "Authorization": `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Created " + body.automationName);
    } catch (err) {
        res.status(404)
    }

    return res.json({message: "Success"});
}

exports.updateAutomation = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const automation = await Automation.findOne({ name: body.automationName });
    if (automation == null) {
      return res.status(404).json({ message: "Automation not found" });
    }
    
    automation.lines = body.lines;
    automation.boxes = body.boxes;
    
    try {
      await automation.save();
      console.log("Automation "+automation.alias+" updated");
    } catch (error) {
      return res.status(404).json({
        error,
        message: 'Automation '+automation.alias+' not updated!',
      })
    }
        
    // Update automation in homeassitant
    body.automation.alias = automation.name;
    console.log(body.automation);
     try {
        await fetch(`http://${process.env.HOMEASSISTANT_IP}:8123/api/config/automation/config/${automation.name}`, {
            method: 'POST',
            body: JSON.stringify(body.automation),
            headers: {
                "Authorization": `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Updated " + automation.name);
    } catch (err) {
        return res.status(404).json({message: err});
    }

    return res.json({message: "Success"});
}

exports.deleteAutomation = async (req, res) => {
    const body = req.body

    const automation = await Automation.findOne({ name: body.automationName  });
    if(automation == null) return res.status(404).json({message: "Automation not found"});

    await Automation.deleteOne({ name: body.automationName  });
        
    // Delete automation in homeassitant
    try {
        await fetch(`http://${process.env.HOMEASSISTANT_IP}:8123/api/config/automation/config/${body.automationName}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        console.log("Deleted " + body.automationName);
    } catch (err) {
        console.log(err);
        return res.status(404).json({message: err});
    }

    return res.json({message: "Success"});
}

exports.toggleAutomation = async (req, res) => {
    const body = req.body
  
    const automation = await Automation.findOne({ name: body.automationName })
    if(automation == null) return res.status(404).json({message: "Automation not found"});
    const enabled = !automation.enabled;

    // Toggle in mongoose and update
    automation.enabled = enabled;
    await automation.save();
        
    // Toggle in homeassitant
    try {
        await fetch(`http://${process.env.HOMEASSISTANT_IP}:8123/api/services/automation/toggle`, {
            method: 'POST',
            body: JSON.stringify({
                "entity_id": `automation.${body.automationName}`,
            }),
            headers: {
                "Authorization": `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Toggled " + body.automationName);
    } catch (err) {
        return res.status(404).json({message: err});
    }

    return res.json({message: "Success"});
}
