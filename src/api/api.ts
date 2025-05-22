import type { Transaction } from "@/types/wallet"

// Types for wallet operations
export interface InstantDebitRequest {
    receiverEmail: string;
    bankName: string;
    amount: number;
    walletId?: string;
}

export class Api {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    }

    // Método público para obtener la URL base
    getBaseUrl(): string {
        return this.baseUrl
    }

    async getBalance(email: string, walletId?: string): Promise<number> {
        try {
            const url = new URL(`${this.baseUrl}/wallet/balance`);
            url.searchParams.append('email', email);
            if (walletId) {
                url.searchParams.append('walletId', walletId);
            }
            
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`Error getting balance: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }

    async transfer(
        senderEmail: string, 
        receiverEmail: string, 
        amount: number,
        senderWalletId?: string,
        receiverWalletId?: string
    ): Promise<string> {
        try {
            const url = new URL(`${this.baseUrl}/wallet/transfer`);
            url.searchParams.append('senderEmail', senderEmail);
            url.searchParams.append('receiverEmail', receiverEmail);
            url.searchParams.append('amount', amount.toString());
            if (senderWalletId) {
                url.searchParams.append('senderWalletId', senderWalletId);
            }
            if (receiverWalletId) {
                url.searchParams.append('receiverWalletId', receiverWalletId);
            }

            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
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
            const response = await fetch(`${this.baseUrl}/transactions/user?email=${encodeURIComponent(email)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData && typeof errorData === 'object' && 'message' in errorData) {
                    throw new Error(errorData.message);
                }
                throw new Error(`Error getting user transactions: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting user transactions:', error);
            throw error;
        }
    }

    async getWalletTransactions(walletId: string): Promise<Transaction[]> {
        try {
            const response = await fetch(`${this.baseUrl}/transactions/wallet?walletId=${encodeURIComponent(walletId)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData && typeof errorData === 'object' && 'message' in errorData) {
                    throw new Error(errorData.message);
                }
                throw new Error(`Error getting wallet transactions: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting wallet transactions:', error);
            throw error;
        }
    }
} 