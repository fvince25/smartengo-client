export interface Article {
    id: string;
    name: string;
    comments: any[];
    reactions: any[];
    Tag: string[];
    content: string;
    draft: boolean;
    reference: string;
    userId: string;
    createdAt: string;
    updateAt: string;
    username: string;
    isEditable: boolean;
}


