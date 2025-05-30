import type { Transaction } from "@/types/wallet"

// Types for wallet operations
export interface InstantDebitRequest {
    receiverEmail: string;
    bankName: string;
    amount: number;
    cbu: string;
}

export class Api {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    }

    // Método público para obtener la URL base
    getBaseUrl(): string {
        return this.baseUrl
    }

    async getBalance(email: string): Promise<number> {
        try {
            const response = await fetch(`${this.baseUrl}/wallet/balance?email=${encodeURIComponent(email)}`);
            if (!response.ok) {
                throw new Error(`Error getting balance: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }

    async transfer(senderEmail: string, receiverEmail: string, amount: number): Promise<string> {
        try {
            const response = await fetch(
                `${this.baseUrl}/wallet/transfer?senderEmail=${encodeURIComponent(senderEmail)}&receiverEmail=${encodeURIComponent(receiverEmail)}&amount=${amount}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Error making transfer: ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error making transfer:', error);
            throw error;
        }
    }

    async requestInstantDebit(request: InstantDebitRequest): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/wallet/instant-debit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                // Intentar obtener el mensaje de error del cuerpo de la respuesta
                const errorData = await response.json();
                if (errorData && typeof errorData === 'object' && 'message' in errorData) {
                    throw new Error(errorData.message);
                }
                // Si no hay mensaje específico, usar el statusText
                throw new Error(response.statusText);
            }

            return await response.text();
        } catch (error) {
            console.error('Error requesting instant debit:', error);
            throw error;
        }
    }

    async getUserTransactions(email: string): Promise<Transaction[]> {
        try {
            const response = await fetch(`${this.baseUrl}/transactions?email=${encodeURIComponent(email)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData && typeof errorData === 'object' && 'message' in errorData) {
                    throw new Error(errorData.message);
                }
                throw new Error(`Error getting transactions: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting transactions:', error);
            throw error;
        }
    }
} 