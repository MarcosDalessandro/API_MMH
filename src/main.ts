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
    databaseURL: 'https://mmh-1b0d3-default-rtdb.firebaseio.com', // Replace with your actual project ID
  });

  // Create NestJS application
  const app = await NestFactory.create(AppModule);

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Start NestJS application
  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', function () {
    console.log(`Application is running on port ${port}`);
  });

  // Schedule the function to run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running the replaceDocument function...');
    await replaceDocument();
  });

  // Export the function as a Firebase Cloud Function
  const scheduledFunction = functions.pubsub.schedule('0 0 * * *').timeZone('UTC').onRun(async () => {
    console.log('Running the replaceDocument function...');
    await replaceDocument();
  });
}

// Function to replace the existing document in the destination collection with a new one
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

    // Get a random document from the source collection
    const randomIndex = Math.floor(Math.random() * sourceQuerySnapshot.size);
    const randomDocument = sourceQuerySnapshot.docs[randomIndex];

    // Get the data from the random document
    const randomData = randomDocument.data();

    // Delete existing document from the destination collection
    await deleteExistingDocument(destinationCollectionName);

    // Add the new document to the destination collection
    await firestore.collection(destinationCollectionName).add(randomData);

    console.log('Document replaced successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to delete the existing document in the destination collection
async function deleteExistingDocument(collectionName: string) {
  const firestore = admin.firestore();

  try {
    const destinationQuerySnapshot = await firestore.collection(collectionName).get();

    if (!destinationQuerySnapshot.empty) {
      // Delete the existing document in the destination collection
      destinationQuerySnapshot.forEach((doc) => {
        firestore.collection(collectionName).doc(doc.id).delete();
      });

      console.log('Existing document deleted successfully.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Bootstrap the NestJS application
bootstrap();