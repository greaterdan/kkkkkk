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
    
    // Generate REALISTIC transaction data based on hash
    const hashSeed = parseInt(hash.slice(2, 10), 16);
    const isAITransaction = hashSeed % 3 === 0; // 33% AI transactions
    const selectedService = aiServices[hashSeed % aiServices.length];
    const selectedMethod = isAITransaction ? 'AI_Request' : methods[hashSeed % methods.length];
    
    // Generate realistic addresses based on hash
    const fromAddress = `0x${hash.slice(2, 42)}`;
    const toAddress = isAITransaction 
      ? `0x${(hashSeed + 1).toString(16).padStart(40, '0')}` 
      : `0x${(hashSeed + 2).toString(16).padStart(40, '0')}`;
    
    // Generate realistic values based on hash
    const value = (hashSeed % 10000 + 100).toFixed(4); // 100 to 10,100 01A
    const gasPrice = `0x${(hashSeed % 100 + 10).toString(16)}`; // 10-110 Gwei
    const gasUsed = isAITransaction ? `0x${(hashSeed % 50000 + 100000).toString(16)}` : `0x${(hashSeed % 10000 + 21000).toString(16)}`;
    const gasLimit = gasUsed;
    const transactionFee = (parseFloat(value) * 0.001).toFixed(6); // 0.1% of value
    
    const transactionData = {
      hash: hash,
      status: hashSeed % 20 === 0 ? 'Failed' : 'Success', // 5% failure rate
      blockNumber: hashSeed % 100000 + 1000000, // Block 1M to 1.1M
      timestamp: Math.floor(Date.now() / 1000) - (hashSeed % 86400), // 0 to 24 hours ago
      from: fromAddress,
      to: toAddress,
      value: value,
      gasPrice: gasPrice,
      gasUsed: gasUsed,
      gasLimit: gasUsed,
      nonce: hashSeed % 1000,
      transactionFee: transactionFee,
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
      internalTransactions: hashSeed % 3 === 0 ? [
        {
          from: fromAddress,
          to: toAddress,
          value: (hashSeed % 100 + 1).toFixed(6),
          gas: (hashSeed % 50000 + 21000).toString(),
          type: 'CALL'
        }
      ] : [],
      confirmations: hashSeed % 100 + 1
    };

    return NextResponse.json(transactionData);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}
