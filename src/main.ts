import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });

export const onDocumentCreate = functions.firestore
  .document('yourCollection/{documentId}')
  .onCreate(async (snapshot, context) => {
    try {
      const data = snapshot.data();

      // Log the data for debugging
      console.log('Document Data:', data);

      // Perform the logic to pick a random document and save it to "entitieOfTheDay"
      await pickRandomDocumentAndSave(data);

      console.log('Operation completed successfully');
    } catch (error) {
      console.error('Error:', error);
    }

    return null;
  });

async function pickRandomDocumentAndSave(data) {
  try {
    const firestore = admin.firestore();
    const snapshot = await firestore.collection('entities').get();
    const documents = snapshot.docs.map(doc => doc.data());

    // Randomly select a document
    const randomIndex = Math.floor(Math.random() * documents.length);
    const randomDocument = documents[randomIndex];

    // Save the information to "entitieOfTheDay"
    const entitieOfTheDayRef = firestore.collection('entitieOfTheDay');
    await entitieOfTheDayRef.add(randomDocument);
  } catch (error) {
    console.error('Error in pickRandomDocumentAndSave:', error);
  }
}

export const scheduleDailyJob = functions.pubsub
  .schedule('/1 * * * * *')
  .timeZone('your-timezone')
  .onRun(async (context) => {
    try {
      await pickRandomDocumentAndSave(null);
    } catch (error) {
      console.error('Error:', error);
    }

    return null;
  });

// NestJS Application Setup
async function nestJsAppSetup() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });

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

// Run NestJS application setup only if the script is executed directly
if (require.main === module) {
  nestJsAppSetup();
}
