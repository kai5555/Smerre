const scheduleNotification = async () => {
    if (Capacitor.isPluginAvailable('LocalNotifications')) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'My notification',
            body: 'This is my notification message!',
            id: 1,
            schedule: { at: new Date(Date.now()) },
            sound: null,
            attachments: null,
            actionTypeId: '',
            extra: null,
          },
        ],
      });
    }
  };
  scheduleNotification();