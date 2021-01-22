import { User } from './User';

export interface Comment {
    id: number;
    content: string;
    blog_id: number;
    user: User;
  }