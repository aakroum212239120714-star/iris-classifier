import React from 'react';
import { PredictRequest, PredictResponse, Language } from '../types';
import { translations } from '../i18n/translations';
import { RotateCcw, Sparkles } from 'lucide-react';

interface PredictCardProps {
  language: Language;
  values: PredictRequest;
  onChange: (key: keyof PredictRequest, val: number) => void;
  onReset: () => void;
  prediction: PredictResponse | null;
  loading: boolean;
}

const FEATURE_CONFIGS = [
  { key: 'sepal_length' as const, min: 4.0, max: 8.0, step: 0.1, default: 5.1, color: 'emerald' },
  { key: 'sepal_width' as const, min: 2.0, max: 4.5, step: 0.1, default: 3.5, color: 'blue' },
  { key: 'petal_length' as const, min: 1.0, max: 7.0, step: 0.1, default: 1.4, color: 'purple' },
  { key: 'petal_width' as const, min: 0.1, max: 2.6, step: 0.1, default: 0.2, color: 'rose' },
];

const SPECIES_THEMES: Record<string, { bg: string; border: string; text: string; badge: string; desc: string }> = {
  setosa: {
    bg: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-900/30 dark:to-indigo-900/30',
    border: 'border-blue-400 dark:border-blue-600',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
    desc: 'Iris setosa: Distinguished by smaller petals and distinctively short floral structures.',
  },
  versicolor: {
    bg: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/30 dark:to-teal-900/30',
    border: 'border-emerald-400 dark:border-emerald-600',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    desc: 'Iris versicolor: Intermediate petal size and balanced proportions.',
  },
  virginica: {
    bg: 'from-purple-500/10 to-pink-500/10 dark:from-purple-900/30 dark:to-pink-900/30',
    border: 'border-purple-400 dark:border-purple-600',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200',
    desc: 'Iris virginica: Characterized by the longest petals and highest width values.',
  },
};

export const PredictCard: React.FC<PredictCardProps> = ({
  language,
  values,
  onChange,
  onReset,
  prediction,
  loading,
}) => {
  const t = translations[language];

  const speciesNameMap: Record<string, string> = {
    setosa: t.setosa,
    versicolor: t.versicolor,
    virginica: t.virginica,
  };

  const featureLabels: Record<string, string> = {
    sepal_length: t.sepalLength,
    sepal_width: t.sepalWidth,
    petal_length: t.petalLength,
    petal_width: t.petalWidth,
  };

  const currentTheme = prediction?.predicted_class
    ? SPECIES_THEMES[prediction.predicted_class.toLowerCase()] || SPECIES_THEMES.setosa
    : SPECIES_THEMES.setosa;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Sliders Card */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              {t.inputCardTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.inputCardSubtitle}
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition"
            title={t.resetDefault}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.resetDefault}</span>
          </button>
        </div>

        <div className="space-y-5">
          {FEATURE_CONFIGS.map((f) => {
            const val = values[f.key];
            return (
              <div key={f.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label htmlFor={f.key} className="text-slate-700 dark:text-slate-300">
                    {featureLabels[f.key]}
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      id={`${f.key}-input`}
                      type="number"
                      step={f.step}
                      min={f.min}
                      max={f.max}
                      value={val}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        if (!isNaN(parsed)) {
                          onChange(f.key, Math.min(Math.max(parsed, f.min), f.max));
                        }
                      }}
                      className="w-16 px-1.5 py-0.5 text-right font-mono text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-slate-400 dark:text-slate-500">{t.cm}</span>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    id={f.key}
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={val}
                    onChange={(e) => onChange(f.key, parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  <span>{f.min} {t.cm}</span>
                  <span>{f.max} {t.cm}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prediction Output Card */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
        {/* Decorative backdrop glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bg} pointer-events-none transition-all duration-300 opacity-60`}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
              {t.predictionResult}
            </span>
            {loading && (
              <span className="text-xs animate-pulse text-emerald-600 dark:text-emerald-400 font-medium">
                {t.predicting}
              </span>
            )}
          </div>

          {/* Main Species Badge */}
          <div className="my-5 text-center sm:text-start">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              {t.predictedSpecies}
            </span>
            <div className="flex items-baseline gap-2 flex-wrap justify-center sm:justify-start">
              <span className={`text-3xl font-extrabold tracking-tight ${currentTheme.text}`}>
                {prediction ? speciesNameMap[prediction.predicted_class.toLowerCase()] || prediction.predicted_class : '...'}
              </span>
              {prediction && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${currentTheme.badge}`}>
                  {(
                    (prediction.probabilities[prediction.predicted_class] || 0) * 100
                  ).toFixed(1)}
                  % {t.confidence}
                </span>
              )}
            </div>
          </div>

          {/* Probabilities Bars */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {t.probabilities}
            </div>

            {['setosa', 'versicolor', 'virginica'].map((sp) => {
              const prob = prediction ? prediction.probabilities[sp] || 0 : 0;
              const pct = (prob * 100).toFixed(1);
              const isSelected = prediction?.predicted_class?.toLowerCase() === sp;

              return (
                <div key={sp} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className={isSelected ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}>
                      {speciesNameMap[sp]}
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        sp === 'setosa'
                          ? 'bg-blue-500'
                          : sp === 'versicolor'
                          ? 'bg-emerald-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info note */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500">
          {prediction && (
            <div className="flex items-center gap-1.5 font-mono">
              <span>{t.decisionRule}:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {prediction.decision_path.length} {t.samples} (path: {prediction.decision_path.join(' → ')})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
