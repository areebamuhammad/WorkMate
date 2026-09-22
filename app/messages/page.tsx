'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, MessageSquareText, User, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tone = 'Friendly' | 'Professional' | 'Casual';

export default function MessagesPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [suggestedReply, setSuggestedReply] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('Friendly');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerMessage, setCustomerMessage] = useState("Hi, I ordered this two days ago but nobody has told me when it will arrive.");

  const handleGenerateReply = async (forcedTone?: Tone) => {
    if (!customerMessage.trim()) {
      setError('Please enter a customer message first.');
      return;
    }

    const toneToUse = forcedTone || selectedTone;
    
    setIsProcessing(true);
    setSuggestedReply('');
    setCopied(false);
    setError(null);
    
    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerMessage, tone: toneToUse })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate reply.');
      }

      const data = await response.json();
      setSuggestedReply(data.reply || '');
      setHasGenerated(true);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'An error occurred. Please try again.');
      setHasGenerated(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomerMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomerMessage(e.target.value);
    if (error) {
      setError(null);
    }
    if (hasGenerated) {
      setHasGenerated(false);
    }
  };

  const tones: Tone[] = ['Friendly', 'Professional', 'Casual'];

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] w-full pt-10 pb-20">
      <div className="w-full max-w-3xl flex flex-col gap-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white/5 rounded-2xl mb-2 border border-white/10 shadow-lg">
            <MessageSquareText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white drop-shadow-sm">
            Communication Assistant
          </h1>
        </div>

        {/* Customer Message Bubble */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2 w-full"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-2">
            <User className="w-4 h-4" /> Customer
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-sm shadow-xl focus-within:bg-white/15 focus-within:border-white/20 transition-all">
            <textarea
              value={customerMessage}
              onChange={handleCustomerMessageChange}
              placeholder="Paste customer message here..."
              className="w-full bg-transparent p-6 text-lg text-white resize-none outline-none min-h-[120px] placeholder:text-white/30"
            />
          </div>
        </motion.div>

        {/* AI Action Area */}
        <div className="flex flex-col items-center gap-6">

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {!isProcessing && !hasGenerated && (
              <motion.button
                key="generate-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                onClick={() => handleGenerateReply()}
                className="group relative overflow-hidden flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] mt-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>GENERATE REPLY</span>
              </motion.button>
            )}

            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="relative flex items-center justify-center w-16 h-16">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-indigo-500/40 rounded-full blur-xl"
                  />
                  <Bot className="w-8 h-8 text-white relative z-10" />
                </div>
                <span className="text-white font-medium tracking-widest uppercase text-sm animate-pulse">
                  Drafting response...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Area */}
          <AnimatePresence>
            {hasGenerated && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col gap-6"
              >
                {/* Tone Controls as floating pills */}
                <div className="flex items-center justify-center gap-2 p-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md self-center">
                  {tones.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => {
                        setSelectedTone(tone);
                        handleGenerateReply(tone);
                      }}
                      className={cn(
                        "px-5 py-2 rounded-full text-sm font-medium transition-all",
                        selectedTone === tone 
                          ? "bg-white text-black shadow-lg" 
                          : "text-muted-foreground hover:text-white hover:bg-white/10"
                      )}
                    >
                      {tone}
                    </button>
                  ))}
                </div>

                {/* AI Reply Bubble */}
                <div className="flex flex-col gap-2 items-end mt-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-300 mr-2">
                    WorkMate AI <Bot className="w-4 h-4" />
                  </div>
                  <div className="relative group bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 rounded-2xl rounded-tr-sm p-6 text-lg text-white shadow-xl max-w-[90%]">
                    {/* Subtle typing animation using framer-motion */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="leading-relaxed"
                    >
                      {suggestedReply}
                    </motion.p>
                    
                    <div className="absolute -bottom-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            COPIED
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            COPY
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
