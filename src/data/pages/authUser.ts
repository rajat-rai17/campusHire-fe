export interface AuthUser {
    _id: string;         // MongoDB ID
    name: string;        // User's full name
    email: string;       // User's email
    role: 'student' | 'admin'; // User's role
  }
  