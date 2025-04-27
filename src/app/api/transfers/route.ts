import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // TODO: Implement actual transfers retrieval from your backend
    // This is a mock response
    return NextResponse.json(
      {
        transfers: [
          {
            id: '1',
            amount: 5000,
            type: 'received',
            description: 'Pago de Juan Pérez',
            date: '2024-03-15',
            status: 'completed',
          },
          {
            id: '2',
            amount: 2000,
            type: 'sent',
            description: 'Transferencia a María García',
            date: '2024-03-14',
            status: 'completed',
          },
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener las transferencias' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientEmail, amount, description } = body;

    // TODO: Implement actual transfer logic with your backend
    // This is a mock response
    // In a real implementation, you would:
    // 1. Validate the input
    // 2. Check if recipient exists
    // 3. Check if sender has sufficient balance
    // 4. Create the transfer record
    // 5. Update both users' balances
    // 6. Send notifications

    return NextResponse.json(
      {
        transferId: '12345',
        amount: amount,
        recipientEmail: recipientEmail,
        description: description,
        status: 'completed',
        date: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al realizar la transferencia' },
      { status: 500 }
    );
  }
} 