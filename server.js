import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware
app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
app.get('/filteredimage', async (req, res) => {
  const { image_url } = req.query;

  // 1. Validate query param
  if (!image_url) {
    return res.status(422).json({
      message: 'image_url query parameter is required'
    });
  }

  let filteredImagePath;

  try {
    // 2. Filter image
    filteredImagePath = await filterImageFromURL(image_url);

    // 3. Send file
    res.status(200).sendFile(filteredImagePath, () => {
      // 4. Cleanup
      deleteLocalFiles([filteredImagePath]);
    });

  } catch (error) {
    console.error(error);
    return res.status(422).json({
      message: 'Unable to process the image from the provided URL'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('try GET /filteredimage?image_url={{URL}}');
});

// Start server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log('press CTRL+C to stop server');
});
