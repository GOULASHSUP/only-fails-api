export interface User extends Document {
    id: string;             
    username: string;         
    email: string;              
    password: string;           
    role: 'admin' | 'user';     
    isBanned: boolean;        
    votes: {                   
        productId: string;
        voteType: 'up' | 'down';
    }[];
    comments: string[];       
    registerDate: Date;       
}