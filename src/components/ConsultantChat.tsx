import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, CandidateProfile, JobPosting } from '../types';
import { 
  Send, 
  Sparkles, 
  User, 
  Briefcase, 
  Bot, 
  HelpCircle, 
  CornerDownLeft,
  Loader2,
  Lightbulb
} from 'lucide-react';
import { apiService } from '../services/apiService';

interface ConsultantChatProps {
  profile: CandidateProfile;
  selectedJob?: JobPosting | null;
}

export const ConsultantChat: React.FC<ConsultantChatProps> = ({
  profile,
  selectedJob,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `반갑습니다. 20년간 현대차·기아 및 동남권(부·울·경) 모빌리티 부품사 채용을 담당해 온 전문 헤드헌터이자 취업 컨설턴트입니다.

지원자님의 자동차시스템공학 전공과 자동차 1차 협력사에서의 공정관리 데이터 실무 경험은 신입 생산관리 직무 지원 시 현장 감각과 데이터 분석력을 동시에 입증할 수 있는 탁월한 강점입니다.

궁금하신 점이 있다면 공고 분석, 이력서 강조점, 석사수료 관련 소명 전략, 면접 예상 질문 등 무엇이든 편하게 질문해 주십시오.`,
      timestamp: '08:00',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '1차 협력사 공정관리 데이터 경험을 이력서 첫 줄에 어떻게 요약할까요?',
    '석사수료 상태인데 면접관이 왜 학위 안 땄는지 물어보면 어떻게 답하나요?',
    '현대모비스 울산공장 전동화 라인 생산관리에서 가장 중요한 제조 KPI는 무엇인가요?',
    '에스엘(SL) 진량공단 램프 생산관리 지원 시 어필할 핵심 역량은?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await apiService.sendChat([...messages, userMsg], profile, selectedJob);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: '네트워크 연결 상태를 확인 후 다시 질문해 주세요.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[650px] overflow-hidden backdrop-blur-md">
      {/* Consultant Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                20년 경력 미래모빌리티 취업 컨설턴트 AI
              </h3>
              <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                실시간 상담 가능
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {selectedJob ? (
                <span>현재 연계 공고: <strong className="text-cyan-300">{selectedJob.companyName} ({selectedJob.jobTitle})</strong></span>
              ) : (
                <span>부산·울산·경북 생산관리 직무 맞춤 RTSC 지침 적용 중</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white'
            }`}>
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none whitespace-pre-line shadow-sm'
            }`}>
              {m.content}
              <div className={`text-[10px] mt-1 text-right ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 text-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-300 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>제조업 직무분석 관점에서 답변을 검토 중입니다...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
        <span className="text-[11px] text-slate-500 shrink-0">추천 질문:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] text-slate-300 hover:text-cyan-300 bg-slate-800 hover:bg-slate-700/80 px-2.5 py-1 rounded-md border border-slate-700/60 whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="이력서 작성, 자격 요건, 면접 대비 등 궁금한 내용을 물어보세요..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white font-semibold transition flex items-center justify-center shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
