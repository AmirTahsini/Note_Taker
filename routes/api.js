const notes = require('express').Router();
const uuid = require('../helpers/uuid');
const fs = require('fs');

// GET request for notes
notes.get('/notes', (req, res) => {
    // Send a message to the client
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
         res.send(data);
        }});        
  
    // Log our request to the terminal
    console.info(`${req.method} request received to get reviews`);
  });
  
  // POST request to add a note
  notes.post('/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a notes`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };
  
      // Obtain existing note
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

  notes.delete('/notes/:id', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to delete a note`);
  
    if (req.params.id) {
  
      // Obtain existing note
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
          const filteredNotes = parsedNotes.filter(note => note.id !== req.params.id);
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(filteredNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in deleting note');
    }
  });

  module.exports = notes;