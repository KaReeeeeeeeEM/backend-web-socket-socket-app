const Chat = require('../models/Chat');
const User = require('../models/User');

// Create a new chat (either two-way chat or group chat)
const createChat = async (req, res) => {
  const { users, chatName, isGroupChat } = req.body;

  if (!users || users.length === 0) {
    return res.status(400).json({ error: 'Users are required to create a chat' });
  }

  try {
    let newChat = {
      users: [...users],
      isGroupChat,
    };

    if (isGroupChat) {
      newChat.chatName = chatName;
    }

    const chat = await Chat.create(newChat);
    const fullChat = await Chat.findById(chat._id).populate('users', '-password');

    res.status(201).json(fullChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all chats for the logged-in user
const fetchChats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await Chat.find({ users: { $in: [userId] } })
      .populate('users', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a group chat
const createGroupChat = async (req, res) => {
  const { users, chatName } = req.body;

  if (!users || users.length < 2) {
    return res.status(400).json({ error: 'A group chat requires at least 2 users' });
  }

  try {
    const groupChat = await Chat.create({
      chatName,
      users: [...users],
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a user to a group chat
const addUserToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a user from a group chat
const removeUserFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a chat
const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    await Chat.findByIdAndDelete(chatId);
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChat,
  fetchChats,
  createGroupChat,
  addUserToGroup,
  removeUserFromGroup,
  deleteChat,
};
