import React from 'react';
import { MetricsResponse, Language } from '../types';
import { translations } from '../i18n/translations';
import { Award, BarChart3, Grid3X3, Table2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MetricsViewProps {
  language: Language;
  metrics: MetricsResponse | null;
}

export const MetricsView: React.FC<MetricsViewProps> = ({ language, metrics }) => {
  const t = translations[language];

  if (!metrics) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 text-center text-slate-500">
        Loading metrics...
      </div>
    );
  }

  const featureLabels: Record<string, string> = {
    sepal_length: t.sepalLength,
    sepal_width: t.sepalWidth,
    petal_length: t.petalLength,
    petal_width: t.petalWidth,
  };

  const featureBarData = Object.entries(metrics.feature_importances).map(([key, val]) => ({
    name: featureLabels[key] || key,
    importance: val,
    key,
  }));

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.accuracy}
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {(metrics.accuracy * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.trainSplit}
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.train_samples_count} <span className="text-xs font-normal text-slate-400">({((1 - metrics.params.test_size) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Grid3X3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.testSplit}
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.test_samples_count} <span className="text-xs font-normal text-slate-400">({(metrics.params.test_size * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Heatmap */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-emerald-500" />
              {t.confusionMatrix}
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
              {t.predicted} &rarr;
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 -rotate-90 origin-center whitespace-nowrap">
                {t.actual} &rarr;
              </div>

              <div className="grid grid-cols-3 gap-2">
                {metrics.confusion_matrix.map((row, i) =>
                  row.map((cell, j) => {
                    const isDiagonal = i === j;
                    return (
                      <div
                        key={`${i}-${j}`}
                        className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center font-mono transition border ${
                          isDiagonal
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold'
                            : cell > 0
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="text-xl">{cell}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">
                          {metrics.classes[i].slice(0, 4)} &times; {metrics.classes[j].slice(0, 4)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-slate-500">
              {metrics.classes.map((cls) => (
                <span key={cls} className="capitalize">
                  {cls}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Importances Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              {t.featureImportances}
            </h3>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureBarData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}%`, 'Importance']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                  {featureBarData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Classification Report Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table2 className="w-4 h-4 text-emerald-500" />
            {t.classificationReport}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-l-lg rtl:rounded-r-lg rtl:rounded-l-none">Class</th>
                <th className="py-3 px-4">{t.precision}</th>
                <th className="py-3 px-4">{t.recall}</th>
                <th className="py-3 px-4">{t.f1Score}</th>
                <th className="py-3 px-4 rounded-r-lg rtl:rounded-l-lg rtl:rounded-r-none">{t.support}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {Object.entries(metrics.classification_report).map(([cls, rep]) => (
                <tr key={cls} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold capitalize text-slate-900 dark:text-white">
                    {cls}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {(rep.precision * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    {(rep.recall * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 font-mono text-purple-600 dark:text-purple-400 font-semibold">
                    {(rep.f1_score * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{rep.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
