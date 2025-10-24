import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, validatorData, transactionData } = await request.json();
    
    // Create a deep lore context for the AI
    const systemPrompt = `You are an AI assistant for the 01A Labs AI Layer-2 blockchain network. You have deep knowledge about the validators, their specializations, and the lore of this decentralized AI network.

VALIDATOR LORE:
- GPT-4 Secondary Validator: Specializes in secondary AI model validation and cross-verification
- ViT Ensemble Validator: Handles Vision Transformer ensemble models for computer vision tasks
- Llama 3.1 Cluster Validator: Manages Llama language model clusters for NLP processing
- Audio Genesis Validator: Processes audio generation and speech synthesis models
- Embeddings Pro Validator: Handles embedding generation and semantic search
- Vision Transformers Validator: Specializes in computer vision and image processing
- GPT-4 Inference Validator: Manages GPT-4 inference requests and responses

NETWORK LORE:
- The 01A network is a specialized AI Layer-2 that processes AI workloads on-chain
- Validators earn rewards by validating AI model outputs and maintaining network security
- Each validator has unique specializations and geographic locations
- The network processes thousands of AI transactions daily
- Validators stake 01A tokens to participate and earn rewards
- Commission rates vary based on validator performance and specialization

Generate engaging, lore-rich responses about validators, their transactions, network activity, and the broader 01A ecosystem. Be conversational but technical, and include specific details about validator specializations and network operations.`;

    const userMessage = `User: ${message}

Current Validator Data:
${JSON.stringify(validatorData, null, 2)}

Recent Transaction Data:
${JSON.stringify(transactionData, null, 2)}

Please respond as an AI assistant with deep knowledge of the 01A network, validators, and their operations.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      validator: '01A Network AI',
    });

  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback response if API fails
    const fallbackResponses = [
      "The 01A network validators are processing AI workloads at incredible speeds. GPT-4 Secondary Validator just completed a complex inference task with 99.9% uptime!",
      "ViT Ensemble Validator in Canada is handling vision processing for the network. Their 98.2% uptime shows excellent performance across the subnet.",
      "The Llama 3.1 Cluster Validator in EU-East is managing language model clusters efficiently. Their 99.5% uptime demonstrates reliable AI processing.",
      "Audio Genesis Validator is processing speech synthesis requests with 98.8% uptime. The US-West location provides low-latency audio processing.",
      "Embeddings Pro Validator in Asia-Pacific is generating semantic embeddings with 99.2% uptime. Their specialized hardware optimizes embedding generation.",
      "Vision Transformers Validator in EU-West maintains 98.5% uptime while processing computer vision tasks. Their geographic distribution ensures global coverage.",
      "GPT-4 Inference Validator in US-East achieves 99.8% uptime processing inference requests. Their optimized infrastructure handles high-volume AI workloads."
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return NextResponse.json({
      response: randomResponse,
      timestamp: new Date().toISOString(),
      validator: '01A Network AI',
      fallback: true
    });
  }
}
