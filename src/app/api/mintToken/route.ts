import { NextResponse } from 'next/server';

const EXPRESS_SERVER_URL = 'https://e2fc62be-d891-45f1-8695-5c9659b6c880.us-east-1.cloud.genez.io'; // Update with your Express server URL

export async function POST(request: Request) {
  const { userWalletAddress, amount } = await request.json();

  try {
    const response = await fetch(`${EXPRESS_SERVER_URL}/api/transfer/transfer-funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userWalletAddress, amount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Express server error');
    }

    const responseData = await response.json();

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[DEBUG] Error hitting Express server:', error);
    return NextResponse.json(
      {
        message: 'Failed to transfer funds',
        error: error,
      },
      { status: 500 }
    );
  }
}
