import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as cron from 'node-cron';
import * as functions from 'firebase-functions';

async function bootstrap() {
  dotenv.config();

  const serviceAccount = require('../aaa.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FireStoreDbUrl, 
  });

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  cron.schedule('0 0 * * *', async () => {
    console.log('Running the replaceDocument function...');
    await replaceDocument();
  });

  const scheduledFunction = functions.pubsub.schedule('*/3 * * * *').timeZone('UTC').onRun(async () => {
    console.log('Running the replaceDocument function...');
    await replaceDocument();
  });
  
}

async function replaceDocument() {
  const firestore = admin.firestore();
  const sourceCollectionName = 'entities';
  const destinationCollectionName = 'entitieOfTheDay';

  try {
    // Get documents from the source collection
    const sourceQuerySnapshot = await firestore.collection(sourceCollectionName).get();

    if (sourceQuerySnapshot.empty) {
      console.log('Source collection is empty.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * sourceQuerySnapshot.size);
    const randomDocument = sourceQuerySnapshot.docs[randomIndex];
    const randomData = randomDocument.data();

    await deleteExistingDocument(destinationCollectionName);

    await firestore.collection(destinationCollectionName).add(randomData);

    console.log('Document replaced successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function deleteExistingDocument(collectionName: string) {
  const firestore = admin.firestore();

  try {
    const destinationQuerySnapshot = await firestore.collection(collectionName).get();

    if (!destinationQuerySnapshot.empty) {
      destinationQuerySnapshot.forEach((doc) => {
        firestore.collection(collectionName).doc(doc.id).delete();
      });

      console.log('Existing document deleted successfully.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

bootstrap();