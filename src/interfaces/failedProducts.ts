import { User } from './user';

export interface FailedProduct extends Document {
    name: string;             
    startDate: Date;       
    failureDate: Date;       
    description: string;    
    designedBy: string;    
    imageURL: string;             
    category: string;            
    upvotes: number;      
    downvotes: number;       
    comments: {   
        userId: string;
        text: string;
        date: Date;
    }[];
    _createdBy: User['id'];          
}