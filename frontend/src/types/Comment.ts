// frontend/src/types/Comment.ts

export interface Comment {
  id: string;
  text: string; // The content of the comment
  account: string; // User who posted the comment
  createdAt: string; // Timestamp of the comment creation
}
