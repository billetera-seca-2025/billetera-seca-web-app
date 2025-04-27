import {
  AuthResponse,
  Balance,
  BalanceUpdate,
  TransferResponse,
  TransferCreate,
  DebinResponse,
  DebinCreate,
  DebinProcess,
  ApiError,
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Authentication
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error en la autenticación');
  }

  return response.json();
}

export async function register(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error en el registro');
  }

  const successMessage = await response.text();
  if (successMessage === "User created successfully") {
    return {
      user: {
        id: '1',
        name: email.split('@')[0],
        email: email,
      }
    };
  } else {
    throw new Error('Error inesperado en el registro');
  }
}

// Balance
export async function getBalance(): Promise<Balance> {
  const response = await fetch(`${API_URL}/balance`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error al obtener el saldo');
  }

  return response.json();
}

export async function loadBalance(
  amount: number,
  paymentMethod: string
): Promise<BalanceUpdate> {
  const response = await fetch(`${API_URL}/balance/load`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, paymentMethod }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error al cargar saldo');
  }

  return response.json();
}

// Transfers
export async function getTransfers(): Promise<TransferResponse> {
  const response = await fetch(`${API_URL}/transfers`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error al obtener las transferencias');
  }

  return response.json();
}

export async function createTransfer(
  recipientEmail: string,
  amount: number,
  description: string
): Promise<TransferCreate> {
  const response = await fetch(`${API_URL}/transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipientEmail, amount, description }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error al realizar la transferencia');
  }

  return response.json();
}

// DEBIN
export async function getDebinRequests(): Promise<DebinResponse> {
  const response = await fetch(`${API_URL}/debin`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error al obtener las solicitudes DEBIN');
  }

  return response.json();
}

export async function createDebinRequest(
  recipientEmail: string,
  amount: number,
  description: string,
  expirationDate: string
): Promise<DebinCreate> {
  const response = await fetch(`${API_URL}/debin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipientEmail,
      amount,
      description,
      expirationDate,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error al crear la solicitud DEBIN');
  }

  return response.json();
}

export async function processDebinRequest(
  debinId: string,
  action: 'approve' | 'reject'
): Promise<DebinProcess> {
  const response = await fetch(`${API_URL}/debin/${debinId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error al procesar la solicitud DEBIN');
  }

  return response.json();
}
