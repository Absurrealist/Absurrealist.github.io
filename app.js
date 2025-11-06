// Application state (in-memory only - no localStorage)
const appState = {
    currentForm: 'landingPage',
    formData: {},
    startTime: null,
    timerInterval: null
};

// Timer functionality
function startTimer() {
    appState.startTime = Date.now();
    document.getElementById('timerDisplay').style.display = 'block';
    
    appState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - appState.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('timerText').textContent = `TIME ELAPSED: ${minutes}:${seconds}`;
    }, 1000);
}

function stopTimer() {
    if (appState.timerInterval) {
        clearInterval(appState.timerInterval);
        appState.timerInterval = null;
    }
    document.getElementById('timerDisplay').style.display = 'none';
}

// Form navigation
function showForm(formId) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(formId).classList.add('active');
    appState.currentForm = formId;
    window.scrollTo(0, 0);
}

function showLoading(message) {
    document.getElementById('loadingText').textContent = message;
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Start application
function startApplication() {
    showLoading('Initialising your application...');
    setTimeout(() => {
        hideLoading();
        startTimer();
        showForm('form1');
    }, 1500);
}

// Form 1: Request Identification
document.getElementById('initialForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    appState.formData.informationSeeking = document.getElementById('informationSeeking').value;
    appState.formData.requestReason = document.getElementById('requestReason').value;
    appState.formData.requestCategory = document.getElementById('requestCategory').value;
    appState.formData.departmentOrigin = document.getElementById('departmentOrigin').value;

    showLoading('Validating your request...');
    setTimeout(() => {
        hideLoading();
        showForm('form2');
    }, 1200);
});

// Form 2: Identity Verification
document.getElementById('identityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    appState.formData.legalName = document.getElementById('legalName').value;
    appState.formData.dob = document.getElementById('dob').value;
    appState.formData.currentAddress = document.getElementById('currentAddress').value;
    appState.formData.emailAddress = document.getElementById('emailAddress').value;
    appState.formData.phoneNumber = document.getElementById('phoneNumber').value;
    appState.formData.identityCertification = document.getElementById('identityCertification').checked;

    showLoading('Verifying your identity...');
    setTimeout(() => {
        hideLoading();
        showForm('form3');
    }, 1500);
});

// Form 3: Department Routing
const govOpsRadios = document.querySelectorAll('input[name="govOps"]');
govOpsRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        const govLevelGroup = document.getElementById('govLevelGroup');
        const nonGovGroup = document.getElementById('nonGovGroup');
        const localAlert = document.getElementById('localAlert');
        
        if (this.value === 'yes') {
            govLevelGroup.style.display = 'block';
            nonGovGroup.style.display = 'none';
            localAlert.classList.add('hidden');
        } else if (this.value === 'no') {
            govLevelGroup.style.display = 'none';
            nonGovGroup.style.display = 'block';
            localAlert.classList.add('hidden');
        } else {
            govLevelGroup.style.display = 'none';
            nonGovGroup.style.display = 'none';
            localAlert.classList.add('hidden');
        }
    });
});

document.getElementById('governmentLevel').addEventListener('change', function() {
    const federalDeptGroup = document.getElementById('federalDeptGroup');
    const stateGroup = document.getElementById('stateGroup');
    const localAlert = document.getElementById('localAlert');
    
    if (this.value === 'federal') {
        federalDeptGroup.style.display = 'block';
        stateGroup.style.display = 'none';
        localAlert.classList.add('hidden');
    } else if (this.value === 'state') {
        federalDeptGroup.style.display = 'none';
        stateGroup.style.display = 'block';
        localAlert.classList.add('hidden');
    } else if (this.value === 'local') {
        federalDeptGroup.style.display = 'none';
        stateGroup.style.display = 'none';
        localAlert.classList.remove('hidden');
    } else {
        federalDeptGroup.style.display = 'none';
        stateGroup.style.display = 'none';
        localAlert.classList.add('hidden');
    }
});

document.getElementById('routingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedGovOps = document.querySelector('input[name="govOps"]:checked');
    if (!selectedGovOps) {
        alert('Please select whether your request relates to government operations.');
        return;
    }
    
    appState.formData.govOps = selectedGovOps.value;
    appState.formData.governmentLevel = document.getElementById('governmentLevel').value;
    appState.formData.federalDepartment = document.getElementById('federalDepartment').value;
    appState.formData.stateSelection = document.getElementById('stateSelection').value;
    appState.formData.nonGovCategory = document.getElementById('nonGovCategory').value;

    showLoading('Routing your request...');
    setTimeout(() => {
        hideLoading();
        showForm('form4');
    }, 1500);
});

// Form 4: Exemption Analysis
document.getElementById('exemptionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const exemptions = [];
    for (let i = 1; i <= 10; i++) {
        const checkbox = document.getElementById('exempt' + i);
        if (checkbox && checkbox.checked) {
            exemptions.push(checkbox.nextElementSibling.textContent);
        }
    }
    appState.formData.exemptions = exemptions;

    showLoading('Analysing exemptions...');
    setTimeout(() => {
        hideLoading();
        showForm('form5');
    }, 1500);
});

// Form 5: Documentation
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = 'Selected: ' + file.name;
        
        // Random upload response
        const responses = [
            'File refused',
            'File accepted but not processed',
            'File in wrong temporal format',
            'File too real',
            'Upload successful. Please await verification (180-365 days)'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        document.getElementById('uploadMessage').textContent = randomResponse;
        document.getElementById('uploadStatus').classList.remove('hidden');
    }
});

document.getElementById('documentationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const docs = [];
    for (let i = 1; i <= 8; i++) {
        const checkbox = document.getElementById('doc' + i);
        if (checkbox && checkbox.checked) {
            docs.push(checkbox.nextElementSibling.textContent);
        }
    }
    appState.formData.documents = docs;

    showLoading('Processing documentation...');
    setTimeout(() => {
        hideLoading();
        showForm('form6');
    }, 1500);
});

// Form 6: Justification
document.getElementById('publicInterest').addEventListener('input', function() {
    const remaining = 500 - this.value.length;
    document.getElementById('charCount').textContent = remaining + ' characters remaining (countdown may be inaccurate)';
});

document.getElementById('expectationScale').addEventListener('input', function() {
    document.getElementById('scaleValue').textContent = this.value;
});

document.getElementById('previousSubmission').addEventListener('change', function() {
    const prevCountGroup = document.getElementById('prevCountGroup');
    const satisfactionGroup = document.getElementById('satisfactionGroup');
    
    if (this.value === 'yes') {
        prevCountGroup.style.display = 'block';
        satisfactionGroup.style.display = 'block';
        
        // Auto-increment count (surreal effect)
        let count = 1;
        const countInterval = setInterval(() => {
            count += Math.floor(Math.random() * 3) + 1;
            document.getElementById('previousCount').value = count;
            if (count > 20) {
                clearInterval(countInterval);
            }
        }, 500);
    } else {
        prevCountGroup.style.display = 'none';
        satisfactionGroup.style.display = 'none';
    }
});

document.getElementById('justificationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedAck = document.querySelector('input[name="acknowledge"]:checked');
    if (!selectedAck) {
        alert('Please acknowledge the question about responses.');
        return;
    }
    
    appState.formData.restatedRequest = document.getElementById('restatedRequest').value;
    appState.formData.publicInterest = document.getElementById('publicInterest').value;
    appState.formData.acknowledge = selectedAck.value;
    appState.formData.expectationScale = document.getElementById('expectationScale').value;
    appState.formData.previousSubmission = document.getElementById('previousSubmission').value;
    appState.formData.previousSatisfaction = document.getElementById('previousSatisfaction').value;

    showLoading('Processing justification...');
    setTimeout(() => {
        hideLoading();
        showForm('form7');
    }, 1500);
});

// Form 7: Final Submission
document.getElementById('finalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check all checkboxes
    const allChecked = 
        document.getElementById('final1').checked &&
        document.getElementById('final2').checked &&
        document.getElementById('final3').checked &&
        document.getElementById('final4').checked &&
        document.getElementById('final5').checked;
    
    if (!allChecked) {
        alert('Please acknowledge all statements to proceed.');
        return;
    }

    // Simulate processing with stuck progress
    let percent = 0;
    const interval = setInterval(() => {
        if (percent < 99) {
            percent += Math.floor(Math.random() * 10) + 1;
            if (percent > 99) percent = 99;
            document.getElementById('processingPercent').textContent = percent + '%';
        }
    }, 300);
    
    // After delay, jump to 100% and show endpoint
    setTimeout(() => {
        clearInterval(interval);
        document.getElementById('processingPercent').textContent = '100%';
        showLoading('Finalising submission...');
        
        setTimeout(() => {
            hideLoading();
            stopTimer();
            // Random endpoint selection
            const endpointNum = Math.floor(Math.random() * 6) + 1;
            showEndpoint(endpointNum);
        }, 1500);
    }, 5000);
});

function showEndpoint(num) {
    // Set up endpoint-specific content
    if (num === 3) {
        // Future date for endpoint 3
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 2);
        futureDate.setMonth(Math.floor(Math.random() * 12));
        document.getElementById('futureDate').textContent = futureDate.toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    
    showForm('endpoint' + num);
}

// Endpoint functions
function checkStatus() {
    // Loop back to same endpoint with different queue position
    const newPosition = Math.floor(Math.random() * 900000) + 800000;
    alert('Processing Status Update:\n\nQueue Position: ' + newPosition + ' of ' + (newPosition - 1) + '\nEstimated Wait Time: Unable to Calculate\n\nPlease check again later (or earlier).');
}

function startNewRequest() {
    // Reset to stage 1 but now "Step 1 of 14"
    if (confirm('Begin new request? Progress indicator may show 1 of 14 stages.')) {
        returnToHome();
    }
}

function beginMetaRequest() {
    // Start over with surreal message
    alert('Beginning Meta-Request Process...\n\nYou will now complete a request to request information about requesting information.\n\nThis process has 37 steps.');
    returnToHome();
}

function acknowledge() {
    returnToHome();
}

function returnToHome() {
    // Reset application
    appState.currentForm = 'landingPage';
    appState.formData = {};
    stopTimer();
    
    // Reset all forms
    document.querySelectorAll('form').forEach(form => form.reset());
    document.querySelectorAll('.alert.hidden').forEach(alert => alert.classList.add('hidden'));
    document.getElementById('uploadStatus').classList.add('hidden');
    document.getElementById('localAlert').classList.add('hidden');
    
    showForm('landingPage');
    window.scrollTo(0, 0);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('FOI Bureaucracy Portal v2 - Department of Information and Records');
    console.log('System Status: Operational (or not)');
});
