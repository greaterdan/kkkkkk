import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    const { hash } = params;
    
    // Generate realistic 01A L2 transaction data
    const aiServices = [
      'GPT-4 Inference', 'DALL-E 3 Image Generation', 'Claude Text Processing', 
      'Whisper Audio Transcription', 'Embedding Calculation', 'Vision Analysis',
      'Code Generation', 'Language Translation', 'Text Summarization', 'Sentiment Analysis'
    ];
    
    const methods = [
      'Transfer', 'Approve', 'Mint', 'Burn', 'Stake', 'Unstake', 
      'AI_Request', 'Model_Deploy', 'Inference_Call', 'Data_Upload'
    ];
    
    const isAITransaction = Math.random() > 0.3;
    const selectedService = aiServices[Math.floor(Math.random() * aiServices.length)];
    const selectedMethod = isAITransaction ? 'AI_Request' : methods[Math.floor(Math.random() * methods.length)];
    
    const transactionData = {
      hash: hash,
      status: Math.random() > 0.05 ? 'Success' : 'Failed',
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      timestamp: Math.floor(Date.now() / 1000) - Math.random() * 3600,
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: isAITransaction ? '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce' : '0x1234567890123456789012345678901234567890',
      value: (Math.random() * 100).toFixed(4),
      gasPrice: '0x5d21dba00', // 25 Gwei
      gasUsed: isAITransaction ? '0x186a0' : '0x5208', // 100,000 for AI, 21,000 for transfer
      gasLimit: isAITransaction ? '0x186a0' : '0x5208',
      nonce: Math.floor(Math.random() * 1000),
      transactionFee: (Math.random() * 0.01).toFixed(6),
      aiService: isAITransaction ? selectedService : undefined,
      method: selectedMethod,
      input: isAITransaction 
        ? '0x1234567890123456789012345678901234567890123456789012345678901234567890'
        : '0xa9059cbb00000000000000000000000095ad61b0a150d79219dcf64e1e6cc01f0b64c4ce0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      logs: isAITransaction ? [
        {
          address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
          topics: [
            '0x8f4f8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b',
            '0x000000000000000000000000742d35cc6634c0532925a3b844bc454e4438f44e',
            '0x00000000000000000000000095ad61b0a150d79219dcf64e1e6cc01f0b64c4ce'
          ],
          data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000'
        },
        {
          address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
          topics: [
            '0x1234567890123456789012345678901234567890123456789012345678901234',
            '0x000000000000000000000000742d35cc6634c0532925a3b844bc454e4438f44e'
          ],
          data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000'
        },
        {
          address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
          topics: [
            '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
          ],
          data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000'
        }
      ] : [
        {
          address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x000000000000000000000000742d35cc6634c0532925a3b844bc454e4438f44e',
            '0x00000000000000000000000095ad61b0a150d79219dcf64e1e6cc01f0b64c4ce'
          ],
          data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000'
        }
      ],
      internalTransactions: [
        {
          from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          to: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
          value: '0.001',
          gas: '21000',
          type: 'CALL'
        }
      ],
      confirmations: Math.floor(Math.random() * 100) + 1
    };

    return NextResponse.json(transactionData);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}
