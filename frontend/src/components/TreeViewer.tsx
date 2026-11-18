import React, { useState } from 'react';
import { TreeNode, TreeResponse, Language } from '../types';
import { translations } from '../i18n/translations';
import { GitBranch, Info, Check } from 'lucide-react';

interface TreeViewerProps {
  language: Language;
  treeData: TreeResponse | null;
  highlightedPath: number[];
}

export const TreeViewer: React.FC<TreeViewerProps> = ({
  language,
  treeData,
  highlightedPath,
}) => {
  const t = translations[language];
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  if (!treeData || !treeData.root) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 text-center text-slate-500">
        Loading tree data...
      </div>
    );
  }

  const featureLabelMap: Record<string, string> = {
    sepal_length: language === 'ar' ? 'طول السبلة' : 'sepal length',
    sepal_width: language === 'ar' ? 'عرض السبلة' : 'sepal width',
    petal_length: language === 'ar' ? 'طول البتلة' : 'petal length',
    petal_width: language === 'ar' ? 'عرض البتلة' : 'petal width',
  };

  const speciesColor = (species: string) => {
    switch (species.toLowerCase()) {
      case 'setosa':
        return 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300';
      case 'versicolor':
        return 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
      case 'virginica':
        return 'border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300';
      default:
        return 'border-slate-300 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200';
    }
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isPath = highlightedPath.includes(node.id);
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node box */}
        <div
          onClick={() => setSelectedNode(node)}
          className={`cursor-pointer transition-all duration-200 rounded-xl p-3 border-2 shadow-sm relative min-w-[190px] max-w-[230px] ${
            isPath
              ? 'ring-4 ring-emerald-400/50 shadow-emerald-500/20 scale-[1.02]'
              : 'hover:border-slate-400'
          } ${speciesColor(node.predicted_class)} ${
            isSelected ? 'border-amber-400 dark:border-amber-400' : ''
          }`}
        >
          {isPath && (
            <span className="absolute -top-2.5 right-2 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" />
              {t.pathTaken}
            </span>
          )}

          <div className="flex items-center justify-between text-[11px] font-bold pb-1 mb-1 border-b border-black/10 dark:border-white/10">
            <span>Node #{node.id}</span>
            <span className="capitalize">{node.predicted_class}</span>
          </div>

          {!node.is_leaf ? (
            <div className="font-semibold text-xs text-slate-900 dark:text-white my-1">
              {featureLabelMap[node.feature_name || ''] || node.feature_name} &le;{' '}
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {node.threshold}
              </span>
            </div>
          ) : (
            <div className="text-xs font-bold my-1 text-slate-800 dark:text-slate-100 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {t.leafNode}
            </div>
          )}

          <div className="text-[10px] space-y-0.5 text-slate-600 dark:text-slate-300 font-mono">
            <div>
              {node.criterion_name}: {node.impurity.toFixed(3)}
            </div>
            <div>
              {t.samples}: {node.samples}
            </div>
            <div>
              values: [{node.values.join(', ')}]
            </div>
          </div>
        </div>

        {/* Child branches */}
        {!node.is_leaf && node.left && node.right && (
          <div className="flex flex-col items-center w-full mt-2">
            {/* Stem line */}
            <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />

            {/* Branch branches container */}
            <div className="flex items-start justify-center gap-6 sm:gap-10 pt-2 border-t-2 border-slate-300 dark:border-slate-700 relative w-full">
              {/* Left branch indicator */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-1 -mt-4 mb-1">
                  True (&le;)
                </span>
                {renderNode(node.left, depth + 1)}
              </div>

              {/* Right branch indicator */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 px-1 -mt-4 mb-1">
                  False (&gt;)
                </span>
                {renderNode(node.right, depth + 1)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-500" />
            {t.treeTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.treeSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
            {t.depth}: <b className="text-emerald-500">{treeData.max_depth}</b>
          </span>
          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {t.pathTaken}: [{highlightedPath.join(' → ')}]
          </span>
        </div>
      </div>

      {/* Overflow tree wrapper */}
      <div className="overflow-x-auto pb-8 pt-4 flex justify-center min-h-[460px]">
        <div className="inline-block p-4">{renderNode(treeData.root)}</div>
      </div>

      {/* Inspector drawer when node is clicked */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-white">
                Node #{selectedNode.id} - Predicted class: {selectedNode.predicted_class}
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                {selectedNode.is_leaf
                  ? `Leaf node representing ${selectedNode.samples} samples.`
                  : `Split condition on ${selectedNode.feature_name} at threshold ${selectedNode.threshold}.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-xs px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            {t.close}
          </button>
        </div>
      )}
    </div>
  );
};
