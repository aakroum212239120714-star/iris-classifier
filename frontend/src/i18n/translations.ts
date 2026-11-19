export const translations = {
  ar: {
    // Header & Meta
    title: 'نظام تصنيف وتعلّم الآلة',
    subtitle: 'شجرة القرار، الانحدار الخطي (TP1)، والمستقبل الذاتي Perceptron من الصفر (TP2)',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الليلي',
    langToggle: 'English',
    connected: 'متصل بالخادم',
    disconnected: 'غير متصل',
    refresh: 'تحديث',
    settings: 'إعدادات شجرة القرار',

    // Main navigation modules
    moduleTree: 'شجرة القرار (Decision Tree)',
    moduleTP1: 'الانحدار الخطي (TP1)',
    moduleTP2: 'المستقبل الذاتي Perceptron (TP2)',

    // Decision Tree Sub-Tabs
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

    // --- TP1 Translations ---
    tp1Title: 'الانحدار الخطي البسيط والمتعدد (TP1 - Linear Regression)',
    tp1Subtitle: 'مقارنة دقيقة بين الانحدار البسيط (SLR) والانحدار المتعدد (MLR) لمجموعتي بيانات السكري والسوسن',
    datasetDiabetes: 'بيانات مرض السكري (Diabetes)',
    datasetIrisReg: 'بيانات السوسن - التنبؤ بطول السبلة (Iris)',
    slrTitle: 'الانحدار الخطي البسيط (SLR)',
    mlrTitle: 'الانحدار الخطي المتعدد (MLR)',
    slrScatterLine: 'مخطط التشتت وخط الانحدار البسيط',
    mlrPredVsActual: 'المتوقع مقابل الفعلي في الانحدار المتعدد (Pred vs Actual)',
    modelEquation: 'معادلة النموذج الرياضية',
    coefficientsTitle: 'معاملات الخصائص (Coefficients)',
    interceptLabel: 'الحد الثابت (Intercept)',
    comparisonTitle: 'جدول المقارنة بين الانحدار البسيط والمتعدد',
    metricHeader: 'المقياس',
    betterModel: 'الأفضل',
    predictTarget: 'حساب التنبؤ',
    tryPrediction: 'جرّب التنبؤ بقيم مخصصة',

    // --- TP2 Translations ---
    tp2Title: 'المستقبل الذاتي من الصفر (TP2 - Perceptron from Scratch)',
    tp2Subtitle: 'تنفيذ خوارزمية روزنبلات بلغة بايثون وNumPy حصراً بدون أي استخدام لمكتبة scikit-learn',
    modeBinary: 'تصنيف ثنائي (Setosa vs Versicolor)',
    modeMulticlass: 'تصنيف متعدد الأصناف (One-vs-Rest OvR)',
    use4Features: 'استخدام الخصائص الأربع كاملة',
    use2Features: 'استخدام خاصيتين فقط (طول وعرض البتلة)',
    learningRate: 'معدل التعلّم (Learning Rate)',
    epochs: 'عدد الحلقات (Epochs)',
    retrainPerceptronBtn: 'إعادة تدريب الـ Perceptron',
    trainingErrorsCurve: 'منحنى أخطاء التدريب عبر الحلقات (Training Errors Curve)',
    decisionBoundaryTitle: 'حد القرار الخطي (Decision Boundary Line)',
    tryFlowerPerceptron: 'جرّب تصنيف زهرة عبر الـ Perceptron',
    classificationScores: 'درجات الدالة الخطية z = w·x + b لكل فئة',

    // --- Theory Q&A ---
    theoryTitle: 'الأسئلة النظرية والإجابات النموذجية (Assignment Theory)',
    qSLRvsMLR: 'ما هو الفرق بين الانحدار البسيط (SLR) والانحدار المتعدد (MLR)؟',
    aSLRvsMLR: 'الانحدار البسيط (SLR) يستخدم متغيراً مستقلاً واحداً (x) للتنبؤ بالمتغير التابع (y) عبر خط مستقيم y = ax + b. بينما الانحدار المتعدد (MLR) يستخدم عدة متغيرات (x1, x2, ..., xn) للتنبؤ بـ y عبر مستوٍ فائق y = w1*x1 + ... + wn*xn + b، مما يتيح التقاط تأثيرات متداخلة وخفض نسبة الخطأ.',
    
    qSlopeIntercept: 'ما هو دور الميل (Slope) والحد الثابت (Intercept)؟',
    aSlopeIntercept: 'الميل (Slope/Coefficients) يحدد مقدار واتجاه التغير في الهدف y عند زيادة المتغير المستقل بمقدار وحدة واحدة. والحد الثابت (Intercept) هو القيمة المتوقعة للهدف y عندما تكون جميع المدخلات مساوية للصفر.',

    qActivation: 'لماذا نحتاج دالة التنشيط (Activation Function) في الـ Perceptron؟',
    aActivation: 'دالة التنشيط (مثل دالة الخطوة Step Function) تحوّل المجموع الخطي المستمر z = w·x + b إلى مخرج تصنيفي منفصل (0 أو 1)، مما يحدد قرار الخلية العصبية بالإطلاق أو السكون ويفصل الفضاء إلى منطقتي قرار.',

    qLearningRate: 'ما هو دور معدل التعلّم (Learning Rate)؟ وماذا يحدث إذا كان كبيراً جداً؟',
    aLearningRate: 'معدل التعلّم (η) يتحكم في حجم الخطوة التي تُعدل بها الأوزان عند حدوث خطأ في التصنيف. إذا كان صغيراً جداً، يستغرق التدريب وقتاً طويلاً. وإذا كان كبيراً جداً، فقد تتذبذب الأوزان بعنف وتتجاوز الحل الأمثل (Overshooting) مما يؤدي إلى عدم تقارب النموذج.',

    qXORLinearSeparability: 'هل يستطيع الـ Perceptron أحادي الطبقة حل جميع المشاكل (مثل معضلة XOR)؟',
    aXORLinearSeparability: 'لا. أثبت مينسكي وبابيرت (1969) أن الـ Perceptron أحادي الطبقة قادر فقط على حل المسائل القابلة للفصل خطياً (Linearly Separable). مسألة XOR ومسألة تداخل صنف Versicolor مع Virginica ليستا قابلتين للفصل بخط مستقيم، وتتطلبان شبكات متعددة الطبقات (MLP) أو تحويلات غير خطية.',

    qPerceptronVsLinReg: 'ما الفرق بين الـ Perceptron والانحدار الخطي؟',
    aPerceptronVsLinReg: 'الانحدار الخطي مهمة انحدار (Regression) تتنبأ بقيمة عددية مستمرة باستخدام دالة خسارة المربعات الصغرى (MSE). بينما الـ Perceptron مهمة تصنيف (Classification) تتنبأ بفئات منفصلة وتحدث الأوزان فقط عند الخطأ باستخدام دالة تنشيطية عتبية.',

    qBinaryVsMulticlass: 'كيف يتم تعميم الـ Perceptron من التصنيف الثنائي إلى المتعدد؟',
    aBinaryVsMulticlass: 'باستخدام استراتيجية One-vs-Rest (OvR): ندرّب نموذج Perceptron مستقلاً لكل صنف مقابل بقية الأصناف. وعند التنبؤ، نحسب قيمة z = w·x + b لكل نموذج، ونختار الصنف صاحب أعلى درجة z (argmax).',
  },
  en: {
    // Header & Meta
    title: 'Machine Learning Platform',
    subtitle: 'Decision Tree, Linear Regression (TP1), & Pure NumPy Perceptron (TP2)',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    langToggle: 'العربية',
    connected: 'Backend Online',
    disconnected: 'Offline',
    refresh: 'Refresh',
    settings: 'Decision Tree Settings',

    // Main navigation modules
    moduleTree: 'Decision Tree',
    moduleTP1: 'Linear Regression (TP1)',
    moduleTP2: 'Perceptron from Scratch (TP2)',

    // Decision Tree Sub-Tabs
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

    // --- TP1 Translations ---
    tp1Title: 'Linear Regression Analysis (TP1)',
    tp1Subtitle: 'Exact comparison of Simple Linear Regression (SLR) and Multiple Linear Regression (MLR) on Diabetes and Iris datasets',
    datasetDiabetes: 'Diabetes Dataset (Disease Progression)',
    datasetIrisReg: 'Iris Dataset (Predict Sepal Length)',
    slrTitle: 'Simple Linear Regression (SLR)',
    mlrTitle: 'Multiple Linear Regression (MLR)',
    slrScatterLine: 'SLR Scatter Plot & Regression Line',
    mlrPredVsActual: 'MLR Predicted vs Actual Target',
    modelEquation: 'Fitted Equation',
    coefficientsTitle: 'Learned Coefficients',
    interceptLabel: 'Intercept (b)',
    comparisonTitle: 'SLR vs MLR Metric Comparison Table',
    metricHeader: 'Metric',
    betterModel: 'Superior Model',
    predictTarget: 'Compute Prediction',
    tryPrediction: 'Test Custom Predictions',

    // --- TP2 Translations ---
    tp2Title: 'Rosenblatt Perceptron from Scratch (TP2)',
    tp2Subtitle: 'Pure NumPy implementation without scikit-learn, featuring step activation and One-vs-Rest multiclass classification',
    modeBinary: 'Binary Classification (Setosa vs Versicolor)',
    modeMulticlass: 'Multiclass Classification (One-vs-Rest OvR)',
    use4Features: 'Use all 4 Iris features',
    use2Features: 'Use 2 features (Petal Length & Width)',
    learningRate: 'Learning Rate (η)',
    epochs: 'Epochs (Iterations)',
    retrainPerceptronBtn: 'Retrain Perceptron',
    trainingErrorsCurve: 'Training Error Curve per Epoch',
    decisionBoundaryTitle: 'Linear Decision Boundary Line',
    tryFlowerPerceptron: 'Classify Flower with Perceptron',
    classificationScores: 'Raw linear scores (z = w·x + b) per class',

    // --- Theory Q&A ---
    theoryTitle: 'Theoretical Questions & Solutions',
    qSLRvsMLR: 'What is the fundamental difference between SLR and MLR?',
    aSLRvsMLR: 'Simple Linear Regression (SLR) models the relationship between a single predictor (x) and target (y) using a line y = ax + b. Multiple Linear Regression (MLR) models the target using multiple predictors (x1..xn) via a hyperplane y = Σ(wi*xi) + b, capturing joint variations and reducing residual error.',
    
    qSlopeIntercept: 'What are the roles of the slope and intercept?',
    aSlopeIntercept: 'The slope (coefficients) dictates how much y changes for each unit increase in a given feature, all else held equal. The intercept is the baseline expected value of y when all features equal zero.',

    qActivation: 'Why is an activation function necessary in a Perceptron?',
    aActivation: 'The step activation function f(z) maps the continuous real-valued net input z = w·x + b into a discrete class decision (0 or 1), establishing a hard linear decision threshold between opposing classes.',

    qLearningRate: 'What is the role of the learning rate, and what happens if it is too high?',
    aLearningRate: 'The learning rate (η) determines the update step magnitude along the gradient. If η is too small, training converges very slowly. If η is too large, the weight vector oscillates and can overshoot the optimal separating hyperplane, preventing convergence.',

    qXORLinearSeparability: 'Can a single-layer Perceptron solve every classification problem (e.g. XOR)?',
    aXORLinearSeparability: 'No. As proved by Minsky & Papert (1969), a single Perceptron can only solve linearly separable problems. XOR and the overlapping Versicolor/Virginica boundary require non-linear separation, which necessitates Multi-Layer Perceptrons (MLPs).',

    qPerceptronVsLinReg: 'How does the Perceptron differ from Linear Regression?',
    aPerceptronVsLinReg: 'Linear Regression solves a continuous regression problem minimized by Ordinary Least Squares (MSE). The Perceptron solves a discrete classification problem updated on misclassifications via an error-driven perceptron criterion.',

    qBinaryVsMulticlass: 'How is a binary Perceptron extended to multiclass classification?',
    aBinaryVsMulticlass: 'Using One-vs-Rest (OvR): train K distinct binary perceptrons, each discriminating class k from all others. For any test sample, evaluate the linear discriminant score z_k = w_k · x + b_k and assign the class with max(z_k).',
  },
};
