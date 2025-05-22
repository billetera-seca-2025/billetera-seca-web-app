export interface TransactionDTO {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: string;
    sender?: string;
    recipient?: string;
} 