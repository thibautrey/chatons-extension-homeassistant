# Home Assistant Extension for Chatons

Control your smart home through Home Assistant directly from Chatons conversations.

## Features

- 🏠 **Device Control** - Control lights, switches, sensors
- 🌡️ **Automation** - Create and manage automations
- 📊 **Status Monitoring** - Check device and system status
- 🔔 **Notifications** - Send notifications through Home Assistant
- 🌐 **Integration** - Connect with multiple smart devices
- 🎯 **Scenes** - Create and activate scenes

## Installation

1. Open Chatons settings
2. Go to Extensions → Add Extension
3. Search for or paste: `@thibautrey/chatons-extension-homeassistant`
4. Click Install

## Configuration

### Initial Setup

1. Navigate to the extension settings
2. Enter your **Home Assistant URL** (e.g., `http://192.168.1.100:8123`)
3. Generate a **Long-Lived Access Token** in Home Assistant:
   - Go to **Settings → People** in Home Assistant UI
   - Click on your profile
   - Scroll down and create a token
4. Paste the token in the extension settings
5. Save and test connection

### Network Requirements

- Home Assistant must be accessible from your network
- Firewall must allow connections to Home Assistant
- For remote access, consider using Nabu Casa or a VPN

## Usage

### Device Control

```
"Turn on living room lights"
"Dim bedroom lights to 50%"
"Set temperature to 22 degrees"
"Turn off all lights"
```

### Status Monitoring

```
"What's the current temperature?"
"Is the front door locked?"
"Show all sensor readings"
"Get status of all lights"
```

### Scenes and Automation

```
"Activate movie scene"
"Create a scene called bedtime"
"Show all automations"
"Enable security automation"
```

### Notifications

```
"Send notification: Door unlocked"
"Notify all devices: Time for dinner"
```

## Available Domains

Home Assistant supports many device types:
- **light** - Lights and lamps
- **switch** - Switches and outlets
- **climate** - Thermostats and temperature control
- **cover** - Blinds, shades, garage doors
- **lock** - Smart locks
- **sensor** - Temperature, humidity, motion sensors
- **binary_sensor** - Door/window sensors
- **camera** - Security cameras
- **media_player** - Audio and video devices
- **automation** - Automations
- **scene** - Named scenes
- **script** - Custom scripts

## Examples

### Morning Routine

```
"Activate good morning scene"
"This should turn on lights, start coffee, show news on display"
```

### Security

```
"Lock all doors"
"Arm security system"
"Activate away mode"
```

### Entertainment

```
"Set movie scene with dimmed lights"
"Turn on TV"
"Close blinds"
```

## Security

- Token-based authentication
- Tokens stored securely in Chatons
- HTTPS communication recommended
- No passwords or personal data exposed
- Home Assistant's security model applied

## Requirements

- Home Assistant instance running
- Network access to Home Assistant
- Long-Lived Access Token
- Home Assistant 2021.12 or later

## Supported Integrations

Home Assistant supports 500+ integrations including:
- Philips Hue
- LIFX
- Samsung SmartThings
- MQTT
- Z-Wave
- Zigbee
- And many more

## Support

For issues or feature requests, please open an issue on [GitHub](https://github.com/thibautrey/chatons-extension-homeassistant).

## License

MIT

---

**Version**: 1.0.0  
**Author**: @thibautrey  
**Repository**: https://github.com/thibautrey/chatons-extension-homeassistant
