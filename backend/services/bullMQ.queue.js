import {Queue} from 'bullmq';

const submissionQueue = new Queue('submissionQueue', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

export default submissionQueue;
