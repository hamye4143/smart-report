import { User } from './User';
import { File } from './File';
import { Comment } from './Comment';

export interface Blog{
  title:string,
  content:string,
  feature_image:any,
  tags: string[],
  created_at: Date,
  user: User,
  files: File[]
  // commets: Comment[]
}