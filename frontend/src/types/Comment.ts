// frontend/src/types/Comment.ts
import { Account } from './Account';

export interface Comment {
    id: string; // Unique ID for the comment
    content: string; // The comment text
    account: Account; // The ID of the account who made the comment
    relatedId: string; // ID of the related programme or venue
    createdAt: string; // Timestamp when the comment was created
  }
  