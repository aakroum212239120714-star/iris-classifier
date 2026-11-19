import React, { useState, useEffect } from 'react';
import { Language, PerceptronResponse, PredictPerceptronRequest, PredictPerceptronResponse } from '../types';
import { apiClient } from '../api/client';
import { translations } from '../i18n/translations';
import {
  Cpu,
  Sliders,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  GitCommit,
  Grid3X3
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface TP2PerceptronViewProps {
  language: Language;
}

export const TP2PerceptronView: React.FC<TP2PerceptronViewProps> = ({ language }) => {
  const t = translations[language];

  // Mode: binary or multiclass
  const [mode, setMode] = useState<'binary' | 'multiclass'>('binary');
  const [useAllFeatures, setUseAllFeatures] = useState<boolean>(false);
  const [lr, setLr] = useState<number>(0.1);
  const [epochs, setEpochs] = useState<number>(20);

  const [data, setData] = useState<PerceptronResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retraining, setRetraining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Prediction playground
  const [predInput, setPredInput] = useState<PredictPerceptronRequest>({
    petal_length: 1.4,
    petal_width: 0.2,
    sepal_length: 5.1,
    sepal_width: 3.5,
  });
  const [predResult, setPredResult] = useState<PredictPerceptronResponse | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'binary') {
        const res = await apiClient.getTP2Binary();
        setData(res);
        setEpochs(res.epochs);
        setLr(res.lr);
      } else {
        const res = await apiClient.getTP2Multiclass(useAllFeatures);
        setData(res);
        setEpochs(res.epochs);
        setLr(res.lr);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Perceptron data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mode, useAllFeatures]);

  const handleRetrain = async (e: React.FormEvent) => {
    e.preventDefault();
    setRetraining(true);
    setError(null);
    try {
      const res = await apiClient.retrainPerceptron({
        lr,
        epochs,
        mode,
        use_all_features: mode === 'multiclass' ? useAllFeatures : false,
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Retraining failed');
    } finally {
      setRetraining(false);
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.predictPerceptron(predInput);
      setPredResult(res);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center text-slate-500 animate-pulse">
        Loading Perceptron from scratch (TP2)...
      </div>
    );
  }

  if (!data) return null;

  // Training error curve data for line chart
  const errorCurveData = data.training_errors_curve.map((errCount, epochIdx) => ({
    epoch: epochIdx + 1,
    errors: errCount,
  }));

  // Scatter points grouped by species
  const setosaPoints = data.scatter_points.filter((p) => p.actual_class === 'setosa');
  const versicolorPoints = data.scatter_points.filter((p) => p.actual_class === 'versicolor');
  const virginicaPoints = data.scatter_points.filter((p) => p.actual_class === 'virginica');

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-500" />
            {t.tp2Title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.tp2Subtitle}
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('binary');
                setEpochs(20);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                mode === 'binary'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.modeBinary}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('multiclass');
                setEpochs(100);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                mode === 'multiclass'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.modeMulticlass}
            </button>
          </div>

          {mode === 'multiclass' && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setUseAllFeatures(false)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  !useAllFeatures
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                2 Features (~83%)
              </button>
              <button
                type="button"
                onClick={() => setUseAllFeatures(true)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  useAllFeatures
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-bold shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                4 Features (~96%)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Explanation Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
          data.linearly_separable
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-200'
            : 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/80 dark:text-amber-200'
        }`}
      >
        {data.linearly_separable ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div>
          <div className="font-bold mb-0.5">
            {data.linearly_separable ? 'Linearly Separable (100% Accuracy)' : 'Non-Linearly Separable Boundary'}
          </div>
          <p>{data.explanation}</p>
        </div>
      </div>

      {/* Accuracy & Interactive Hyperparameter Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric Badge */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              {t.accuracy}
            </span>
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
              {(data.metrics.accuracy * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Features used: <b className="text-slate-700 dark:text-slate-200 font-mono">[{data.features_used.join(', ')}]</b>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
            {data.decision_boundaries.map((b, idx) => (
              <div key={idx} className="truncate">
                Line #{idx + 1}: <span className="text-emerald-500">{b.equation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hyperparameter Form */}
        <form onSubmit={handleRetrain} className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              {t.retrainPerceptronBtn}
            </h3>
            {retraining && (
              <span className="text-xs text-emerald-600 animate-pulse font-medium">Training...</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Learning Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="tp2-lr" className="text-slate-700 dark:text-slate-300">{t.learningRate}</label>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{lr}</span>
              </div>
              <input
                id="tp2-lr"
                type="range"
                min={0.01}
                max={1.0}
                step={0.01}
                value={lr}
                onChange={(e) => setLr(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.01 (slow)</span>
                <span>1.0 (aggressive)</span>
              </div>
            </div>

            {/* Epochs Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="tp2-epochs" className="text-slate-700 dark:text-slate-300">{t.epochs}</label>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{epochs}</span>
              </div>
              <input
                id="tp2-epochs"
                type="range"
                min={5}
                max={200}
                step={5}
                value={epochs}
                onChange={(e) => setEpochs(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5 epochs</span>
                <span>200 epochs</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={retraining}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 shadow-sm transition"
            >
              {retraining ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitCommit className="w-3.5 h-3.5" />}
              <span>{t.retrainPerceptronBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Plots: Decision Boundary & Training Error Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decision Boundary / Scatter */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              {t.decisionBoundaryTitle}
            </h3>
            <span className="text-xs text-slate-400 font-mono">x: Petal Length, y: Petal Width</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="x" type="number" name="Petal Length" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="y" type="number" name="Petal Width" stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 text-white p-2 rounded-lg text-xs font-mono border border-slate-700">
                          <div className="text-emerald-400 font-bold capitalize">{d.actual_class}</div>
                          <div>PL: {d.x} cm</div>
                          <div>PW: {d.y} cm</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />

                {setosaPoints.length > 0 && (
                  <Scatter name="Setosa" data={setosaPoints} fill="#3b82f6" opacity={0.7} />
                )}
                {versicolorPoints.length > 0 && (
                  <Scatter name="Versicolor" data={versicolorPoints} fill="#10b981" opacity={0.7} />
                )}
                {virginicaPoints.length > 0 && (
                  <Scatter name="Virginica" data={virginicaPoints} fill="#a855f7" opacity={0.7} />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Error Curve */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-rose-500" />
              {t.trainingErrorsCurve}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Final errors: <b className="text-rose-500">{data.training_errors_curve[data.training_errors_curve.length - 1]}</b>
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorCurveData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [val, 'Misclassified']}
                />
                <Line
                  type="monotone"
                  dataKey="errors"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f43f5e' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Metrics Table & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-emerald-500" />
              {t.confusionMatrix}
            </h3>
          </div>

          <div className="flex flex-col items-center py-2">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${data.metrics.classes.length}, minmax(0, 1fr))` }}>
              {data.metrics.confusion_matrix.map((row, i) =>
                row.map((cell, j) => {
                  const isDiag = i === j;
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center font-mono border transition ${
                        isDiag
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                          : cell > 0
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="text-lg">{cell}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-center gap-4 mt-3 text-xs font-semibold text-slate-500 capitalize">
              {data.metrics.classes.map((cls) => (
                <span key={cls}>{cls}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Per-class Metrics Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              {t.classificationReport}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg rtl:rounded-r-lg rtl:rounded-l-none">Class</th>
                  <th className="py-2.5 px-3">{t.precision}</th>
                  <th className="py-2.5 px-3">{t.recall}</th>
                  <th className="py-2.5 px-3 rounded-r-lg rtl:rounded-l-lg rtl:rounded-r-none">{t.f1Score}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.metrics.classes.map((cls) => (
                  <tr key={cls} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold capitalize text-slate-800 dark:text-white">{cls}</td>
                    <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400">
                      {((data.metrics.precision_per_class[cls] || 0) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 font-mono text-blue-600 dark:text-blue-400">
                      {((data.metrics.recall_per_class[cls] || 0) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 font-mono text-purple-600 dark:text-purple-400">
                      {((data.metrics.f1_per_class[cls] || 0) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Try-Flower Perceptron Classifier */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            {t.tryFlowerPerceptron}
          </h3>
        </div>

        <form onSubmit={handlePredict} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label htmlFor="tp2-petal-length" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Petal Length (cm)</label>
              <input
                id="tp2-petal-length"
                type="number"
                step="0.1"
                min="0.1"
                max="12"
                value={predInput.petal_length}
                onChange={(e) => setPredInput({ ...predInput, petal_length: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="tp2-petal-width" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Petal Width (cm)</label>
              <input
                id="tp2-petal-width"
                type="number"
                step="0.1"
                min="0.05"
                max="8"
                value={predInput.petal_width}
                onChange={(e) => setPredInput({ ...predInput, petal_width: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="tp2-sepal-length" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sepal Length (cm)</label>
              <input
                id="tp2-sepal-length"
                type="number"
                step="0.1"
                min="0.5"
                max="15"
                value={predInput.sepal_length || 5.1}
                onChange={(e) => setPredInput({ ...predInput, sepal_length: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="tp2-sepal-width" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sepal Width (cm)</label>
              <input
                id="tp2-sepal-width"
                type="number"
                step="0.1"
                min="0.5"
                max="10"
                value={predInput.sepal_width || 3.5}
                onChange={(e) => setPredInput({ ...predInput, sepal_width: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Predict Species</span>
            </button>

            {predResult && (
              <div className="flex items-center gap-4 text-xs">
                <span>Predicted: <b className="capitalize text-emerald-600 dark:text-emerald-400 text-sm">{predResult.predicted_class}</b></span>
                <span className="font-mono text-slate-400">
                  Scores: {Object.entries(predResult.scores).map(([k, v]) => `${k}:${v}`).join(', ')}
                </span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
