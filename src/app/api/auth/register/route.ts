import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // TODO: Implement actual user creation logic with your backend
    // This is a mock response
    // In a real implementation, you would:
    // 1. Validate the input
    // 2. Check if user already exists
    // 3. Hash the password
    // 4. Store in database
    // 5. Generate JWT token

    return NextResponse.json(
      {
        user: {
          id: '1',
          name: name,
          email: email,
        },
        token: 'mock_jwt_token',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
} 