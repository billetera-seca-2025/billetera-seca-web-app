// User types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
}

// Balance types
export interface Balance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface BalanceUpdate {
  balance: number;
  currency: string;
  lastUpdated: string;
  transactionId: string;
}

// Transfer types
export interface Transfer {
  id: string;
  amount: number;
  type: 'sent' | 'received';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface TransferResponse {
  transfers: Transfer[];
}

export interface TransferCreate {
  transferId: string;
  amount: number;
  recipientEmail: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

// DEBIN types
export interface DebinRequest {
  id: string;
  amount: number;
  description: string;
  requestedBy: string;
  expirationDate: string;
  status: 'pending' | 'completed' | 'rejected';
}

export interface DebinResponse {
  debinRequests: DebinRequest[];
}

export interface DebinCreate {
  debinId: string;
  amount: number;
  recipientEmail: string;
  description: string;
  expirationDate: string;
  status: 'pending';
  createdAt: string;
}

export interface DebinProcess {
  debinId: string;
  status: 'completed' | 'rejected';
  processedAt: string;
}

// Error types
export interface ApiError {
  error: string;
} 