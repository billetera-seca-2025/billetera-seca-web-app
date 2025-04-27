import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // TODO: Implement actual balance retrieval from your backend
    // This is a mock response
    return NextResponse.json(
      {
        balance: 15000,
        currency: 'ARS',
        lastUpdated: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el saldo' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, paymentMethod } = body;

    // TODO: Implement actual balance update logic with your backend
    // This is a mock response
    return NextResponse.json(
      {
        balance: 15000 + Number(amount),
        currency: 'ARS',
        lastUpdated: new Date().toISOString(),
        transactionId: '123456',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el saldo' },
      { status: 500 }
    );
  }
} 