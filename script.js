// Modern Medical Platform JavaScript - Professional Edition

// Global state
let selectedSymptoms = [];
let selectedHistory = [];
let selectedSurgical = [];
let selectedFamily = [];
let selectedAllergies = [];
let selectedImaging = [];
let selectedDiagnostics = [];
let selectedMedications = [];

let currentStep = 0;
const totalSteps = 6;
const stepNames = ['demographics', 'presentation', 'history', 'examination', 'investigations', 'medications'];

// Professional medical database
const professionalDiagnoses = {
    respiratory: [
        {
            condition: 'Community-Acquired Pneumonia',
            icd10: 'J44.1',
            probability: 85,
            confidence: 92,
            evidenceLevel: 'A',
            symptoms: ['Fever', 'Cough', 'Dyspnea', 'Chest pain'],
            riskFactors: ['Age >65', 'Smoking history', 'COPD'],
            recommendations: [
                'Chest X-ray to confirm diagnosis',
                'Blood cultures and sputum culture',
                'Antibiotic therapy per guidelines',
                'Consider hospitalization if PSI >70'
            ],
            guidelines: 'ATS/IDSA 2019 CAP Guidelines',
            urgency: 'high'
        },
        {
            condition: 'Upper Respiratory Tract Infection',
            icd10: 'J06.9',
            probability: 65,
            confidence: 78,
            evidenceLevel: 'B',
            symptoms: ['Cough', 'Fever', 'Fatigue'],
            riskFactors: ['Recent viral exposure', 'Seasonal variation'],
            recommendations: [
                'Supportive care with rest and hydration',
                'Symptomatic treatment',
                'Return if symptoms worsen or persist >10 days',
                'No antibiotics indicated for viral URTI'
            ],
            guidelines: 'CDC URTI Management Guidelines',
            urgency: 'low'
        }
    ],
    cardiovascular: [
        {
            condition: 'Acute Coronary Syndrome',
            icd10: 'I20.9',
            probability: 75,
            confidence: 88,
            evidenceLevel: 'A',
            symptoms: ['Chest pain', 'Dyspnea', 'Diaphoresis'],
            riskFactors: ['Age >50', 'Hypertension', 'Diabetes', 'Smoking'],
            recommendations: [
                'Immediate 12-lead ECG',
                'Cardiac biomarkers (troponin)',
                'Aspirin 325mg unless contraindicated',
                'Cardiology consultation'
            ],
            guidelines: 'AHA/ACC 2020 ACS Guidelines',
            urgency: 'high'
        }
    ],
    gastrointestinal: [
        {
            condition: 'Acute Gastroenteritis',
            icd10: 'K59.1',
            probability: 70,
            confidence: 82,
            evidenceLevel: 'B',
            symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain'],
            riskFactors: ['Recent food intake', 'Travel history'],
            recommendations: [
                'Oral rehydration therapy',
                'BRAT diet when tolerated',
                'Monitor for dehydration',
                'Consider stool culture if severe or prolonged'
            ],
            guidelines: 'ACG Acute Diarrhea Guidelines',
            urgency: 'medium'
        }
    ]
};

// DOM Elements
const assessmentTabs = document.querySelectorAll('.assessment-tab');
const assessmentPanels = document.querySelectorAll('.assessment-panel');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const prevButton = document.getElementById('prevStep');
const nextButton = document.getElementById('nextStep');
const analyzeButton = document.querySelector('.analyze-button');
const diagnosisForm = document.getElementById('diagnosisForm');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

function initializeApp() {
    updateProgress();
    setupBMICalculation();
    setupSymptomCategories();
    updateStepIndicators();
    updateNavigationButtons();
    addSmoothAnimations();
}

function setupEventListeners() {
    // Tab navigation
    assessmentTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            if (index <= currentStep + 1) {
                goToStep(index);
            }
        });
    });
    
    // Navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentStep > 0) {
                goToStep(currentStep - 1);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (currentStep < totalSteps - 1) {
                    goToStep(currentStep + 1);
                }
            }
        });
    }
    
    // Form submission
    if (diagnosisForm) {
        diagnosisForm.addEventListener('submit', handleFormSubmission);
    }
    
    setupSymptomManagement();
    setupCategoryTabs();
    setupModernInteractions();
}

function setupBMICalculation() {
    const weightInput = document.getElementById('patientWeight');
    const heightInput = document.getElementById('patientHeight');
    const bmiInput = document.getElementById('patientBMI');
    
    if (!weightInput || !heightInput || !bmiInput) return;
    
    function calculateBMI() {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        
        if (weight && height) {
            const bmi = weight / ((height / 100) ** 2);
            bmiInput.value = bmi.toFixed(1);
        }
    }
    
    weightInput.addEventListener('input', calculateBMI);
    heightInput.addEventListener('input', calculateBMI);
}

function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= totalSteps) return;
    
    // Hide current panel
    assessmentPanels.forEach(panel => panel.classList.remove('active'));
    assessmentTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show new panel
    const targetPanel = document.getElementById(`${stepNames[stepIndex]}-tab`);
    const targetTab = assessmentTabs[stepIndex];
    
    if (targetPanel) targetPanel.classList.add('active');
    if (targetTab) targetTab.classList.add('active');
    
    currentStep = stepIndex;
    
    updateProgress();
    updateStepIndicators();
    updateNavigationButtons();
}

function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
    }
}

function updateStepIndicators() {
    const stepDots = document.querySelectorAll('.step-dot');
    stepDots.forEach((dot, index) => {
        dot.classList.toggle('active', index <= currentStep);
    });
}

function updateNavigationButtons() {
    if (prevButton) {
        prevButton.style.display = currentStep === 0 ? 'none' : 'flex';
    }
    
    if (nextButton) {
        nextButton.style.display = currentStep === totalSteps - 1 ? 'none' : 'flex';
    }
    
    if (analyzeButton) {
        analyzeButton.style.display = currentStep === totalSteps - 1 ? 'flex' : 'none';
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 0:
            const age = document.getElementById('patientAge');
            const gender = document.getElementById('patientGender');
            
            if (!age?.value || !gender?.value) {
                showNotification('Please complete required fields', 'warning');
                return false;
            }
            break;
    }
    return true;
}

function setupSymptomManagement() {
    const addSymptomBtn = document.getElementById('addSymptom');
    if (addSymptomBtn) {
        addSymptomBtn.addEventListener('click', addCustomSymptom);
    }
}

function setupCategoryTabs() {
    // Will implement category switching
}

function setupSymptomCategories() {
    // Will implement symptom category system
}

function setupModernInteractions() {
    // Add modern UI interactions
}

function addSmoothAnimations() {
    // Add smooth animations
}

function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }
}

function addCustomSymptom() {
    // Will implement custom symptom addition
}

function removeSymptom(symptomId) {
    const symptomIndex = selectedSymptoms.findIndex(s => s.id === symptomId);
    if (symptomIndex === -1) return;
    
    selectedSymptoms.splice(symptomIndex, 1);
    updateSelectedSymptoms();
    showNotification('Symptom removed', 'info');
}

function updateSelectedSymptoms() {
    const container = document.getElementById('selectedSymptoms');
    if (!container) return;
    
    container.innerHTML = '';
    
    selectedSymptoms.forEach(symptom => {
        const symptomElement = document.createElement('div');
        symptomElement.className = 'selected-symptom';
        
        symptomElement.innerHTML = `
            <span>${symptom.name}</span>
            <small>(${symptom.severity}, ${symptom.duration})</small>
            <button class="remove-symptom" onclick="removeSymptom(${symptom.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(symptomElement);
    });
}

function handleFormSubmission(e) {
    e.preventDefault();
    showNotification('Form submitted successfully!', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease;
    `;
    
    const colors = {
        success: '#00c851',
        warning: '#ff8800',
        error: '#ff4444',
        info: '#33b5e5'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.style.color = 'white';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Export functions to global scope for HTML event handlers
window.removeSymptom = removeSymptom;
window.goToStep = goToStep;

function setupEnhancedSymptoms() {
    const symptomInput = document.getElementById('symptomInput');
    const symptomSeverity = document.getElementById('symptomSeverity');
    const symptomDuration = document.getElementById('symptomDuration');
    const addSymptomBtn = document.getElementById('addSymptom');
    
    addSymptomBtn.addEventListener('click', addEnhancedSymptom);
    
    symptomInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addEnhancedSymptom();
        }
    });

    // Setup common symptoms by category
    const symptomTags = document.querySelectorAll('.symptom-tags .tag');
    symptomTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const symptom = tag.getAttribute('data-symptom');
            if (!selectedSymptoms.find(s => s.name === symptom)) {
                selectedSymptoms.push({
                    name: symptom,
                    severity: 'moderate',
                    duration: 'unknown'
                });
                tag.classList.add('selected');
                updateSelectedSymptoms();
            }
        });
    });
}

function addEnhancedSymptom() {
    const symptomInput = document.getElementById('symptomInput');
    const symptomSeverity = document.getElementById('symptomSeverity');
    const symptomDuration = document.getElementById('symptomDuration');
    
    const symptom = symptomInput.value.trim();
    const severity = symptomSeverity.value;
    const duration = symptomDuration.value.trim() || 'unknown';
    
    if (symptom && !selectedSymptoms.find(s => s.name === symptom)) {
        selectedSymptoms.push({
            name: symptom,
            severity: severity,
            duration: duration
        });
        
        symptomInput.value = '';
        symptomDuration.value = '';
        updateSelectedSymptoms();
    }
}

function updateSelectedSymptoms() {
    const container = document.getElementById('selectedSymptoms');
    container.innerHTML = '';
    
    selectedSymptoms.forEach((symptom, index) => {
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.innerHTML = `
            <span>${symptom.name} (${symptom.severity}, ${symptom.duration})</span>
            <button class="remove-btn" onclick="removeSymptom(${index})">×</button>
        `;
        container.appendChild(item);
    });
}

function removeSymptom(index) {
    const symptom = selectedSymptoms[index];
    selectedSymptoms.splice(index, 1);
    updateSelectedSymptoms();
    
    // Update common symptoms selection
    const tag = document.querySelector(`[data-symptom="${symptom.name}"]`);
    if (tag) {
        tag.classList.remove('selected');
    }
}

function setupMedicalInputs() {
    // Medical History
    setupInputManager('historyInput', 'addHistory', selectedHistory, 'selectedHistory');
    
    // Surgical History
    setupInputManager('surgicalInput', 'addSurgical', selectedSurgical, 'selectedSurgical');
    
    // Family History
    setupInputManager('familyInput', 'addFamily', selectedFamily, 'selectedFamily');
    
    // Allergies
    setupInputManager('allergyInput', 'addAllergy', selectedAllergies, 'selectedAllergies');
    
    // Imaging
    setupInputManager('imagingInput', 'addImaging', selectedImaging, 'selectedImaging');
    
    // Diagnostics
    setupInputManager('diagnosticInput', 'addDiagnostic', selectedDiagnostics, 'selectedDiagnostics');
    
    // Medications
    setupMedicationManager();
}

function setupInputManager(inputId, buttonId, dataArray, containerId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    
    if (!input || !button) return;
    
    button.addEventListener('click', () => {
        const value = input.value.trim();
        if (value && !dataArray.includes(value)) {
            dataArray.push(value);
            input.value = '';
            updateGenericList(dataArray, containerId, dataArray);
        }
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            button.click();
        }
    });
}

function setupMedicationManager() {
    const nameInput = document.getElementById('medicationName');
    const doseInput = document.getElementById('medicationDose');
    const freqInput = document.getElementById('medicationFreq');
    const addBtn = document.getElementById('addMedication');
    
    if (!addBtn) return;
    
    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const dose = doseInput.value.trim();
        const freq = freqInput.value.trim();
        
        if (name) {
            const medication = {
                name: name,
                dose: dose || 'unknown',
                frequency: freq || 'unknown'
            };
            
            selectedMedications.push(medication);
            nameInput.value = '';
            doseInput.value = '';
            freqInput.value = '';
            updateMedicationsList();
        }
    });
}

function updateGenericList(dataArray, containerId, sourceArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    dataArray.forEach((item, index) => {
        const element = document.createElement('div');
        element.className = 'selected-item';
        element.innerHTML = `
            <span>${item}</span>
            <button class="remove-btn" onclick="removeFromList('${containerId}', ${index})">×</button>
        `;
        container.appendChild(element);
    });
}

function updateMedicationsList() {
    const container = document.getElementById('selectedMedications');
    if (!container) return;
    
    container.innerHTML = '';
    selectedMedications.forEach((med, index) => {
        const element = document.createElement('div');
        element.className = 'selected-item';
        element.innerHTML = `
            <span>${med.name} ${med.dose} ${med.frequency}</span>
            <button class="remove-btn" onclick="removeMedication(${index})">×</button>
        `;
        container.appendChild(element);
    });
}

function removeFromList(containerId, index) {
    const containers = {
        'selectedHistory': selectedHistory,
        'selectedSurgical': selectedSurgical,
        'selectedFamily': selectedFamily,
        'selectedAllergies': selectedAllergies,
        'selectedImaging': selectedImaging,
        'selectedDiagnostics': selectedDiagnostics
    };
    
    const array = containers[containerId];
    if (array) {
        array.splice(index, 1);
        updateGenericList(array, containerId, array);
    }
}

function removeMedication(index) {
    selectedMedications.splice(index, 1);
    updateMedicationsList();
}

function switchTab(tabIndex) {
    if (tabIndex < 0 || tabIndex >= tabs.length) return;
    
    // Update tab buttons
    tabButtons.forEach((btn, index) => {
        btn.classList.toggle('active', index === tabIndex);
    });
    
    // Update tab content
    tabContents.forEach((content, index) => {
        content.classList.toggle('active', index === tabIndex);
    });
    
    currentTab = tabIndex;
    updateTabNavigation();
    updateProgressBar();
}

function updateProgressBar() {
    const progress = ((currentTab + 1) / tabs.length) * 100;
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    if (progressText) {
        progressText.textContent = `Step ${currentTab + 1} of ${tabs.length}`;
    }
}

function updateTabNavigation() {
    if (prevTabBtn) {
        prevTabBtn.style.display = currentTab === 0 ? 'none' : 'inline-block';
        prevTabBtn.disabled = currentTab === 0;
    }
    if (nextTabBtn) {
        nextTabBtn.style.display = currentTab === tabs.length - 1 ? 'none' : 'inline-block';
        nextTabBtn.disabled = currentTab === tabs.length - 1;
    }
}

function setupFormValidation() {
    // Add real-time validation for required fields
    const requiredFields = ['patientAge', 'patientGender'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', validateField);
        }
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
        field.style.borderColor = '#e5e7eb';
        field.style.boxShadow = 'none';
    }
}

async function handleProfessionalFormSubmit(e) {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['patientAge', 'patientGender'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            validateField({ target: field });
            isValid = false;
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required demographic information');
        switchTab(0); // Go to demographics tab
        return;
    }
    
    if (selectedSymptoms.length === 0) {
        alert('Please add at least one symptom in the Chief Complaint section');
        switchTab(1); // Go to presentation tab
        return;
    }
    
    // Collect all form data
    const patientData = collectProfessionalFormData();
    
    // Show loading state
    const submitBtn = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    if (submitBtn) submitBtn.textContent = '🔬 Analyzing Patient Data...';
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    
    // Simulate professional AI processing
    await simulateProfessionalDiagnosis();
    
    // Generate professional diagnoses
    const diagnoses = generateProfessionalDiagnoses(patientData);
    
    // Display professional results
    displayProfessionalResults(diagnoses, patientData);
    
    // Reset form state
    resetProfessionalForm();
}

function collectProfessionalFormData() {
    return {
        demographics: {
            age: document.getElementById('patientAge').value,
            gender: document.getElementById('patientGender').value,
            ethnicity: document.getElementById('patientEthnicity').value,
            weight: document.getElementById('patientWeight').value,
            height: document.getElementById('patientHeight').value,
            bmi: document.getElementById('patientBMI').value
        },
        presentation: {
            chiefComplaint: document.getElementById('chiefComplaint').value,
            symptoms: selectedSymptoms
        },
        history: {
            medical: selectedHistory,
            surgical: selectedSurgical,
            family: selectedFamily,
            smoking: document.getElementById('smokingStatus').value,
            alcohol: document.getElementById('alcoholUse').value,
            drugs: document.getElementById('drugUse').value,
            allergies: selectedAllergies
        },
        examination: {
            vitals: {
                bp: `${document.getElementById('systolicBP').value}/${document.getElementById('diastolicBP').value}`,
                hr: document.getElementById('heartRate').value,
                temp: document.getElementById('temperature').value,
                rr: document.getElementById('respiratoryRate').value,
                spo2: document.getElementById('oxygenSat').value
            },
            physical: {
                general: document.getElementById('generalExam').value,
                heent: document.getElementById('heentExam').value,
                cv: document.getElementById('cvExam').value,
                resp: document.getElementById('respExam').value,
                abd: document.getElementById('abdExam').value,
                neuro: document.getElementById('neuroExam').value
            }
        },
        investigations: {
            labs: {
                hemoglobin: document.getElementById('hemoglobin').value,
                wbc: document.getElementById('wbc').value,
                platelets: document.getElementById('platelets').value,
                glucose: document.getElementById('glucose').value,
                creatinine: document.getElementById('creatinine').value,
                sodium: document.getElementById('sodium').value
            },
            imaging: selectedImaging,
            diagnostics: selectedDiagnostics
        },
        medications: selectedMedications,
        notes: document.getElementById('additionalNotes').value
    };
}

async function simulateProfessionalDiagnosis() {
    return new Promise(resolve => {
        setTimeout(resolve, 4000);
    });
}

function generateProfessionalDiagnoses(patientData) {
    const diagnoses = [];
    
    // Analyze symptoms to determine likely diagnoses
    const symptomNames = patientData.presentation.symptoms.map(s => s.name.toLowerCase());
    
    // Check respiratory diagnoses
    if (symptomNames.includes('cough') || symptomNames.includes('dyspnea') || symptomNames.includes('shortness of breath')) {
        diagnoses.push(...professionalDiagnoses.respiratory);
    }
    
    // Check cardiovascular diagnoses
    if (symptomNames.includes('chest pain') || symptomNames.includes('palpitations')) {
        diagnoses.push(...professionalDiagnoses.cardiovascular);
    }
    
    // Check gastrointestinal diagnoses
    if (symptomNames.includes('nausea') || symptomNames.includes('vomiting') || symptomNames.includes('diarrhea')) {
        diagnoses.push(...professionalDiagnoses.gastrointestinal);
    }
    
    // If no specific diagnoses found, add some general ones
    if (diagnoses.length === 0) {
        diagnoses.push(professionalDiagnoses.respiratory[1]); // URTI
    }
    
    // Sort by probability
    return diagnoses.sort((a, b) => b.probability - a.probability);
}

function displayProfessionalResults(diagnoses, patientData) {
    const resultsList = document.getElementById('resultsList');
    const resultsSection = document.getElementById('results');
    
    resultsList.innerHTML = '';
    
    diagnoses.forEach((diagnosis, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.style.animationDelay = `${index * 0.1}s`;
        
        resultItem.innerHTML = `
            <div class="icd-code">${diagnosis.icd10}</div>
            
            <div class="result-header">
                <h3 class="result-title">${diagnosis.condition}</h3>
                <span class="urgency-badge urgency-${diagnosis.urgency}">${diagnosis.urgency}</span>
            </div>
            
            <div class="result-stats">
                <span>📊 Probability: ${diagnosis.probability}%</span>
                <span>✅ Confidence: ${diagnosis.confidence}%</span>
            </div>
            
            <div class="clinical-evidence">
                <h4>Clinical Evidence <span class="evidence-level">Level ${diagnosis.evidenceLevel}</span></h4>
                <p>Based on: ${diagnosis.guidelines}</p>
            </div>
            
            <div class="result-symptoms">
                <h4>Associated Symptoms:</h4>
                <div class="symptom-list">
                    ${diagnosis.symptoms.map(symptom => `<span class="symptom-tag">${symptom}</span>`).join('')}
                </div>
            </div>
            
            ${diagnosis.riskFactors ? `
                <div class="result-symptoms">
                    <h4>Risk Factors:</h4>
                    <div class="symptom-list">
                        ${diagnosis.riskFactors.map(factor => `<span class="symptom-tag">${factor}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="result-recommendations">
                <h4>Clinical Recommendations:</h4>
                <ul class="recommendation-list">
                    ${diagnosis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="differential-actions">
                <button class="action-btn" onclick="addToWorkup('${diagnosis.condition}')">Add to Workup</button>
                <button class="action-btn" onclick="viewGuidelines('${diagnosis.guidelines}')">View Guidelines</button>
                <button class="action-btn export-btn" onclick="exportDiagnosis('${diagnosis.condition}')">Export</button>
            </div>
        `;
        
        resultsList.appendChild(resultItem);
    });
    
    // Add professional documentation section
    addProfessionalDocumentation(patientData, diagnoses);
    
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function addProfessionalDocumentation(patientData, diagnoses) {
    const resultsList = document.getElementById('resultsList');
    
    const docSection = document.createElement('div');
    docSection.className = 'documentation-section';
    docSection.innerHTML = `
        <div class="documentation-header">
            <h3>Clinical Documentation</h3>
            <div class="doc-format-selector">
                <button class="format-btn active" onclick="switchDocFormat('soap')">SOAP Note</button>
                <button class="format-btn" onclick="switchDocFormat('hpi')">H&P Format</button>
                <button class="format-btn" onclick="switchDocFormat('summary')">Summary</button>
            </div>
        </div>
        <div class="clinical-note" id="clinicalNote">
${generateSOAPNote(patientData, diagnoses)}
        </div>
        <div style="margin-top: 16px; text-align: center;">
            <button class="btn-primary" onclick="exportDocumentation()">Export Documentation</button>
            <button class="btn-secondary" onclick="printDocumentation()">Print</button>
        </div>
    `;
    
    resultsList.appendChild(docSection);
}

function generateSOAPNote(patientData, diagnoses) {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `CLINICAL ASSESSMENT REPORT
Generated: ${date} ${time}
Provider: Dr. [Provider Name]
Patient ID: [Patient ID]

DEMOGRAPHICS:
Age: ${patientData.demographics.age} years
Gender: ${patientData.demographics.gender}
${patientData.demographics.ethnicity ? `Ethnicity: ${patientData.demographics.ethnicity}` : ''}
${patientData.demographics.bmi ? `BMI: ${patientData.demographics.bmi}` : ''}

SUBJECTIVE:
Chief Complaint: ${patientData.presentation.chiefComplaint || 'Not documented'}

History of Present Illness:
${patientData.presentation.symptoms.map(s => `- ${s.name} (${s.severity}, duration: ${s.duration})`).join('\n')}

Past Medical History: ${patientData.history.medical.join(', ') || 'None documented'}
Surgical History: ${patientData.history.surgical.join(', ') || 'None documented'}
Family History: ${patientData.history.family.join(', ') || 'None documented'}
Social History: 
  Smoking: ${patientData.history.smoking || 'Not documented'}
  Alcohol: ${patientData.history.alcohol || 'Not documented'}
  Drugs: ${patientData.history.drugs || 'Not documented'}
Allergies: ${patientData.history.allergies.join(', ') || 'NKDA'}

Current Medications:
${patientData.medications.map(m => `- ${m.name} ${m.dose} ${m.frequency}`).join('\n') || 'None documented'}

OBJECTIVE:
Vital Signs:
  Blood Pressure: ${patientData.examination.vitals.bp || 'Not taken'} mmHg
  Heart Rate: ${patientData.examination.vitals.hr || 'Not taken'} bpm
  Temperature: ${patientData.examination.vitals.temp || 'Not taken'} °C
  Respiratory Rate: ${patientData.examination.vitals.rr || 'Not taken'} /min
  O2 Saturation: ${patientData.examination.vitals.spo2 || 'Not taken'}%

Physical Examination:
  General: ${patientData.examination.physical.general || 'Not documented'}
  HEENT: ${patientData.examination.physical.heent || 'Not documented'}
  Cardiovascular: ${patientData.examination.physical.cv || 'Not documented'}
  Respiratory: ${patientData.examination.physical.resp || 'Not documented'}
  Abdominal: ${patientData.examination.physical.abd || 'Not documented'}
  Neurological: ${patientData.examination.physical.neuro || 'Not documented'}

Laboratory/Diagnostic Results:
${patientData.investigations.imaging.join('\n') || 'None documented'}
${patientData.investigations.diagnostics.join('\n') || ''}

ASSESSMENT:
Differential Diagnosis:
${diagnoses.map((d, i) => `${i + 1}. ${d.condition} (${d.icd10}) - ${d.probability}% probability`).join('\n')}

PLAN:
${diagnoses[0] ? diagnoses[0].recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n') : 'Plan to be determined'}

Additional Notes: ${patientData.notes || 'None'}

Provider Signature: _______________________
Date: ${date}

DISCLAIMER: This assessment was generated with AI assistance and requires physician review and approval.`;
}

// Professional interface functions
function addToWorkup(condition) {
    alert(`Adding ${condition} to differential workup. This would integrate with EHR systems.`);
}

function viewGuidelines(guidelines) {
    alert(`Opening clinical guidelines: ${guidelines}. This would link to medical databases.`);
}

function exportDiagnosis(condition) {
    alert(`Exporting ${condition} diagnosis. This would generate formal medical documentation.`);
}

function switchDocFormat(format) {
    const buttons = document.querySelectorAll('.format-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Here you would implement different documentation formats
    alert(`Switching to ${format.toUpperCase()} format. This would show different clinical documentation styles.`);
}

function exportDocumentation() {
    alert('Exporting clinical documentation as PDF. This would generate formal medical records.');
}

function printDocumentation() {
    window.print();
}

function resetProfessionalForm() {
    // Reset loading state
    const submitBtn = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    if (submitBtn) submitBtn.textContent = '🔬 Analyze Patient';
    if (loadingSpinner) loadingSpinner.classList.add('hidden');
    
    // Reset to first tab
    switchTab(0);
    
    // Reset form
    diagnosisForm.reset();
    
    // Reset all arrays
    selectedSymptoms = [];
    selectedHistory = [];
    selectedSurgical = [];
    selectedFamily = [];
    selectedAllergies = [];
    selectedImaging = [];
    selectedDiagnostics = [];
    selectedMedications = [];
    
    // Update displays
    updateSelectedSymptoms();
    updateGenericList(selectedHistory, 'selectedHistory', selectedHistory);
    updateGenericList(selectedSurgical, 'selectedSurgical', selectedSurgical);
    updateGenericList(selectedFamily, 'selectedFamily', selectedFamily);
    updateGenericList(selectedAllergies, 'selectedAllergies', selectedAllergies);
    updateGenericList(selectedImaging, 'selectedImaging', selectedImaging);
    updateGenericList(selectedDiagnostics, 'selectedDiagnostics', selectedDiagnostics);
    updateMedicationsList();
    
    // Reset common symptoms
    const tags = document.querySelectorAll('.symptom-tags .tag');
    tags.forEach(tag => tag.classList.remove('selected'));
}

// Enhanced interactivity
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-tertiary').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Professional keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                if (currentTab < tabs.length - 1) switchTab(currentTab + 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (currentTab > 0) switchTab(currentTab - 1);
                break;
            case 'Enter':
                if (e.shiftKey && currentTab === tabs.length - 1) {
                    e.preventDefault();
                    diagnosisForm.dispatchEvent(new Event('submit'));
                }
                break;
        }
    }
});

// Professional data validation and clinical decision support
function validateClinicalData(patientData) {
    const warnings = [];
    
    // Age-based validations
    const age = parseInt(patientData.demographics.age);
    if (age > 65 && patientData.presentation.symptoms.some(s => s.name.toLowerCase().includes('chest pain'))) {
        warnings.push('Consider ACS workup in elderly patient with chest pain');
    }
    
    // Drug interaction checks (simplified)
    const medications = patientData.medications.map(m => m.name.toLowerCase());
    if (medications.includes('warfarin') && medications.includes('aspirin')) {
        warnings.push('Warning: Increased bleeding risk with warfarin + aspirin combination');
    }
    
    return warnings;
}

// Initialize professional analytics
function initializeProfessionalAnalytics() {
    // This would integrate with medical analytics platforms
    console.log('Professional medical analytics initialized');
}

// Call initialization
initializeProfessionalAnalytics();