import { NextResponse } from 'next/server';
import { AuthResponse, ApiError } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Implement actual authentication logic with your backend
    // This is a mock response
    if (email === 'demo@example.com' && password === 'password123') {
      const response: AuthResponse = {
        user: {
          id: '1',
          name: 'Demo User',
          email: email,
        },
        token: 'mock_jwt_token',
      };
      return NextResponse.json(response, { status: 200 });
    }

    const error: ApiError = { error: 'Credenciales inválidas' };
    return NextResponse.json(error, { status: 401 });
  } catch (error) {
    const apiError: ApiError = { error: 'Error en el servidor' };
    return NextResponse.json(apiError, { status: 500 });
  }
} 