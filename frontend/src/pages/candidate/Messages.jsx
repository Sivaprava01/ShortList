import { useState, useEffect, useRef } from 'react';
import { getMyChats, getChatMessages, sendChatMessage } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperAirplane,
  HiOutlineBriefcase
} from 'react-icons/hi2';

function ChatList({ chats, activeChat, onSelect, currentUserId }) {
  return (
    <div className="space-y-1">
      {chats.map(chat => {
        const otherParticipant = chat.participants?.find(p => p._id !== currentUserId);
        const isActive = activeChat === chat._id;

        return (
          <button
            key={chat._id}
            onClick={() => onSelect(chat._id)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-indigo-50 border border-indigo-200'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">
                  {otherParticipant?.email?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 text-sm truncate">
                  {otherParticipant?.email || 'Unknown'}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <HiOutlineBriefcase className="w-3 h-3 shrink-0" />
                  <span className="truncate">{chat.jobId?.title || 'Job'}</span>
                </div>
                {chat.lastMessage && (
                  <p className="text-xs text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ChatWindow({ chatId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await getChatMessages(chatId);
        setMessages(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await sendChatMessage(chatId, newMessage.trim());
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-12">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.senderId?._id === currentUserId || msg.senderId === currentUserId;
            return (
              <div key={msg._id || i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isOwn
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}>
                  <p>{msg.text}</p>
                  <div className={`text-[10px] mt-1 ${isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Messages() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getMyChats();
        setChats(res.data || []);
        if (res.data?.length > 0 && !activeChat) {
          setActiveChat(res.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Chat with {user?.role === 'recruiter' ? 'candidates' : 'recruiters'} about job opportunities.</p>
      </div>

      {chats.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <HiOutlineChatBubbleLeftRight className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
          <p className="text-gray-600">
            {user?.role === 'recruiter'
              ? 'Start a conversation from the Applicants page for any of your jobs.'
              : 'Recruiters will reach out to you when they\'re interested.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
          <div className="flex h-full">
            {/* Sidebar - Chat List */}
            <div className="w-80 border-r border-gray-200 flex flex-col shrink-0">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm">Conversations ({chats.length})</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <ChatList
                  chats={chats}
                  activeChat={activeChat}
                  onSelect={setActiveChat}
                  currentUserId={user?.id}
                />
              </div>
            </div>

            {/* Main - Chat Window */}
            <div className="flex-1 flex flex-col min-w-0">
              {activeChat ? (
                <ChatWindow chatId={activeChat} currentUserId={user?.id} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Select a conversation to start chatting
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
