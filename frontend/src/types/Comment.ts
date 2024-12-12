// frontend/src/types/Comment.ts
import { User } from './User';

export interface Comment {
    id: string; // Unique ID for the comment
    content: string; // The comment text
    user: User; // The ID of the user who made the comment
    relatedId: string; // ID of the related programme or venue
    createdAt: string; // Timestamp when the comment was created
  }
  