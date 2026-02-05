import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Pause } from 'lucide-react';

interface PatternInfo {
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  borderColor: string;
  bgColor: string;
  code: string;
  costPer1M: string;
  costColor: string;
  billingNote: string;
}

export const CodeComparison: React.FC = () => {
  const patterns: PatternInfo[] = [
    {
      name: 'Traditional Lambda',
      subtitle: 'Synchronous, blocking',
      icon: <Clock size={18} />,
      borderColor: 'border-red-500/50',
      bgColor: 'bg-red-500/10',
      costPer1M: '~$667',
      costColor: 'text-red-400',
      billingNote: 'Billed for full 40s wait',
      code: `import json
import openai

def handler(event, context):
    # === BILLING STARTS ===
    
    body = json.loads(event['body'])
    prompt = build_prompt(body['message'])
    
    # Call LLM - you WAIT, you PAY
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Still paying while GPT thinks...
    # Still paying... (20-40 seconds)
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "response": response.choices[0].message.content
        })
    }
    # === BILLING ENDS ===`
    },
    {
      name: 'Streaming Response',
      subtitle: 'Better UX, same cost',
      icon: <DollarSign size={18} />,
      borderColor: 'border-yellow-500/50',
      bgColor: 'bg-yellow-500/10',
      costPer1M: '~$667',
      costColor: 'text-yellow-400',
      billingNote: 'Same billing, better UX',
      code: `import json
import openai

def handler(event, response_stream):
    # === BILLING STARTS ===
    
    body = json.loads(event['body'])
    prompt = build_prompt(body['message'])
    
    # Stream tokens as they arrive
    stream = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        stream=True  # Enable streaming
    )
    
    # User sees tokens immediately!
    for chunk in stream:
        token = chunk.choices[0].delta.content or ""
        response_stream.write(token)
        # But Lambda is STILL running...
    
    response_stream.end()
    # === BILLING ENDS (same duration!) ===`
    },
    {
      name: 'Durable Functions',
      subtitle: 'Pay only for compute',
      icon: <Pause size={18} />,
      borderColor: 'border-green-500/50',
      bgColor: 'bg-green-500/10',
      costPer1M: '~$8-15',
      costColor: 'text-green-400',
      billingNote: 'No billing during wait!',
      code: `from aws_durable import DurableClient
import openai

@DurableClient.function
async def handler(ctx):
    # === BILLING STARTS ===
    prompt = build_prompt(ctx.input['message'])
    # === BILLING PAUSES (checkpoint) ===
    
    # Function HIBERNATES during LLM call!
    response = await ctx.step("call_llm", lambda:
        openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
    )
    
    # === BILLING RESUMES (briefly) ===
    result = response.choices[0].message.content
    
    return {"response": result}
    # === BILLING ENDS (~100ms total) ===`
    }
  ];

  // Python syntax highlighting using single-pass tokenization
  const highlightPython = (code: string) => {
    const tokens: { type: string; value: string }[] = [];
    let remaining = code;
    
    const patterns: [string, RegExp][] = [
      ['comment', /^(#.*?)(?=\n|$)/],
      ['string', /^("(?:[^"\\]|\\.)*")/],
      ['string', /^('(?:[^'\\]|\\.)*')/],
      ['decorator', /^(@\w+(?:\.\w+)*)/],
      ['keyword', /^(import|from|def|async|await|return|for|in|if|else|elif|lambda|True|False|None|or|and|not|with|as|try|except|finally|class|raise|yield|pass|break|continue)\b/],
      ['number', /^(\d+(?:\.\d+)?)/],
      ['function', /^(\w+)(?=\()/],
      ['identifier', /^(\w+)/],
      ['whitespace', /^(\s+)/],
      ['other', /^(.)/],
    ];
    
    while (remaining.length > 0) {
      let matched = false;
      for (const [type, pattern] of patterns) {
        const match = remaining.match(pattern);
        if (match) {
          tokens.push({ type, value: match[1] });
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        tokens.push({ type: 'other', value: remaining[0] });
        remaining = remaining.slice(1);
      }
    }
    
    const colorMap: Record<string, string> = {
      comment: 'text-gray-500',
      string: 'text-green-400',
      keyword: 'text-purple-400',
      decorator: 'text-yellow-400',
      function: 'text-blue-400',
      number: 'text-orange-400',
    };
    
    return tokens.map(token => {
      const color = colorMap[token.type];
      const escaped = token.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return color ? `<span class="${color}">${escaped}</span>` : escaped;
    }).join('');
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {patterns.map((pattern, idx) => (
        <motion.div
          key={pattern.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`flex flex-col rounded-xl border-2 ${pattern.borderColor} overflow-hidden`}
        >
          {/* Header */}
          <div className={`p-3 ${pattern.bgColor} border-b ${pattern.borderColor}`}>
            <div className="flex items-center gap-2">
              <span className={pattern.costColor}>{pattern.icon}</span>
              <div>
                <h3 className="font-bold text-white text-sm">{pattern.name}</h3>
                <p className="text-xs text-gray-400">{pattern.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Code Block */}
          <div className="flex-1 bg-[#1e1e1e] overflow-auto">
            <pre className="p-3 text-[10px] leading-relaxed font-mono">
              <code dangerouslySetInnerHTML={{ __html: highlightPython(pattern.code) }} />
            </pre>
          </div>

          {/* Cost Footer */}
          <div className={`p-3 ${pattern.bgColor} border-t ${pattern.borderColor}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{pattern.billingNote}</span>
              <div className="text-right">
                <div className="text-xs text-gray-500">Cost per 1M reqs</div>
                <div className={`text-lg font-bold font-mono ${pattern.costColor}`}>
                  {pattern.costPer1M}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
