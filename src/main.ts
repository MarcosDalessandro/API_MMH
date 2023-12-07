import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

admin.initializeApp();

async function pickRandomDocument(req, res) {
  try {
    const firestore = admin.firestore();
    const snapshot = await firestore.collection('yourCollection').get();
    const documents = snapshot.docs.map(doc => doc.data());

    // Randomly select a document
    const randomIndex = Math.floor(Math.random() * documents.length);
    const randomDocument = documents[randomIndex];

    // Call the function to save the information
    await saveEntityOfTheDay(randomDocument);

    res.status(200).send('Operation completed successfully.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function saveEntityOfTheDay(data) {
  const firestore = admin.firestore();
  const entitieOfTheDayRef = firestore.collection('entitieOfTheDay');
  await entitieOfTheDayRef.add(data);
}

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 540,
  memory: '1GB',
};

exports.pickRandomDocument = functions.runWith(runtimeOpts).https.onRequest(pickRandomDocument);

// Set up Cloud Scheduler to trigger the function at midnight
exports.scheduleJob = functions.pubsub
  .schedule('*/5 * * * *')
  .timeZone('GMT-3')
  .onRun(async (context) => {
    try {
      // Trigger the function to pick a random document
      await pickRandomDocument(null, null);
    } catch (error) {
      console.error('Error:', error);
    }

    return null;
  });


// NestJS Application Setup
async function nestJsAppSetup() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port, "0.0.0.0");
}

// Run NestJS application setup
nestJsAppSetup();
