export const translations = {
  ar: {
    // Header & Meta
    title: 'نظام تصنيف أزهار السوسن',
    subtitle: 'شجرة القرار التفاعلية لبيانات زهرة السوسن (DecisionTreeClassifier)',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الليلي',
    langToggle: 'English',
    connected: 'متصل بالخادم',
    disconnected: 'غير متصل',
    refresh: 'تحديث',
    settings: 'إعدادات النموذج',

    // Tabs
    tabPredict: 'التنبؤ التفاعلي',
    tabTree: 'شجرة القرار',
    tabMetrics: 'مقاييس الأداء',
    tabDataset: 'مخطط البيانات',

    // Measurements & Sliders
    inputCardTitle: 'قياسات الزهرة (سم)',
    inputCardSubtitle: 'قم بتعديل القيم للحصول على التنبؤ الفوري ومسار القرار',
    sepalLength: 'طول السبلة (Sepal Length)',
    sepalWidth: 'عرض السبلة (Sepal Width)',
    petalLength: 'طول البتلة (Petal Length)',
    petalWidth: 'عرض البتلة (Petal Width)',
    cm: 'سم',
    resetDefault: 'استعادة القيم الافتراضية',
    predicting: 'جاري التنبؤ...',

    // Prediction Card
    predictionResult: 'نتيجة التنبؤ',
    predictedSpecies: 'النوع المتوقع',
    confidence: 'نسبة التأكيد',
    probabilities: 'احتماليات الفئات',
    setosa: 'سوسن قزمي (Setosa)',
    versicolor: 'سوسن مبرقش (Versicolor)',
    virginica: 'سوسن فرجيني (Virginica)',

    // Scatter plot
    scatterTitle: 'مخطط التوزيع النقطي لبيانات السوسن',
    scatterSubtitle: 'قارن عينتك الحالية مع كافة عينات مجموعة البيانات الـ 150',
    xAxis: 'المحور الأفقي (X)',
    yAxis: 'المحور الرأسي (Y)',
    yourFlower: 'عينتك الحالية',
    samplesCount: '150 عينة مقسمة بالتساوي (50 لكل صنف)',

    // Decision Tree
    treeTitle: 'شجرة القرار التفاعلية',
    treeSubtitle: 'المسار المظلل باللون الأخضر يمثل الفروع التي سلكتها عينتك الحالية',
    depth: 'العمق الأقصى',
    criterion: 'معيار التقسيم',
    samples: 'عينات',
    entropy: 'الإنتروبيا',
    impurity: 'معامل الشوائب',
    classValues: 'توزيع الأصناف',
    leafNode: 'عقدة نهائية',
    decisionRule: 'شرط التقسيم',
    pathTaken: 'مسار العينة الحالية',

    // Metrics
    metricsTitle: 'مقاييس كفاءة ودقة النموذج',
    accuracy: 'نسبة الدقة الكلية (Accuracy)',
    trainSplit: 'عينات التدريب',
    testSplit: 'عينات الاختبار',
    confusionMatrix: 'مصفوفة الارتباك (Confusion Matrix)',
    classificationReport: 'تقرير التصنيف التفصيلي',
    featureImportances: 'أهمية الخصائص (Feature Importances)',
    precision: 'الدقة (Precision)',
    recall: 'الاستدعاء (Recall)',
    f1Score: 'مقياس F1',
    support: 'عدد العينات (Support)',
    predicted: 'المتوقع',
    actual: 'الفعلي',

    // Settings Modal
    modalTitle: 'إعادة تدريب النموذج وتعديل المعلمات',
    modalSubtitle: 'اختر المعلمات الفائقة المناسبة لإعادة تدريب خوارزمية شجرة القرار',
    criterionLabel: 'معيار التقسيم (Criterion)',
    maxDepthLabel: 'أقصى عمق للشجرة (Max Depth)',
    testSizeLabel: 'نسبة بيانات الاختبار (Test Size)',
    retrainBtn: 'إعادة التدريب وتحديث النموذج',
    retraining: 'جاري التدريب...',
    close: 'إغلاق',
    retrainSuccess: 'تمت إعادة تدريب النموذج بنجاح!',
    retrainError: 'فشل في إعادة التدريب',
  },
  en: {
    // Header & Meta
    title: 'Iris Flower Classifier',
    subtitle: 'Interactive DecisionTreeClassifier trained on the Iris Dataset',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    langToggle: 'العربية',
    connected: 'Backend Online',
    disconnected: 'Offline',
    refresh: 'Refresh',
    settings: 'Model Settings',

    // Tabs
    tabPredict: 'Prediction & Playground',
    tabTree: 'Decision Tree',
    tabMetrics: 'Model Metrics',
    tabDataset: 'Dataset Scatter',

    // Measurements & Sliders
    inputCardTitle: 'Flower Measurements (cm)',
    inputCardSubtitle: 'Adjust slider values for real-time predictions and tree highlighting',
    sepalLength: 'Sepal Length',
    sepalWidth: 'Sepal Width',
    petalLength: 'Petal Length',
    petalWidth: 'Petal Width',
    cm: 'cm',
    resetDefault: 'Reset to Default',
    predicting: 'Predicting...',

    // Prediction Card
    predictionResult: 'Prediction Result',
    predictedSpecies: 'Predicted Species',
    confidence: 'Top Confidence',
    probabilities: 'Class Probabilities',
    setosa: 'Iris-setosa',
    versicolor: 'Iris-versicolor',
    virginica: 'Iris-virginica',

    // Scatter plot
    scatterTitle: 'Iris Dataset 2D Scatter Plot',
    scatterSubtitle: 'See where your input flower lands amongst all 150 iris flowers',
    xAxis: 'X-Axis Feature',
    yAxis: 'Y-Axis Feature',
    yourFlower: 'Your Current Input',
    samplesCount: '150 samples total (50 per species)',

    // Decision Tree
    treeTitle: 'Interactive Decision Tree Explorer',
    treeSubtitle: 'The illuminated path shows the branch choices taken for your current sample',
    depth: 'Max Depth',
    criterion: 'Criterion',
    samples: 'samples',
    entropy: 'Entropy',
    impurity: 'Impurity',
    classValues: 'Class distribution',
    leafNode: 'Leaf Node',
    decisionRule: 'Split Condition',
    pathTaken: 'Input Decision Path',

    // Metrics
    metricsTitle: 'Model Evaluation Metrics',
    accuracy: 'Test Accuracy',
    trainSplit: 'Train Samples',
    testSplit: 'Test Samples',
    confusionMatrix: 'Confusion Matrix',
    classificationReport: 'Classification Report',
    featureImportances: 'Feature Importances',
    precision: 'Precision',
    recall: 'Recall',
    f1Score: 'F1-Score',
    support: 'Support',
    predicted: 'Predicted',
    actual: 'Actual',

    // Settings Modal
    modalTitle: 'Retrain Model & Hyperparameters',
    modalSubtitle: 'Tune hyperparameters and retrain the scikit-learn DecisionTreeClassifier',
    criterionLabel: 'Split Criterion',
    maxDepthLabel: 'Maximum Tree Depth (max_depth)',
    testSizeLabel: 'Stratified Test Size Ratio',
    retrainBtn: 'Retrain Model',
    retraining: 'Retraining...',
    close: 'Close',
    retrainSuccess: 'Model retrained successfully!',
    retrainError: 'Retraining failed',
  },
};
