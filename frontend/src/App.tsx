import React, { useState, useEffect, useCallback } from 'react';
import {
  PredictRequest,
  PredictResponse,
  MetricsResponse,
  TreeResponse,
  DatasetResponse,
  RetrainRequest,
  Language,
} from './types';
import { apiClient } from './api/client';
import { translations } from './i18n/translations';
import { Header } from './components/Header';
import { PredictCard } from './components/PredictCard';
import { ScatterPlot } from './components/ScatterPlot';
import { TreeViewer } from './components/TreeViewer';
import { MetricsView } from './components/MetricsView';
import { SettingsModal } from './components/SettingsModal';
import { TP1RegressionView } from './components/TP1RegressionView';
import { TP2PerceptronView } from './components/TP2PerceptronView';
import {
  Sparkles,
  GitBranch,
  BarChart2,
  ScatterChart as ScatterIcon,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';

const DEFAULT_INPUTS: PredictRequest = {
  sepal_length: 5.1,
  sepal_width: 3.5,
  petal_length: 1.4,
  petal_width: 0.2,
};

type MainModule = 'tree' | 'tp1' | 'tp2';

export const App: React.FC = () => {
  // Arabic default per requirement
  const [language, setLanguage] = useState<Language>('ar');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Top level assignment module selector
  const [activeModule, setActiveModule] = useState<MainModule>('tree');

  // Decision Tree sub-tabs
  const [activeTab, setActiveTab] = useState<'predict' | 'tree' | 'metrics' | 'dataset'>('predict');

  const [inputs, setInputs] = useState<PredictRequest>(DEFAULT_INPUTS);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [treeData, setTreeData] = useState<TreeResponse | null>(null);
  const [dataset, setDataset] = useState<DatasetResponse | null>(null);

  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [loadingPrediction, setLoadingPrediction] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const t = translations[language];

  // Set RTL / LTR document attributes
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Set dark class on html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Initial data load
  const loadInitialData = useCallback(async () => {
    setGlobalError(null);
    try {
      const [metricsRes, treeRes, datasetRes] = await Promise.all([
        apiClient.getMetrics(),
        apiClient.getTree(),
        apiClient.getDataset(),
      ]);
      setMetrics(metricsRes);
      setTreeData(treeRes);
      setDataset(datasetRes);
      setIsOnline(true);
    } catch (err: any) {
      setIsOnline(false);
      setGlobalError(err.message || 'Could not connect to the backend server.');
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Debounced prediction call
  useEffect(() => {
    let timer: any;
    setLoadingPrediction(true);
    timer = setTimeout(async () => {
      try {
        const res = await apiClient.predict(inputs);
        setPrediction(res);
        setIsOnline(true);
      } catch (err: any) {
        setGlobalError(err.message);
      } finally {
        setLoadingPrediction(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [inputs]);

  const handleInputChange = (key: keyof PredictRequest, val: number) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetInputs = () => {
    setInputs(DEFAULT_INPUTS);
  };

  const handleRetrain = async (params: RetrainRequest) => {
    const newMetrics = await apiClient.retrain(params);
    setMetrics(newMetrics);
    const newTree = await apiClient.getTree();
    setTreeData(newTree);
    const updatedPred = await apiClient.predict(inputs);
    setPrediction(updatedPred);
  };

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Header
        language={language}
        onLanguageToggle={() => setLanguage((l) => (l === 'ar' ? 'en' : 'ar'))}
        isDark={isDark}
        onThemeToggle={() => setIsDark((d) => !d)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOnline={isOnline}
        onRefresh={loadInitialData}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Global Error Alert */}
        {globalError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="text-xs underline hover:no-underline"
            >
              {t.close}
            </button>
          </div>
        )}

        {/* TOP-LEVEL TABS: Decision Tree, TP1 Regression, TP2 Perceptron */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-900/80 rounded-2xl border border-slate-300/60 dark:border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveModule('tree')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
              activeModule === 'tree'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>{t.moduleTree}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('tp1')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
              activeModule === 'tp1'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>{t.moduleTP1}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('tp2')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
              activeModule === 'tp2'
                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-500" />
            <span>{t.moduleTP2}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MODULE 1: DECISION TREE */}
        {/* ========================================================================= */}
        {activeModule === 'tree' && (
          <div className="space-y-6">
            {/* Navigation Sub-Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('predict')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                  activeTab === 'predict'
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.tabPredict}</span>
              </button>

              <button
                onClick={() => setActiveTab('tree')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                  activeTab === 'tree'
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>{t.tabTree}</span>
                {prediction && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('metrics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                  activeTab === 'metrics'
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>{t.tabMetrics}</span>
                {metrics && (
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
                    {(metrics.accuracy * 100).toFixed(0)}%
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('dataset')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                  activeTab === 'dataset'
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <ScatterIcon className="w-3.5 h-3.5" />
                <span>{t.tabDataset}</span>
              </button>
            </div>

            {/* Sub-Tab Content */}
            {activeTab === 'predict' && (
              <div className="space-y-6 animate-fade-in">
                <PredictCard
                  language={language}
                  values={inputs}
                  onChange={handleInputChange}
                  onReset={handleResetInputs}
                  prediction={prediction}
                  loading={loadingPrediction}
                />

                {dataset && (
                  <ScatterPlot
                    language={language}
                    samples={dataset.samples}
                    currentInput={inputs}
                    predictedSpecies={prediction?.predicted_class || ''}
                  />
                )}
              </div>
            )}

            {activeTab === 'tree' && (
              <div className="animate-fade-in">
                <TreeViewer
                  language={language}
                  treeData={treeData}
                  highlightedPath={prediction?.decision_path || [0]}
                />
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="animate-fade-in">
                <MetricsView language={language} metrics={metrics} />
              </div>
            )}

            {activeTab === 'dataset' && dataset && (
              <div className="animate-fade-in">
                <ScatterPlot
                  language={language}
                  samples={dataset.samples}
                  currentInput={inputs}
                  predictedSpecies={prediction?.predicted_class || ''}
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: TP1 LINEAR REGRESSION */}
        {/* ========================================================================= */}
        {activeModule === 'tp1' && (
          <div className="animate-fade-in">
            <TP1RegressionView language={language} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 3: TP2 PERCEPTRON FROM SCRATCH */}
        {/* ========================================================================= */}
        {activeModule === 'tp2' && (
          <div className="animate-fade-in">
            <TP2PerceptronView language={language} />
          </div>
        )}
      </main>

      <SettingsModal
        language={language}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onRetrain={handleRetrain}
        currentParams={metrics?.params}
      />
    </div>
  );
};

export default App;
