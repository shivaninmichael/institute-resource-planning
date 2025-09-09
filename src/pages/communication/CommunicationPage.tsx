// =====================================================
// Communication Page Component
// Internal messaging, notifications, and chat interface
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  Badge,
  Divider,
  InputAdornment,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  Fab,
  Tooltip,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import NotificationIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import ChatIcon from '@mui/icons-material/Chat';
import AnnouncementIcon from '@mui/icons-material/Campaign';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import AttachIcon from '@mui/icons-material/AttachFile';
import EmojiIcon from '@mui/icons-material/EmojiEmotions';
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';
import DeleteIcon from '@mui/icons-material/Delete';
import UnreadIcon from '@mui/icons-material/MarkAsUnread';
import ReadIcon from '@mui/icons-material/CheckCircle';
import AddPersonIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import PublicIcon from '@mui/icons-material/Public';
import PrivateIcon from '@mui/icons-material/Lock';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  subject: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipients: MessageRecipient[];
  type: 'direct' | 'broadcast' | 'announcement' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'sent' | 'delivered' | 'read';
  isReply: boolean;
  sentAt?: Date;
  createdAt: Date;
  tags: string[];
}

interface MessageRecipient {
  userId: string;
  userName: string;
  status: 'pending' | 'delivered' | 'read' | 'failed';
  readAt?: Date;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  category: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: Date;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'group';
  memberCount: number;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: 'text' | 'file' | 'image' | 'system';
  reactions: MessageReaction[];
  createdAt: Date;
  isEdited: boolean;
}

interface MessageReaction {
  userId: string;
  emoji: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const CommunicationPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessageDialog, setNewMessageDialog] = useState(false);
  const [newChatRoomDialog, setNewChatRoomDialog] = useState(false);
  const [messageFormData, setMessageFormData] = useState<Partial<Message>>({});
  const [chatInput, setChatInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const mockMessages: Message[] = [
    {
      id: '1',
      subject: 'Welcome to the new semester!',
      content: 'Dear students, welcome to the new academic semester. Please check your course schedules and complete registration.',
      senderId: 'admin_1',
      senderName: 'Admin Office',
      senderRole: 'Administrator',
      recipients: [
        { userId: 'student_1', userName: 'John Doe', status: 'read', readAt: new Date() },
        { userId: 'student_2', userName: 'Jane Smith', status: 'delivered' }
      ],
      type: 'announcement',
      priority: 'high',
      status: 'sent',
      isReply: false,
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['academic', 'semester']
    },
    {
      id: '2',
      subject: 'Fee Payment Reminder',
      content: 'This is a reminder that your tuition fees are due by the end of this month.',
      senderId: 'finance_1',
      senderName: 'Finance Office',
      senderRole: 'Finance',
      recipients: [
        { userId: 'current_user', userName: 'Current User', status: 'delivered' }
      ],
      type: 'direct',
      priority: 'urgent',
      status: 'sent',
      isReply: false,
      sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      tags: ['finance', 'payment']
    }
  ];

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'New Assignment Posted',
      message: 'A new assignment has been posted in Computer Science 101',
      type: 'info',
      category: 'academic',
      isRead: false,
      actionUrl: '/assignments/cs101-hw3',
      actionText: 'View Assignment',
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Grade Updated',
      message: 'Your grade for Mathematics 201 midterm has been updated',
      type: 'success',
      category: 'academic',
      isRead: false,
      actionUrl: '/grades',
      actionText: 'View Grades',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Payment Overdue',
      message: 'Your tuition payment is overdue. Please make payment immediately.',
      type: 'error',
      category: 'financial',
      isRead: true,
      actionUrl: '/payments',
      actionText: 'Make Payment',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  const mockChatRooms: ChatRoom[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General discussion for all members',
      type: 'public',
      memberCount: 150,
      lastMessage: 'Welcome everyone to the new semester!',
      lastMessageAt: new Date(Date.now() - 10 * 60 * 1000),
      unreadCount: 3
    },
    {
      id: 'cs101',
      name: 'Computer Science 101',
      description: 'Discussion for CS101 students',
      type: 'group',
      memberCount: 25,
      lastMessage: 'Assignment 3 is now available',
      lastMessageAt: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 1
    },
    {
      id: 'study_group',
      name: 'Math Study Group',
      description: 'Study group for mathematics courses',
      type: 'private',
      memberCount: 8,
      lastMessage: 'Meeting tomorrow at 3 PM in library',
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0
    }
  ];

  const mockChatMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: 'admin_1',
      senderName: 'Admin',
      content: 'Welcome everyone to the general discussion room!',
      messageType: 'text',
      reactions: [
        { userId: 'user_1', emoji: '👍' },
        { userId: 'user_2', emoji: '👍' }
      ],
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      isEdited: false
    },
    {
      id: '2',
      senderId: 'user_1',
      senderName: 'John Doe',
      content: 'Thanks for the welcome! Excited to be here.',
      messageType: 'text',
      reactions: [],
      createdAt: new Date(Date.now() - 50 * 60 * 1000),
      isEdited: false
    },
    {
      id: '3',
      senderId: 'user_2',
      senderName: 'Jane Smith',
      content: 'When do classes start this semester?',
      messageType: 'text',
      reactions: [],
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      isEdited: false
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
    setNotifications(mockNotifications);
    setChatRooms(mockChatRooms);
  }, []);

  useEffect(() => {
    if (selectedChatRoom) {
      setChatMessages(mockChatMessages);
    }
  }, [selectedChatRoom]);

  useEffect(() => {
    // Auto-scroll to bottom of chat messages
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSendMessage = () => {
    if (messageFormData.subject && messageFormData.content) {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        subject: messageFormData.subject,
        content: messageFormData.content,
        senderId: 'current_user',
        senderName: 'Current User',
        senderRole: 'Student',
        recipients: messageFormData.recipients || [],
        type: messageFormData.type || 'direct',
        priority: messageFormData.priority || 'medium',
        status: 'sent',
        isReply: false,
        sentAt: new Date(),
        createdAt: new Date(),
        tags: messageFormData.tags || []
      };

      setMessages([newMessage, ...messages]);
      setNewMessageDialog(false);
      setMessageFormData({});
    }
  };

  const handleSendChatMessage = () => {
    if (chatInput.trim() && selectedChatRoom) {
      const newMessage: ChatMessage = {
        id: `chat_${Date.now()}`,
        senderId: 'current_user',
        senderName: 'Current User',
        content: chatInput,
        messageType: 'text',
        reactions: [],
        createdAt: new Date(),
        isEdited: false
      };

      setChatMessages([...chatMessages, newMessage]);
      setChatInput('');

      // Update chat room last message
      setChatRooms(chatRooms.map(room =>
        room.id === selectedChatRoom.id
          ? { ...room, lastMessage: chatInput, lastMessageAt: new Date() }
          : room
      ));
    }
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'reminder': return '⏰';
      default: return 'ℹ️';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getChatRoomIcon = (type: string) => {
    switch (type) {
      case 'public': return <PublicIcon />;
      case 'private': return <PrivateIcon />;
      case 'group': return <GroupIcon />;
      default: return <ChatIcon />;
    }
  };

  const renderMessages = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Messages</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setNewMessageDialog(true)}
        >
          New Message
        </Button>
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <List>
        {messages
          .filter(message =>
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.senderName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((message) => (
            <ListItem key={message.id} divider>
              <ListItemAvatar>
                <Avatar>{message.senderName.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1">{message.subject}</Typography>
                    <Chip
                      label={message.priority}
                      color={getPriorityColor(message.priority)}
                      size="small"
                    />
                    {message.type === 'announcement' && (
                      <Chip label="Announcement" color="info" size="small" />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      From: {message.senderName} • {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {message.content.substring(0, 100)}
                      {message.content.length > 100 && '...'}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton size="small">
                  <ReplyIcon />
                </IconButton>
                <IconButton size="small">
                  <ForwardIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  const renderNotifications = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Notifications
          <Badge
            badgeContent={notifications.filter(n => !n.isRead).length}
            color="error"
            sx={{ ml: 2 }}
          >
            <NotificationIcon />
          </Badge>
        </Typography>
        <Button
          variant="outlined"
          onClick={handleMarkAllNotificationsAsRead}
          disabled={notifications.filter(n => !n.isRead).length === 0}
        >
          Mark All as Read
        </Button>
      </Box>

      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            divider
            sx={{
              bgcolor: notification.isRead ? 'transparent' : 'action.hover',
              borderLeft: notification.isRead ? 'none' : '4px solid',
              borderLeftColor: notification.type === 'error' ? 'error.main' : 
                             notification.type === 'warning' ? 'warning.main' :
                             notification.type === 'success' ? 'success.main' : 'info.main'
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'transparent' }}>
                {getNotificationIcon(notification.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={notification.title}
              secondary={
                <Box>
                  <Typography variant="body2">{notification.message}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                  </Typography>
                  {notification.actionText && (
                    <Button size="small" sx={{ ml: 1 }}>
                      {notification.actionText}
                    </Button>
                  )}
                </Box>
              }
            />
            <ListItemSecondaryAction>
              {!notification.isRead && (
                <IconButton
                  size="small"
                  onClick={() => handleMarkNotificationAsRead(notification.id)}
                >
                  <ReadIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderChat = () => (
    <Box>
      <Grid container spacing={3} sx={{ height: '70vh' }}>
        {/* Chat Rooms List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Chat Rooms"
              action={
                <IconButton onClick={() => setNewChatRoomDialog(true)}>
                  <AddIcon />
                </IconButton>
              }
            />
            <CardContent sx={{ p: 0, height: 'calc(100% - 64px)', overflow: 'auto' }}>
              <List>
                {chatRooms.map((room) => (
                  <ListItem
                    key={room.id}
                    button
                    selected={selectedChatRoom?.id === room.id}
                    onClick={() => setSelectedChatRoom(room)}
                    divider
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={room.unreadCount} color="error">
                        <Avatar>{getChatRoomIcon(room.type)}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={room.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" noWrap>
                            {room.lastMessage}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {room.memberCount} members
                            {room.lastMessageAt && (
                              <> • {formatDistanceToNow(room.lastMessageAt, { addSuffix: true })}</>
                            )}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Chat Messages */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedChatRoom ? (
              <>
                <CardHeader
                  title={selectedChatRoom.name}
                  subheader={`${selectedChatRoom.memberCount} members`}
                  action={
                    <IconButton>
                      <SettingsIcon />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                  <List dense>
                    {chatMessages.map((message) => (
                      <ListItem key={message.id} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {message.senderName.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle2">
                                {message.senderName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {message.content}
                              </Typography>
                              {message.reactions.length > 0 && (
                                <Box display="flex" gap={0.5} mt={0.5}>
                                  {message.reactions.map((reaction, index) => (
                                    <Chip
                                      key={index}
                                      label={reaction.emoji}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                    <div ref={chatMessagesEndRef} />
                  </List>
                </CardContent>
                <Divider />
                <Box p={2}>
                  <Box display="flex" gap={1} alignItems="center">
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      multiline
                      maxRows={3}
                    />
                    <IconButton>
                      <AttachIcon />
                    </IconButton>
                    <IconButton>
                      <EmojiIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={handleSendChatMessage}
                      disabled={!chatInput.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <Typography variant="h6" color="textSecondary">
                  Select a chat room to start messaging
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAnnouncements = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Announcements</Typography>
        <Button
          variant="contained"
          startIcon={<AnnouncementIcon />}
        >
          Create Announcement
        </Button>
      </Box>

      <Grid container spacing={3}>
        {messages.filter(msg => msg.type === 'announcement').map((announcement) => (
          <Grid item xs={12} key={announcement.id}>
            <Alert
              severity={announcement.priority === 'urgent' ? 'error' : 'info'}
              action={
                <Button color="inherit" size="small">
                  View Details
                </Button>
              }
            >
              <Typography variant="h6">{announcement.subject}</Typography>
              <Typography variant="body2">{announcement.content}</Typography>
              <Typography variant="caption" color="textSecondary">
                From {announcement.senderName} • {formatDistanceToNow(announcement.createdAt, { addSuffix: true })}
              </Typography>
            </Alert>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Communication Center
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label={
                <Badge badgeContent={messages.length} color="primary">
                  Messages
                </Badge>
              } 
              icon={<MessageIcon />} 
            />
            <Tab 
              label={
                <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="error">
                  Notifications
                </Badge>
              } 
              icon={<NotificationIcon />} 
            />
            <Tab label="Chat" icon={<ChatIcon />} />
            <Tab label="Announcements" icon={<AnnouncementIcon />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderMessages()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderNotifications()}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {renderChat()}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {renderAnnouncements()}
        </TabPanel>

        {/* New Message Dialog */}
        <Dialog open={newMessageDialog} onClose={() => setNewMessageDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Compose Message</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={messageFormData.subject || ''}
                  onChange={(e) => setMessageFormData({ ...messageFormData, subject: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={messageFormData.type || 'direct'}
                    onChange={(e) => setMessageFormData({ ...messageFormData, type: e.target.value as any })}
                    label="Type"
                  >
                    <MenuItem value="direct">Direct Message</MenuItem>
                    <MenuItem value="broadcast">Broadcast</MenuItem>
                    <MenuItem value="announcement">Announcement</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={messageFormData.priority || 'medium'}
                    onChange={(e) => setMessageFormData({ ...messageFormData, priority: e.target.value as any })}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={6}
                  value={messageFormData.content || ''}
                  onChange={(e) => setMessageFormData({ ...messageFormData, content: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewMessageDialog(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} variant="contained" startIcon={<SendIcon />}>
              Send Message
            </Button>
          </DialogActions>
        </Dialog>

        {/* New Chat Room Dialog */}
        <Dialog open={newChatRoomDialog} onClose={() => setNewChatRoomDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Chat Room</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Room Name"
                  placeholder="Enter room name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  placeholder="Enter room description"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Room Type</InputLabel>
                  <Select label="Room Type" defaultValue="public">
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                    <MenuItem value="group">Group</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewChatRoomDialog(false)}>Cancel</Button>
            <Button variant="contained">Create Room</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CommunicationPage;
