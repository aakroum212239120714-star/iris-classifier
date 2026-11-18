import React, { useState } from 'react';
import { IrisSample, Language, PredictRequest } from '../types';
import { translations } from '../i18n/translations';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ScatterPlotProps {
  language: Language;
  samples: IrisSample[];
  currentInput: PredictRequest;
  predictedSpecies: string;
}

type FeatureKey = keyof PredictRequest;

const FEATURE_OPTIONS: { key: FeatureKey; en: string; ar: string }[] = [
  { key: 'sepal_length', en: 'Sepal Length (cm)', ar: 'طول السبلة (سم)' },
  { key: 'sepal_width', en: 'Sepal Width (cm)', ar: 'عرض السبلة (سم)' },
  { key: 'petal_length', en: 'Petal Length (cm)', ar: 'طول البتلة (سم)' },
  { key: 'petal_width', en: 'Petal Width (cm)', ar: 'عرض البتلة (سم)' },
];

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  language,
  samples,
  currentInput,
  predictedSpecies,
}) => {
  const t = translations[language];
  const [xAxisKey, setXAxisKey] = useState<FeatureKey>('petal_length');
  const [yAxisKey, setYAxisKey] = useState<FeatureKey>('petal_width');

  const setosaData = samples
    .filter((s) => s.species === 'setosa')
    .map((s) => ({ x: s[xAxisKey], y: s[yAxisKey], species: 'setosa' }));

  const versicolorData = samples
    .filter((s) => s.species === 'versicolor')
    .map((s) => ({ x: s[xAxisKey], y: s[yAxisKey], species: 'versicolor' }));

  const virginicaData = samples
    .filter((s) => s.species === 'virginica')
    .map((s) => ({ x: s[xAxisKey], y: s[yAxisKey], species: 'virginica' }));

  const currentFlowerData = [
    {
      x: currentInput[xAxisKey],
      y: currentInput[yAxisKey],
      species: predictedSpecies || 'Current Input',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.scatterTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.scatterSubtitle} • <span className="font-semibold text-slate-700 dark:text-slate-300">{t.samplesCount}</span>
          </p>
        </div>

        {/* Feature Axes Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <label htmlFor="x-axis-select" className="text-slate-500 font-medium">{t.xAxis}:</label>
            <select
              id="x-axis-select"
              value={xAxisKey}
              onChange={(e) => setXAxisKey(e.target.value as FeatureKey)}
              className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {FEATURE_OPTIONS.map((f) => (
                <option key={f.key} value={f.key}>
                  {language === 'ar' ? f.ar : f.en}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <label htmlFor="y-axis-select" className="text-slate-500 font-medium">{t.yAxis}:</label>
            <select
              id="y-axis-select"
              value={yAxisKey}
              onChange={(e) => setYAxisKey(e.target.value as FeatureKey)}
              className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {FEATURE_OPTIONS.map((f) => (
                <option key={f.key} value={f.key}>
                  {language === 'ar' ? f.ar : f.en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
            <XAxis
              type="number"
              dataKey="x"
              name={xAxisKey}
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickLine={{ stroke: '#64748b' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yAxisKey}
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickLine={{ stroke: '#64748b' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900/90 text-white p-2.5 rounded-lg shadow-lg text-xs backdrop-blur-sm border border-slate-700">
                      <div className="font-bold capitalize text-emerald-400 mb-1">
                        {data.species}
                      </div>
                      <div className="text-slate-300">
                        {xAxisKey}: <span className="font-mono text-white">{data.x} cm</span>
                      </div>
                      <div className="text-slate-300">
                        {yAxisKey}: <span className="font-mono text-white">{data.y} cm</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              formatter={(value) => {
                if (value === 'Setosa') return t.setosa;
                if (value === 'Versicolor') return t.versicolor;
                if (value === 'Virginica') return t.virginica;
                if (value === 'Your Flower') return t.yourFlower;
                return value;
              }}
            />

            <Scatter name="Setosa" data={setosaData} fill="#3b82f6" opacity={0.7} />
            <Scatter name="Versicolor" data={versicolorData} fill="#10b981" opacity={0.7} />
            <Scatter name="Virginica" data={virginicaData} fill="#a855f7" opacity={0.7} />
            {/* Highlighted current point */}
            <Scatter
              name="Your Flower"
              data={currentFlowerData}
              fill="#f43f5e"
              shape="diamond"
              stroke="#ffffff"
              strokeWidth={2}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
