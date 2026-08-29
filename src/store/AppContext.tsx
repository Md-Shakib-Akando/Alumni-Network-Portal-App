import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  DirectMessage,
  Conversation,
  InterestGroup,
  GroupPost,
  MentorshipRequest,
  EventItem,
  JobListing,
  ReferralRequest,
  AppNotification,
  ModerationReport,
  FieldVisibility,
  UserRole
} from '../api/types';
import {
  MOCK_USERS,
  MOCK_EVENTS,
  MOCK_JOBS,
  MOCK_GROUPS,
  MOCK_CONVERSATIONS,
  MOCK_NOTIFICATIONS,
  MOCK_MENTORSHIP_REQUESTS,
  MOCK_REFERRALS
} from '../api/mockData';

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  conversations: Conversation[];
  groups: InterestGroup[];
  events: EventItem[];
  jobs: JobListing[];
  notifications: AppNotification[];
  mentorshipRequests: MentorshipRequest[];
  referralRequests: ReferralRequest[];
  moderationReports: ModerationReport[];
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  isAuthenticated: boolean;
  
  // Actions
  login: (userId?: string) => void;
  logout: () => void;
  switchPersona: (userId: string) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
  updatePrivacySettings: (field: keyof FieldVisibility, option: 'public' | 'alumni-only' | 'hidden') => void;
  
  // Messaging
  sendMessage: (receiverId: string, text: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  
  // Groups
  toggleJoinGroup: (groupId: string) => void;
  createGroupPost: (groupId: string, content: string, tags: string[]) => void;
  likeGroupPost: (groupId: string, postId: string) => void;
  addPostComment: (groupId: string, postId: string, commentText: string) => void;
  
  // Mentorship
  sendMentorshipRequest: (mentorId: string, goal: string, message: string) => { success: boolean; error?: string };
  respondToMentorshipRequest: (requestId: string, status: 'accepted' | 'declined') => void;
  endMentorship: (requestId: string, rating: number, feedback: string) => void;
  
  // Events
  rsvpEvent: (eventId: string) => void;
  cancelRsvpEvent: (eventId: string) => void;
  createEvent: (eventData: Omit<EventItem, 'id' | 'rsvpCount' | 'isRsvpd' | 'isWaitlisted'>) => void;
  submitEventFeedback: (eventId: string, rating: number, comments: string) => void;
  
  // Jobs & Referrals
  postJob: (jobData: Omit<JobListing, 'id' | 'postedDate' | 'postedBy' | 'status' | 'alumniEmployeesCount'>) => void;
  requestReferral: (jobId: string, alumniId: string, note: string) => void;
  
  // Notifications & Safety
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  reportUser: (reportedUserId: string, reason: string, details: string) => void;
  blockUser: (blockedUserId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[1]); // Alex Rivera
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Initially not logged in as requested
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [groups, setGroups] = useState<InterestGroup[]>(MOCK_GROUPS);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [jobs, setJobs] = useState<JobListing[]>(MOCK_JOBS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>(MOCK_MENTORSHIP_REQUESTS);
  const [referralRequests, setReferralRequests] = useState<ReferralRequest[]>(MOCK_REFERRALS);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  const login = (userId?: string) => {
    if (userId) {
      const user = allUsers.find(u => u.id === userId);
      if (user) {
        setCurrentUser(user);
      }
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchPersona = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
    setIsAuthenticated(true);
  };

  const updatePrivacySettings = (field: keyof FieldVisibility, option: 'public' | 'alumni-only' | 'hidden') => {
    const updatedVisibility = { ...currentUser.visibility, [field]: option };
    updateCurrentUserProfile({ visibility: updatedVisibility });
  };

  // Messaging Actions
  const sendMessage = (receiverId: string, text: string) => {
    const receiver = allUsers.find(u => u.id === receiverId);
    if (!receiver || !text.trim()) return;

    const newMessage: DirectMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${currentUser.id}-${receiverId}`,
      senderId: currentUser.id,
      receiverId,
      text,
      timestamp: 'Just now',
      read: false,
    };

    setConversations(prev => {
      const existingConv = prev.find(c => c.participant.id === receiverId);
      if (existingConv) {
        return prev.map(c => c.participant.id === receiverId ? {
          ...c,
          lastMessage: newMessage,
          unreadCount: 0,
        } : c);
      } else {
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          participant: receiver,
          lastMessage: newMessage,
          unreadCount: 0,
          status: 'active',
        };
        return [newConv, ...prev];
      }
    });

    // Add push notification for simulator
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      category: 'messages',
      title: `Message delivered to ${receiver.name}`,
      message: text,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
  };

  // Groups Actions
  const toggleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const nextState = !g.isMember;
        return {
          ...g,
          isMember: nextState,
          membersCount: nextState ? g.membersCount + 1 : g.membersCount - 1,
        };
      }
      return g;
    }));
  };

  const createGroupPost = (groupId: string, content: string, tags: string[]) => {
    const newPost: GroupPost = {
      id: `post-${Date.now()}`,
      groupId,
      author: currentUser,
      content,
      tags: tags.length ? tags : ['General'],
      likesCount: 0,
      isLikedByMe: false,
      comments: [],
      timestamp: 'Just now',
    };

    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, posts: [newPost, ...g.posts] };
      }
      return g;
    }));
  };

  const likeGroupPost = (groupId: string, postId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          posts: g.posts.map(p => {
            if (p.id === postId) {
              const liked = !p.isLikedByMe;
              return {
                ...p,
                isLikedByMe: liked,
                likesCount: liked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
              };
            }
            return p;
          }),
        };
      }
      return g;
    }));
  };

  const addPostComment = (groupId: string, postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    const comment = {
      id: `comm-${Date.now()}`,
      author: currentUser,
      content: commentText,
      timestamp: 'Just now',
    };

    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          posts: g.posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p),
        };
      }
      return g;
    }));
  };

  // Mentorship Actions (PRD Section 6.4: Max 3 pending requests)
  const sendMentorshipRequest = (mentorId: string, goal: string, message: string) => {
    const pendingCount = mentorshipRequests.filter(r => r.menteeId === currentUser.id && r.status === 'pending').length;
    if (pendingCount >= 3) {
      return {
        success: false,
        error: 'Mentee limit reached: You cannot have more than 3 active pending mentorship requests at a time (per PRD limits).'
      };
    }

    const mentor = allUsers.find(u => u.id === mentorId);
    if (!mentor) return { success: false, error: 'Mentor not found' };

    const newReq: MentorshipRequest = {
      id: `ment-req-${Date.now()}`,
      mentorId,
      mentor,
      menteeId: currentUser.id,
      mentee: currentUser,
      goal,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setMentorshipRequests(prev => [newReq, ...prev]);

    // Send notification to mentor
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      category: 'mentorship',
      title: 'New Mentorship Request',
      message: `${currentUser.name} requested mentorship in "${goal}"`,
      timestamp: 'Just now',
      read: false,
      relatedId: newReq.id,
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true };
  };

  const respondToMentorshipRequest = (requestId: string, status: 'accepted' | 'declined') => {
    setMentorshipRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          updatedAt: new Date().toISOString(),
          scheduledSession: status === 'accepted' ? new Date(Date.now() + 86400000 * 5).toISOString() : undefined,
        };
      }
      return r;
    }));

    const req = mentorshipRequests.find(r => r.id === requestId);
    if (req) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        category: 'mentorship',
        title: status === 'accepted' ? 'Mentorship Request Accepted!' : 'Mentorship Request Declined',
        message: `${currentUser.name} has ${status} your request for "${req.goal}".`,
        timestamp: 'Just now',
        read: false,
        relatedId: req.id,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const endMentorship = (requestId: string, rating: number, feedback: string) => {
    setMentorshipRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'completed' } : r));
    
    // Add confirmation notice
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      category: 'mentorship',
      title: 'Mentorship Completed',
      message: `Relationship ended with feedback recorded (Rating: ${rating}/5). Thank you!`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Events Actions (PRD Section 6.5)
  const rsvpEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const isFull = e.rsvpCount >= e.capacity;
        if (isFull) {
          // Waitlist
          return { ...e, isWaitlisted: true, isRsvpd: false };
        } else {
          return { ...e, isRsvpd: true, isWaitlisted: false, rsvpCount: e.rsvpCount + 1 };
        }
      }
      return e;
    }));

    const ev = events.find(e => e.id === eventId);
    if (ev) {
      const isFull = ev.rsvpCount >= ev.capacity;
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        category: 'events',
        title: isFull ? 'Added to Event Waitlist' : 'RSVP Confirmed!',
        message: isFull
          ? `You have been added to the waitlist for "${ev.title}". We will notify you if a slot opens!`
          : `Your seat for "${ev.title}" is reserved. Synced to your calendar.`,
        timestamp: 'Just now',
        read: false,
        relatedId: eventId,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const cancelRsvpEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          isRsvpd: false,
          isWaitlisted: false,
          rsvpCount: e.isRsvpd ? Math.max(0, e.rsvpCount - 1) : e.rsvpCount,
        };
      }
      return e;
    }));
  };

  const createEvent = (eventData: Omit<EventItem, 'id' | 'rsvpCount' | 'isRsvpd' | 'isWaitlisted'>) => {
    const newEvent: EventItem = {
      ...eventData,
      id: `event-${Date.now()}`,
      rsvpCount: 1,
      isRsvpd: true,
      isWaitlisted: false,
      gallery: [],
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const submitEventFeedback = (eventId: string, rating: number, comments: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, feedbackGiven: true } : e));
  };

  // Jobs Actions (PRD Section 6.6)
  const postJob = (jobData: Omit<JobListing, 'id' | 'postedDate' | 'postedBy' | 'status' | 'alumniEmployeesCount'>) => {
    const isStaff = currentUser.role === 'staff';
    const newJob: JobListing = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDate: 'Today',
      postedBy: currentUser,
      status: isStaff ? 'approved' : 'pending_moderation',
      alumniEmployeesCount: 1,
    };
    setJobs(prev => [newJob, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      category: 'jobs',
      title: isStaff ? 'Job Published' : 'Job Submitted for Moderation',
      message: isStaff
        ? `Your job listing "${jobData.title}" is now active in the alumni directory.`
        : `Your job listing "${jobData.title}" was submitted and is pending staff approval.`,
      timestamp: 'Just now',
      read: false,
      relatedId: newJob.id,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const requestReferral = (jobId: string, alumniId: string, note: string) => {
    const job = jobs.find(j => j.id === jobId);
    const alumni = allUsers.find(u => u.id === alumniId);
    if (!job || !alumni) return;

    const newRef: ReferralRequest = {
      id: `ref-${Date.now()}`,
      jobId,
      jobTitle: job.title,
      company: job.company,
      alumniId,
      alumniName: alumni.name,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: currentUser.headline,
      requesterMajor: currentUser.education.major,
      note,
      resumeAttached: true,
      status: 'sent',
      date: 'Today',
    };

    setReferralRequests(prev => [newRef, ...prev]);

    // Notify alumni
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      category: 'jobs',
      title: 'New Job Referral Request',
      message: `${currentUser.name} requested a referral for "${job.title}" at ${job.company}.`,
      timestamp: 'Just now',
      read: false,
      relatedId: newRef.id,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Notification & Safety Actions
  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const reportUser = (reportedUserId: string, reason: string, details: string) => {
    const user = allUsers.find(u => u.id === reportedUserId);
    const report: ModerationReport = {
      id: `rep-${Date.now()}`,
      reportedUserId,
      reportedUserName: user ? user.name : 'Unknown',
      reportedBy: currentUser.name,
      reason,
      details,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString(),
    };
    setModerationReports(prev => [report, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      category: 'system',
      title: 'Report Submitted',
      message: `Your report has been forwarded to Alumni Relations staff moderation queue for review within 1 minute.`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const blockUser = (blockedUserId: string) => {
    setBlockedUserIds(prev => [...prev, blockedUserId]);
    setAllUsers(prev => prev.filter(u => u.id !== blockedUserId));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        conversations,
        groups,
        events,
        jobs,
        notifications,
        mentorshipRequests,
        referralRequests,
        moderationReports,
        unreadNotificationsCount,
        unreadMessagesCount,
        isAuthenticated,
        login,
        logout,
        switchPersona,
        updateCurrentUserProfile,
        updatePrivacySettings,
        sendMessage,
        markConversationAsRead,
        toggleJoinGroup,
        createGroupPost,
        likeGroupPost,
        addPostComment,
        sendMentorshipRequest,
        respondToMentorshipRequest,
        endMentorship,
        rsvpEvent,
        cancelRsvpEvent,
        createEvent,
        submitEventFeedback,
        postJob,
        requestReferral,
        markNotificationRead,
        clearAllNotifications,
        reportUser,
        blockUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
