const cron = require('node-cron');
const Medication = require('../Models/Medication');

function startReminderJob() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const hhmm = now.toTimeString().slice(0, 5); // 'HH:MM'
    const today = now.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    const meds = await Medication.find({
      time: hhmm,
      taken: false,
      date: { $gte: new Date(today) }
    });

    meds.forEach(med => {
      console.log(`🔔 Reminder: Take ${med.medName} (${med.dosage})`);
      // Later replace this with: push notification, SMS, or email
    });
  });
}

module.exports = startReminderJob;
