
export type UserRole = 'alumni' | 'student' | 'staff';

export type VisibilityOption = 'public' | 'alumni-only' | 'hidden';

export interface FieldVisibility {
  email: VisibilityOption;
  phone: VisibilityOption;
  location: VisibilityOption;
  careerHistory: VisibilityOption;
  resume: VisibilityOption;
}

export interface CareerExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  institution: string;
  degree: string;
  major: string;
  gradYear: number;
}

export interface UserProfile {
  id: string;
  studentId?: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  verified: boolean;
  headline: string;
  bio: string;
  education: Education;
  currentCompany?: string;
  currentRole?: string;
  industry: string;
  location: string;
  distanceMiles?: number;
  skills: string[];
  interests: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  
  // Mentorship
  isMentor: boolean;
  isMentee: boolean;
  mentorshipCapacity: number; // e.g. 3
  activeMenteesCount: number;
  mentorshipBio?: string;
  mentorshipGoals?: string[];
  
  // Privacy
  visibility: FieldVisibility;
  profileCompletionPercentage: number;
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  category: 'Homecoming' | 'Career' | 'Research' | 'Announcement';
  summary: string;
  date: string;
  readTime: string;
  badgeColor: string;
  imageUrl: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: UserProfile;
  lastMessage: DirectMessage;
  unreadCount: number;
  status: 'active' | 'request';
}

export interface GroupPostComment {
  id: string;
  author: UserProfile;
  content: string;
  timestamp: string;
}

export interface GroupPost {
  id: string;
  groupId: string;
  author: UserProfile;
  content: string;
  tags: string[];
  likesCount: number;
  isLikedByMe: boolean;
  comments: GroupPostComment[];
  timestamp: string;
}

export interface InterestGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  iconName: string;
  bannerColor: string;
  membersCount: number;
  isMember: boolean;
  posts: GroupPost[];
}

export type MentorshipRequestStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  mentor: UserProfile;
  menteeId: string;
  mentee: UserProfile;
  goal: string;
  message: string;
  status: MentorshipRequestStatus;
  createdAt: string;
  updatedAt?: string;
  scheduledSession?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: 'reunion' | 'workshop' | 'networking' | 'keynote' | 'social';
  type: 'in-person' | 'virtual' | 'hybrid';
  date: string;
  time: string;
  location: string;
  virtualLink?: string;
  organizer: string;
  capacity: number;
  rsvpCount: number;
  isRsvpd: boolean;
  isWaitlisted: boolean;
  image: string;
  gallery?: string[];
  feedbackGiven?: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: 'Full-Time' | 'Internship' | 'Contract' | 'Remote';
  experienceLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead';
  description: string;
  requirements: string[];
  salaryRange: string;
  postedDate: string;
  applyLink: string;
  postedBy: UserProfile;
  status: 'approved' | 'pending_moderation';
  alumniEmployeesCount: number;
}

export interface ReferralRequest {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  alumniId: string;
  alumniName: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  requesterMajor: string;
  note: string;
  resumeAttached: boolean;
  status: 'sent' | 'reviewed' | 'referred';
  date: string;
}

export interface AppNotification {
  id: string;
  category: 'messages' | 'mentorship' | 'events' | 'jobs' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

export interface ModerationReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedBy: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  timestamp: string;
}
