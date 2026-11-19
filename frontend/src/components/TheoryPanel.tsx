import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { BookOpen, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface TheoryPanelProps {
  language: Language;
  topic: 'tp1' | 'tp2';
}

export const TheoryPanel: React.FC<TheoryPanelProps> = ({ language, topic }) => {
  const t = translations[language];
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tp1Questions = [
    { id: 'slr_vs_mlr', q: t.qSLRvsMLR, a: t.aSLRvsMLR },
    { id: 'slope_intercept', q: t.qSlopeIntercept, a: t.aSlopeIntercept },
    { id: 'perc_vs_linreg', q: t.qPerceptronVsLinReg, a: t.aPerceptronVsLinReg },
  ];

  const tp2Questions = [
    { id: 'activation', q: t.qActivation, a: t.aActivation },
    { id: 'learning_rate', q: t.qLearningRate, a: t.aLearningRate },
    { id: 'xor_minsky', q: t.qXORLinearSeparability, a: t.aXORLinearSeparability },
    { id: 'ovr_multiclass', q: t.qBinaryVsMulticlass, a: t.aBinaryVsMulticlass },
  ];

  const questions = topic === 'tp1' ? tp1Questions : tp2Questions;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm mt-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {t.theoryTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {topic === 'tp1' ? 'Linear Regression theory & analysis' : 'Perceptron formulation & convergence guarantees'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((item) => {
          const isOpen = !!openItems[item.id];
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all bg-slate-50/50 dark:bg-slate-800/40"
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full px-4 py-3 text-start flex items-center justify-between gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item.q}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/40">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
