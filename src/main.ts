import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as cron from 'node-cron';
import * as functions from 'firebase-functions';

async function bootstrap() {
  dotenv.config();

  admin.initializeApp();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;
  app.listen(port, "0.0.0.0", function () {
    console.log(`Application is running on port ${port}`);
  });

  cron.schedule('0 0 * * *', async () => {
    console.log('Running the randomizeAndMoveDocument function...');
    await randomizeAndMoveDocument();
  });

  const scheduledFunction = functions.pubsub.schedule('0 0 * * *').timeZone('UTC').onRun(async () => {
    console.log('Running the randomizeAndMoveDocument function...');
    await randomizeAndMoveDocument();
  });
}

async function randomizeAndMoveDocument() {
  const firestore = admin.firestore();
  const sourceCollectionName = 'entities';
  const destinationCollectionName = 'entitieOfTheDay';

  try {
    const sourceQuerySnapshot = await firestore.collection(sourceCollectionName).get();

    if (sourceQuerySnapshot.empty) {
      console.log('Source collection is empty.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * sourceQuerySnapshot.size);
    const randomDocument = sourceQuerySnapshot.docs[randomIndex];
    const randomData = randomDocument.data();

    await firestore.collection(destinationCollectionName).add(randomData);
    await firestore.collection(sourceCollectionName).doc(randomDocument.id).delete();

    console.log('Document randomized and moved successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

bootstrap();
