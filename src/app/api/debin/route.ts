import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // TODO: Implement actual DEBIN requests retrieval from your backend
    // This is a mock response
    return NextResponse.json(
      {
        debinRequests: [
          {
            id: '1',
            amount: 1500,
            description: 'Pago de servicios',
            requestedBy: 'juan@example.com',
            expirationDate: '2024-03-20',
            status: 'pending',
          },
          {
            id: '2',
            amount: 3000,
            description: 'Alquiler',
            requestedBy: 'maria@example.com',
            expirationDate: '2024-03-25',
            status: 'completed',
          },
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener las solicitudes DEBIN' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientEmail, amount, description, expirationDate } = body;

    // TODO: Implement actual DEBIN request creation with your backend
    // This is a mock response
    // In a real implementation, you would:
    // 1. Validate the input
    // 2. Check if recipient exists
    // 3. Create the DEBIN request
    // 4. Send notification to recipient

    return NextResponse.json(
      {
        debinId: '12345',
        amount: amount,
        recipientEmail: recipientEmail,
        description: description,
        expirationDate: expirationDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear la solicitud DEBIN' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { debinId, action } = body;

    // TODO: Implement actual DEBIN approval/rejection logic
    // This is a mock response
    // In a real implementation, you would:
    // 1. Validate the DEBIN exists and is pending
    // 2. Check if user has permission to approve/reject
    // 3. If approved, process the payment
    // 4. Update DEBIN status
    // 5. Send notifications

    return NextResponse.json(
      {
        debinId: debinId,
        status: action === 'approve' ? 'completed' : 'rejected',
        processedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al procesar la solicitud DEBIN' },
      { status: 500 }
    );
  }
} 