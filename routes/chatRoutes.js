const express = require('express');
const { createChat, fetchChats, createGroupChat, addUserToGroup, removeUserFromGroup, deleteChat } = require('../controllers/chatController');
const { sendMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

// Create a new chat (either group or one-on-one)
router.post('/', createChat);

// Fetch all chats for a user
router.get('/', fetchChats);

// Create a group chat
router.post('/group', createGroupChat);

// Add a user to a group chat
router.put('/group/add', addUserToGroup);

// Remove a user from a group chat
router.put('/group/remove', removeUserFromGroup);

// Delete a chat
router.delete('/:chatId', deleteChat);

// Send a message
router.post('/:chatId/message', sendMessage);

// Get all messages in a chat
router.get('/:chatId/messages', getMessages);

module.exports = router;
