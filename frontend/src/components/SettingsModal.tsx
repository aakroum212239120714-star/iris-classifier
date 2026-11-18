import React, { useState } from 'react';
import { RetrainRequest, Language } from '../types';
import { translations } from '../i18n/translations';
import { X, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onRetrain: (params: RetrainRequest) => Promise<void>;
  currentParams?: {
    max_depth: number;
    criterion: string;
    test_size: number;
    random_state: number;
  };
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  language,
  isOpen,
  onClose,
  onRetrain,
  currentParams,
}) => {
  const t = translations[language];

  const [maxDepth, setMaxDepth] = useState<number>(currentParams?.max_depth || 3);
  const [criterion, setCriterion] = useState<'gini' | 'entropy' | 'log_loss'>(
    (currentParams?.criterion as any) || 'entropy'
  );
  const [testSize, setTestSize] = useState<number>(currentParams?.test_size || 0.2);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    try {
      await onRetrain({
        max_depth: maxDepth,
        criterion,
        test_size: testSize,
        random_state: 42,
      });
      setStatusMessage({ type: 'success', text: t.retrainSuccess });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || t.retrainError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.modalTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.modalSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Criterion */}
          <div className="space-y-1.5">
            <label htmlFor="criterion-select" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.criterionLabel}
            </label>
            <select
              id="criterion-select"
              value={criterion}
              onChange={(e) => setCriterion(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="entropy">entropy (Information Gain - from iris.ipynb)</option>
              <option value="gini">gini (Gini Impurity)</option>
              <option value="log_loss">log_loss (Shannon Information)</option>
            </select>
          </div>

          {/* Max Depth Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="max-depth-slider" className="text-slate-700 dark:text-slate-300">{t.maxDepthLabel}</label>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{maxDepth}</span>
            </div>
            <input
              id="max-depth-slider"
              type="range"
              min={1}
              max={8}
              step={1}
              value={maxDepth}
              onChange={(e) => setMaxDepth(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 (stump)</span>
              <span>8 (deep)</span>
            </div>
          </div>

          {/* Test Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="test-size-slider" className="text-slate-700 dark:text-slate-300">{t.testSizeLabel}</label>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {(testSize * 100).toFixed(0)}%
              </span>
            </div>
            <input
              id="test-size-slider"
              type="range"
              min={0.1}
              max={0.4}
              step={0.05}
              value={testSize}
              onChange={(e) => setTestSize(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (15 samples)</span>
              <span>40% (60 samples)</span>
            </div>
          </div>

          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {t.close}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 shadow-sm transition"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? t.retraining : t.retrainBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
