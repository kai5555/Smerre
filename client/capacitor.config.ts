import { CapacitorConfig } from '@capacitor/cli';
require('dotenv').config()

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Smerre',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    url: `http://${process.env.REACT_APP_MY_IP}:3000`,
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};


export default config;