export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  coverImage?: string;
  instructorName: string;
}
