const schedule = require('node-schedule');
const { loggerContainer } = require('../utils');
const { googleDriveService } = require('../services');
const checkAndRequestWebhook = require('./checkAndRequestWebhook');
const { resume_v1, allowedTimeBeforeExpiry } = require('config').get(
  'googleDriveServiceConfig'
);

const { Webhook } = require('../db/models'); // to remove

exports.googleDriveWebhookCronjob = () => {
  checkAndRequestWebhook(
    googleDriveService.requestWebhook,
    resume_v1.resourceId,
    allowedTimeBeforeExpiry
  )()
    .then(() => {
      schedule.scheduleJob(
        '*/1 * * * *',
        checkAndRequestWebhook(
          googleDriveService.requestWebhook,
          resume_v1.resourceId,
          allowedTimeBeforeExpiry
        )
      );
    })
    .then(() => loggerContainer.get('server').info('Webhook Loop Success'))
    .catch(err => loggerContainer.get('server').error(err));
};
