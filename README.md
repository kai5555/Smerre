# Smerre – Smart Greenhouse
 
A modular smart-greenhouse prototype that monitors and controls plants through sensors, a camera and a web app. Built as a team project of three students for the course *Engineering Project 3* at KU Leuven (Ghent Technology Campus), graded **20/20**.
  
## What it does
 
- **Modular design:** each plant gets its own 3D-printed, splash-proof module, so the greenhouse can grow by adding modules.
- **Sensors and actuators:** ESP32 modules measure the plant's environment and drive actuators such as a servo-controlled window and door.
- **Live camera:** an ESP32 camera module takes snapshots of the plants.
- **Web app:** shows live sensor data and camera images, lets you switch sensors on and off, and includes a drag-and-drop builder for Home Assistant automations. Also packaged as an Android app.
## Architecture
 
```
ESP32 sensor & camera modules (ESPHome)
        │
        ▼
  Home Assistant ──MQTT──▶ Node-RED ──▶ MongoDB
                                          │
                                          ▼
                          Node.js server ◀──▶ React web app (+ Android)
```
 
## Repository structure
 
| Folder | Contents |
| ------ | -------- |
| `client/` | React front end |
| `server/` | Node.js back end and MongoDB access |
 
## Built with
 
ESP32 · ESPHome · Home Assistant · MQTT · Node-RED · MongoDB · Node.js · React · 3D printing
 
 
## Team
 
- Niels Van Bossche
- Wout Van Steenbergen
- [Kaï Deneubourg](https://github.com/kai5555) – sensors, actuators and ESP32 configuration with ESPHome, Home Assistant integration (including a custom service for the servo-controlled window and door), and styling of the web app
