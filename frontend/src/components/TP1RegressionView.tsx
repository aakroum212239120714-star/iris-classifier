import React, { useState, useEffect } from 'react';
import { Language, RegressionDatasetResponse, PredictDiabetesRequest, PredictIrisSepalRequest } from '../types';
import { apiClient } from '../api/client';
import { translations } from '../i18n/translations';
import {
  TrendingUp,
  Table,
  CheckCircle2,
  Send,
  Sparkles,
  BarChart3,
  ScatterChart as ScatterIcon
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Line,
  ComposedChart
} from 'recharts';

interface TP1RegressionViewProps {
  language: Language;
}

export const TP1RegressionView: React.FC<TP1RegressionViewProps> = ({ language }) => {
  const t = translations[language];
  const [datasetKey, setDatasetKey] = useState<'diabetes' | 'iris'>('diabetes');
  const [data, setData] = useState<RegressionDatasetResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Prediction state for Diabetes
  const [diabInputs, setDiabInputs] = useState<PredictDiabetesRequest>({
    age: 0.038, sex: 0.050, bmi: 0.061, bp: 0.021, s1: -0.044,
    s2: -0.034, s3: -0.043, s4: -0.002, s5: 0.019, s6: -0.017
  });
  const [diabPred, setDiabPred] = useState<{ slr: number; mlr: number } | null>(null);

  // Prediction state for Iris Sepal
  const [irisInputs, setIrisInputs] = useState<PredictIrisSepalRequest>({
    sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2
  });
  const [irisPred, setIrisPred] = useState<{ slr: number; mlr: number } | null>(null);

  const fetchDataset = async (key: 'diabetes' | 'iris') => {
    setLoading(true);
    setError(null);
    try {
      const res = key === 'diabetes' ? await apiClient.getTP1Diabetes() : await apiClient.getTP1Iris();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load regression dataset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset(datasetKey);
  }, [datasetKey]);

  const handlePredictDiabetes = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.predictDiabetes(diabInputs);
      setDiabPred({ slr: res.slr_predicted, mlr: res.mlr_predicted });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePredictIris = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.predictIrisSepal(irisInputs);
      setIrisPred({ slr: res.slr_predicted, mlr: res.mlr_predicted });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#06b6d4', '#eab308'];

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center text-slate-500 animate-pulse">
        Loading Linear Regression analysis (TP1)...
      </div>
    );
  }

  if (!data) return null;

  // Coefficients data for bar chart
  const coeffData = Object.entries(data.mlr_metrics.coefficients).map(([feat, val]) => ({
    feature: feat,
    value: val,
  }));

  // SLR Scatter + Line composed data
  // Combine test scatter points with sorted line
  const scatterData = data.slr_scatter_test.map((pt) => ({
    x: pt.x,
    actual: pt.y_actual,
    pred: pt.y_pred,
  }));

  // MLR Pred vs Actual Scatter data
  const mlrPoints = data.mlr_pred_actual.map((pt) => ({
    actual: pt.actual,
    predicted: pt.predicted,
  }));

  return (
    <div className="space-y-6">
      {/* Top Header & Dataset Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            {t.tp1Title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.tp1Subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDatasetKey('diabetes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              datasetKey === 'diabetes'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.datasetDiabetes}
          </button>
          <button
            type="button"
            onClick={() => setDatasetKey('iris')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              datasetKey === 'iris'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.datasetIrisReg}
          </button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">MAE (SLR vs MLR)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{data.slr_metrics.mae}</span>
            <span className="text-xs text-slate-400 font-mono">vs</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{data.mlr_metrics.mae}</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">MLR improves error</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">MSE (SLR vs MLR)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{data.slr_metrics.mse}</span>
            <span className="text-xs text-slate-400 font-mono">vs</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{data.mlr_metrics.mse}</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">Lower is better</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">RMSE (SLR vs MLR)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{data.slr_metrics.rmse}</span>
            <span className="text-xs text-slate-400 font-mono">vs</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{data.mlr_metrics.rmse}</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">Root Mean Squared Error</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">R² Score (SLR vs MLR)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{(data.slr_metrics.r2 * 100).toFixed(1)}%</span>
            <span className="text-xs text-slate-400 font-mono">vs</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{(data.mlr_metrics.r2 * 100).toFixed(1)}%</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">Higher variance explained</span>
        </div>
      </div>

      {/* Equations Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {t.slrTitle} &mdash; {t.modelEquation}
          </span>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold border border-slate-200/60 dark:border-slate-700/60">
            {data.slr_metrics.equation}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {t.interceptLabel}: <b className="font-mono text-slate-700 dark:text-slate-200">{data.slr_metrics.intercept}</b>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {t.mlrTitle} &mdash; {t.modelEquation}
          </span>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold border border-slate-200/60 dark:border-slate-700/60 overflow-x-auto">
            {data.mlr_metrics.equation}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {t.interceptLabel}: <b className="font-mono text-slate-700 dark:text-slate-200">{data.mlr_metrics.intercept}</b>
          </div>
        </div>
      </div>

      {/* Visualizations: SLR Scatter & Regression Line vs MLR Pred vs Actual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLR Plot */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ScatterIcon className="w-4 h-4 text-emerald-500" />
              {t.slrScatterLine}
            </h3>
            <span className="text-xs text-slate-400 font-mono">{data.slr_feature} &rarr; {data.target_name}</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={scatterData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="x" type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="actual" type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 text-white p-2 rounded-lg text-xs font-mono border border-slate-700">
                          <div>X ({data.slr_feature}): {d.x}</div>
                          <div>Actual Y: {d.actual}</div>
                          <div>Fitted Y: {d.pred}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Actual" dataKey="actual" fill="#3b82f6" opacity={0.7} />
                <Line
                  type="linear"
                  dataKey="pred"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MLR Pred vs Actual Plot */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              {t.mlrPredVsActual}
            </h3>
            <span className="text-xs text-slate-400 font-mono">R² = {(data.mlr_metrics.r2 * 100).toFixed(1)}%</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="actual" name="Actual" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="predicted" name="Predicted" stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 text-white p-2 rounded-lg text-xs font-mono border border-slate-700">
                          <div>Actual: {d.actual}</div>
                          <div>Predicted: {d.predicted}</div>
                          <div>Residual: {(d.actual - d.predicted).toFixed(2)}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Predictions" data={mlrPoints} fill="#8b5cf6" opacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparison Table & Coefficients Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Comparison Table */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-500" />
              {t.comparisonTitle}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg rtl:rounded-r-lg rtl:rounded-l-none">{t.metricHeader}</th>
                  <th className="py-2.5 px-3 font-mono">SLR</th>
                  <th className="py-2.5 px-3 font-mono">MLR</th>
                  <th className="py-2.5 px-3 rounded-r-lg rtl:rounded-l-lg rtl:rounded-r-none">{t.betterModel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.comparison_table.map((row) => (
                  <tr key={row.metric} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-white">{row.metric}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{row.slr}</td>
                    <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{row.mlr}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {row.better}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coefficients Bar Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              {t.coefficientsTitle} (MLR)
            </h3>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coeffData} margin={{ left: 10, right: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="feature" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [val, 'Coefficient']}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {coeffData.map((_e, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Prediction Playground */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            {t.tryPrediction} &mdash; {data.dataset_name}
          </h3>
        </div>

        {datasetKey === 'diabetes' ? (
          <form onSubmit={handlePredictDiabetes} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(['age', 'sex', 'bmi', 'bp', 's1', 's2', 's3', 's4', 's5', 's6'] as (keyof PredictDiabetesRequest)[]).map((key) => (
                <div key={key} className="space-y-1">
                  <label htmlFor={`diab-${key}`} className="text-[11px] font-mono font-semibold text-slate-500 uppercase">{key}</label>
                  <input
                    id={`diab-${key}`}
                    type="number"
                    step="0.001"
                    value={diabInputs[key]}
                    onChange={(e) => setDiabInputs({ ...diabInputs, [key]: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.predictTarget}</span>
              </button>

              {diabPred && (
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span>SLR (BMI only): <b className="text-emerald-600 dark:text-emerald-400">{diabPred.slr}</b></span>
                  <span>MLR (All 10): <b className="text-blue-600 dark:text-blue-400">{diabPred.mlr}</b></span>
                </div>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handlePredictIris} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="iris-sepal-width" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sepal Width (cm)</label>
                <input
                  id="iris-sepal-width"
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10"
                  value={irisInputs.sepal_width}
                  onChange={(e) => setIrisInputs({ ...irisInputs, sepal_width: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="iris-petal-length" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Petal Length (cm - SLR Feature)</label>
                <input
                  id="iris-petal-length"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="12"
                  value={irisInputs.petal_length}
                  onChange={(e) => setIrisInputs({ ...irisInputs, petal_length: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="iris-petal-width" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Petal Width (cm)</label>
                <input
                  id="iris-petal-width"
                  type="number"
                  step="0.1"
                  min="0.05"
                  max="8"
                  value={irisInputs.petal_width}
                  onChange={(e) => setIrisInputs({ ...irisInputs, petal_width: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.predictTarget}</span>
              </button>

              {irisPred && (
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span>SLR Sepal Length: <b className="text-emerald-600 dark:text-emerald-400">{irisPred.slr} cm</b></span>
                  <span>MLR Sepal Length: <b className="text-blue-600 dark:text-blue-400">{irisPred.mlr} cm</b></span>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
