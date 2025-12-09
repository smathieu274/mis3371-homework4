console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", function () {

  // ---------- BASIC ELEMENT REFERENCES ----------
  const form = document.getElementById("registration");
  const validateBtn = document.getElementById("validateBtn");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const form = document.getElementById("registration");
  const previewModal = document.getElementById("previewModal");
  const modalBody = document.getElementById("modalBody");
  const modalSubmit = document.getElementById("modalSubmit");
  const modalBack = document.getElementById("modalBack");
  const modalClose = document.getElementById("modalClose");
  
  const slider = document.getElementById("slider");
  const sliderValue = document.getElementById("sliderValue");

  const dob = document.getElementById("DOB");
  const dobRange = document.getElementById("dobRange");
  const stateSelect = document.getElementById("state");

  const welcomeMessage = document.getElementById("welcomeMessage");
  const notYouContainer = document.getElementById("notYouContainer");
  const notYouCheckbox = document.getElementById("notYouCheckbox");
  const rememberMeCheckbox = document.getElementById("rememberMe");

  const usernameInput = document.getElementById("username");
  const pwd = document.getElementById("pwd");
  const confirmPwd = document.getElementById("confirm_pwd");
  const ssn = document.getElementById("ssn");

  // ---------- DATE IN BANNER ----------
  const today = new Date();
  const dateOptions = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
  const dateSpan = document.getElementById("currentDate");
  if (dateSpan) {
    dateSpan.textContent = today.toLocaleDateString("en-US", dateOptions);
  }

  // ---------- ERROR HELPERS ----------
  function showError(inputId, message) {
    const errorSpan = document.getElementById(inputId + "Error");
    const input = document.getElementById(inputId);
    if (errorSpan) errorSpan.textContent = message;
    if (input) input.classList.add("error-input");
    if (submitBtn) submitBtn.style.display = "none";
  }

  function clearError(inputId) {
    const errorSpan = document.getElementById(inputId + "Error");
    const input = document.getElementById(inputId);
    if (errorSpan) errorSpan.textContent = "";
    if (input) input.classList.remove("error-input");
  }

  // ---------- SLIDER ----------
  function updateSliderPosition() {
    if (!slider || !sliderValue) return;
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    const val = parseInt(slider.value);
    sliderValue.textContent = val;

    const percent = (val - min) / (max - min);
    const sliderWidth = slider.offsetWidth;
    const labelWidth = sliderValue.offsetWidth;
    const left = percent * (sliderWidth - labelWidth) + labelWidth / 2;

    sliderValue.style.left = `${left}px`;
  }

  if (slider && sliderValue) {
    slider.value = 1;
    updateSliderPosition();
    slider.addEventListener("input", () => {
      updateSliderPosition();
      validateSlider();
      saveSingleFieldToStorage("slider");
    });
    window.addEventListener("resize", updateSliderPosition);
  }

  function validateSlider() {
    const id = "slider";
    if (!slider) return true;
    const value = parseInt(slider.value, 10);
    if (isNaN(value) || value < 1 || value > 10) {
      showError(id, "Please choose a pain level between 1 and 10.");
      return false;
    }
    clearError(id);
    return true;
  }

  // ---------- DOB RANGE ----------
  if (dob && dobRange) {
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const maxDate = `${yyyy}-${mm}-${dd}`;
    const minDate = `${yyyy - 120}-${mm}-${dd}`;

    dob.setAttribute("max", maxDate);
    dob.setAttribute("min", minDate);
    dobRange.textContent = `Allowed range: ${minDate} to ${maxDate}`;
  }

  function validateDOB() {
    const id = "DOB";
    if (!dob) return true;
    const value = dob.value;
    if (!value) {
      showError(id, "Date of birth is required.");
      return false;
    }

    const dateVal = new Date(value);
    const todayLocal = new Date();

    if (isNaN(dateVal.getTime())) {
      showError(id, "Please enter a valid date.");
      return false;
    }
    if (dateVal > todayLocal) {
      showError(id, "Date of birth cannot be in the future.");
      return false;
    }

    const oldestAllowed = new Date();
    oldestAllowed.setFullYear(oldestAllowed.getFullYear() - 120);
    if (dateVal < oldestAllowed) {
      showError(id, "Age cannot be more than 120 years.");
      return false;
    }

    clearError(id);
    return true;
  }

  if (dob) {
    dob.addEventListener("blur", () => {
      validateDOB();
      saveSingleFieldToStorage("DOB");
    });
    dob.addEventListener("input", validateDOB);
  }

  // ---------- FETCH API FOR STATES ----------
  async function loadStatesWithFetch() {
    if (!stateSelect) return;

    try {
      const response = await fetch("states.html");
      if (!response.ok) throw new Error("Fetch failed");
      const optionsHtml = await response.text();
      stateSelect.innerHTML = '<option value="">--Select State--</option>' + optionsHtml;
    } catch (err) {
      console.error("Error loading states:", err);
      // Fallback so the field is still usable
      stateSelect.innerHTML = '<option value="">--Select State--</option>';
    }
  }
  loadStatesWithFetch();

  // ---------- FIELD VALIDATION ----------
  function validateFirstName() {
    const id = "first_name";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    const regex = /^[A-Za-z'-]{1,30}$/;
    if (!value) {
      showError(id, "First name is required.");
      return false;
    }
    if (!regex.test(value)) {
      showError(id, "Letters, apostrophes, and dashes only.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateMiddleInitial() {
    const id = "middle_initial";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    if (!value) {
      clearError(id);
      return true;
    }
    if (!/^[A-Za-z]$/.test(value)) {
      showError(id, "Middle initial must be a single letter.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateLastName() {
    const id = "last_name";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    const regex = /^[A-Za-z'-]{1,30}$/;
    if (!value) {
      showError(id, "Last name is required.");
      return false;
    }
    if (!regex.test(value)) {
      showError(id, "Letters, apostrophes, and dashes only.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validatePhone() {
    const id = "phone";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    if (!value) {
      showError(id, "Phone number is required.");
      return false;
    }
    if (!regex.test(value)) {
      showError(id, "Use format 123-456-7890.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateUsername() {
    const id = "username";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    const regex = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/;
    if (!value) {
      showError(id, "User ID is required.");
      return false;
    }
    if (!regex.test(value)) {
      showError(id, "5–20 chars, start with a letter, only letters, numbers, - and _.");
      return false;
    }
    clearError(id);
    return true;
  }

  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,30}$/;

  function validatePassword() {
    const id = "pwd";
    if (!pwd) return true;
    const pass = pwd.value.trim();
    const user = usernameInput ? usernameInput.value.trim().toLowerCase() : "";

    if (!pass) {
      showError(id, "Password is required.");
      return false;
    }
    if (!passwordPattern.test(pass)) {
      showError(id, "Must be 8+ chars with upper, lower, and a number.");
      return false;
    }
    if (user && pass.toLowerCase().includes(user)) {
      showError(id, "Password cannot contain or match your username.");
      return false;
    }
    clearError(id);
    return true;
  }

  function checkPasswordMatch() {
    const id = "confirm_pwd";
    if (!pwd || !confirmPwd) return true;
    if (!confirmPwd.value) {
      showError(id, "Please re-enter your password.");
      return false;
    }
    if (pwd.value !== confirmPwd.value) {
      showError(id, "Passwords do not match.");
      return false;
    }
    clearError(id);
    return true;
  }

  function formatSSN(value) {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    let formatted = "";
    if (digits.length > 0) formatted = digits.slice(0, 3);
    if (digits.length >= 4) formatted += "-" + digits.slice(3, 5);
    if (digits.length >= 6) formatted += "-" + digits.slice(5, 9);
    return formatted;
  }

  function validateSSN() {
    const id = "ssn";
    if (!ssn) return true;
    ssn.value = formatSSN(ssn.value);
    const digits = ssn.value.replace(/\D/g, "");
    if (digits.length !== 9) {
      showError(id, "SSN must be exactly 9 digits.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateAddress1() {
    const id = "address1";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    if (value.length < 2 || value.length > 30) {
      showError(id, "Address Line 1 must be 2–30 characters.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateAddress2() {
    const id = "address2";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    if (!value) {
      clearError(id);
      return true;
    }
    if (value.length < 2 || value.length > 30) {
      showError(id, "Address Line 2 must be 2–30 characters if entered.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateCity() {
    const id = "city";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    const regex = /^[A-Za-z\s'-]{2,30}$/;
    if (!value) {
      showError(id, "City is required.");
      return false;
    }
    if (!regex.test(value)) {
      showError(id, "City should contain only letters, spaces, apostrophes, or dashes.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateState() {
    const id = "state";
    if (!stateSelect || !stateSelect.value) {
      showError(id, "Please select a state.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateZip() {
    const id = "zip";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    const regex = /^\d{5}$/;
    if (!regex.test(value)) {
      showError(id, "ZIP code must be 5 digits.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateEmail() {
    const id = "email";
    const input = document.getElementById(id);
    if (!input) return true;
    let value = input.value.trim().toLowerCase();
    input.value = value;
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!value) {
      showError(id, "Email is required.");
      return false;
    }
    if (!regex.test(value)) {
      showError(id, "Enter a valid email like name@domain.com.");
      return false;
    }
    clearError(id);
    return true;
  }

  function validateRadioGroup(name, errorId, message) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const anyChecked = Array.from(radios).some(r => r.checked);
    const errorSpan = document.getElementById(errorId);
    if (!anyChecked) {
      if (errorSpan) errorSpan.textContent = message;
      if (submitBtn) submitBtn.style.display = "none";
      return false;
    }
    if (errorSpan) errorSpan.textContent = "";
    return true;
  }

  function validateGender() {
    return validateRadioGroup("gender", "genderError", "Please select a gender.");
  }

  function validateContact() {
    return validateRadioGroup("contact", "contactError", "Please select a contact method.");
  }

  function validateMedication() {
    return validateRadioGroup("medication", "medicationError", "Please indicate if you take medication.");
  }

  function validateSymptoms() {
    const id = "symptoms";
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    if (!value) {
      showError(id, "Please describe your symptoms.");
      return false;
    }
    clearError(id);
    return true;
  }

  // ---------- LOCAL STORAGE ----------
  const STORAGE_PREFIX = "patient_";
  const FIELDS_TO_STORE = [
    "first_name", "middle_initial", "last_name", "DOB", "phone",
    "username", "address1", "address2", "city", "state",
    "zip", "email", "symptoms", "slider"
  ];
  const RADIO_GROUPS = ["gender", "contact", "medication"];
  const CONDITIONS_NAME = "conditions";

  function shouldUseStorage() {
    return rememberMeCheckbox && rememberMeCheckbox.checked;
  }

  function saveSingleFieldToStorage(id) {
    if (!shouldUseStorage()) return;
    const el = document.getElementById(id);
    if (!el) return;
    localStorage.setItem(STORAGE_PREFIX + id, el.value);
  }

  function saveRadioGroupToStorage(name) {
    if (!shouldUseStorage()) return;
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const checked = Array.from(radios).find(r => r.checked);
    if (checked) {
      localStorage.setItem(STORAGE_PREFIX + "radio_" + name, checked.value);
    }
  }

  function saveConditionsToStorage() {
    if (!shouldUseStorage()) return;
    const checkboxes = document.querySelectorAll(`input[name="${CONDITIONS_NAME}"]`);
    const selected = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    localStorage.setItem(STORAGE_PREFIX + CONDITIONS_NAME, JSON.stringify(selected));
  }

  function clearAllStoredData() {
    FIELDS_TO_STORE.forEach(id => localStorage.removeItem(STORAGE_PREFIX + id));
    RADIO_GROUPS.forEach(name => localStorage.removeItem(STORAGE_PREFIX + "radio_" + name));
    localStorage.removeItem(STORAGE_PREFIX + CONDITIONS_NAME);
  }

  function loadStoredDataIntoForm() {
    if (!shouldUseStorage()) return;

    // text/select/textarea
    FIELDS_TO_STORE.forEach(id => {
      const el = document.getElementById(id);
      const stored = localStorage.getItem(STORAGE_PREFIX + id);
      if (el && stored !== null) {
        el.value = stored;
      }
    });

    // radio groups
    RADIO_GROUPS.forEach(name => {
      const stored = localStorage.getItem(STORAGE_PREFIX + "radio_" + name);
      if (!stored) return;
      const radios = document.querySelectorAll(`input[name="${name}"]`);
      radios.forEach(r => {
        r.checked = (r.value === stored);
      });
    });

    // checkbox conditions
    const storedConditions = localStorage.getItem(STORAGE_PREFIX + CONDITIONS_NAME);
    if (storedConditions) {
      try {
        const selected = JSON.parse(storedConditions);
        const checkboxes = document.querySelectorAll(`input[name="${CONDITIONS_NAME}"]`);
        checkboxes.forEach(cb => {
          cb.checked = selected.includes(cb.value);
        });
      } catch (e) {
        console.error("Error parsing stored conditions:", e);
      }
    }

    // ensure slider label matches
    updateSliderPosition();
  }

  // ---------- COOKIES ----------
  function setCookie(name, value, hours) {
    let expires = "";
    if (hours) {
      const d = new Date();
      d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
      expires = "; expires=" + d.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  function eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999; path=/";
  }

  function updateWelcomeFromCookie() {
    const cookieFirstName = getCookie("firstName");

    if (cookieFirstName) {
      if (welcomeMessage) {
        welcomeMessage.textContent = "Welcome back, " + cookieFirstName + "!";
      }
      if (notYouContainer) {
        notYouContainer.style.display = "inline-block";
      }
      const firstNameInput = document.getElementById("first_name");
      if (firstNameInput && !firstNameInput.value) {
        firstNameInput.value = cookieFirstName;
      }
      // returning user: load stored data
      loadStoredDataIntoForm();
    } else {
      if (welcomeMessage) {
        welcomeMessage.textContent = "Welcome, new user.";
      }
      if (notYouContainer) {
        notYouContainer.style.display = "none";
      }
    }
  }

  // ---------- VALIDATION + STORAGE EVENTS ----------
  function addInputValidationAndStorage(id, validateFn) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => {
      validateFn();
      saveSingleFieldToStorage(id);
    });
    el.addEventListener("blur", () => {
      validateFn();
      saveSingleFieldToStorage(id);
    });
  }

  addInputValidationAndStorage("first_name", validateFirstName);
  addInputValidationAndStorage("middle_initial", validateMiddleInitial);
  addInputValidationAndStorage("last_name", validateLastName);
  addInputValidationAndStorage("phone", validatePhone);
  addInputValidationAndStorage("address1", validateAddress1);
  addInputValidationAndStorage("address2", validateAddress2);
  addInputValidationAndStorage("city", validateCity);
  addInputValidationAndStorage("zip", validateZip);
  addInputValidationAndStorage("email", validateEmail);
  addInputValidationAndStorage("symptoms", validateSymptoms);

  if (usernameInput) {
    usernameInput.addEventListener("input", () => {
      validateUsername();
      validatePassword();
      saveSingleFieldToStorage("username");
    });
    usernameInput.addEventListener("blur", () => {
      validateUsername();
      saveSingleFieldToStorage("username");
    });
  }

  if (pwd) {
    pwd.addEventListener("input", () => {
      validatePassword();
      checkPasswordMatch();
    });
    pwd.addEventListener("blur", () => {
      validatePassword();
      checkPasswordMatch();
    });
  }

  if (confirmPwd) {
    confirmPwd.addEventListener("input", checkPasswordMatch);
    confirmPwd.addEventListener("blur", checkPasswordMatch);
  }

  if (ssn) {
    ssn.addEventListener("input", validateSSN);
    ssn.addEventListener("blur", validateSSN);
  }

  if (stateSelect) {
    stateSelect.addEventListener("change", () => {
      validateState();
      saveSingleFieldToStorage("state");
    });
  }

  RADIO_GROUPS.forEach(name => {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach(r => {
      r.addEventListener("change", () => {
        if (name === "gender") validateGender();
        if (name === "contact") validateContact();
        if (name === "medication") validateMedication();
        saveRadioGroupToStorage(name);
      });
    });
  });

  const conditionCheckboxes = document.querySelectorAll(`input[name="${CONDITIONS_NAME}"]`);
  conditionCheckboxes.forEach(cb => {
    cb.addEventListener("change", saveConditionsToStorage);
  });

  // ---------- FORM-WIDE VALIDATION ----------
  function validateForm() {
    let isValid = true;

    if (!validateFirstName()) isValid = false;
    if (!validateMiddleInitial()) isValid = false;
    if (!validateLastName()) isValid = false;
    if (!validateDOB()) isValid = false;
    if (!validatePhone()) isValid = false;
    if (!validateUsername()) isValid = false;
    if (!validatePassword()) isValid = false;
    if (!checkPasswordMatch()) isValid = false;
    if (!validateSSN()) isValid = false;
    if (!validateAddress1()) isValid = false;
    if (!validateAddress2()) isValid = false;
    if (!validateCity()) isValid = false;
    if (!validateState()) isValid = false;
    if (!validateZip()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validateGender()) isValid = false;
    if (!validateContact()) isValid = false;
    if (!validateMedication()) isValid = false;
    if (!validateSymptoms()) isValid = false;
    if (!validateSlider()) isValid = false;

    if (isValid) {
      if (submitBtn) submitBtn.style.display = "inline-block";

      // REMEMBER ME: cookie + storage
      if (shouldUseStorage()) {
        const firstNameEl = document.getElementById("first_name");
        if (firstNameEl && firstNameEl.value.trim() !== "") {
          setCookie("firstName", firstNameEl.value.trim(), 48);
        }
        FIELDS_TO_STORE.forEach(id => saveSingleFieldToStorage(id));
        RADIO_GROUPS.forEach(name => saveRadioGroupToStorage(name));
        saveConditionsToStorage();
      } else {
        eraseCookie("firstName");
        clearAllStoredData();
      }

      alert("Click Submit to finish.");
    } else {
      if (submitBtn) submitBtn.style.display = "none";
      alert("Fix the errors in red.");
    }

    return isValid;
  }

  if (validateBtn) {
    validateBtn.addEventListener("click", validateForm);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (validateForm()) {
        // use your thank you page name
        window.location.href = "thank-yous.html";
      } else {
        alert("Some fields still need attention.");
      }
    });
  }

  // ---------- RESET BUTTON ----------
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      const errorSpans = document.querySelectorAll(".error");
      errorSpans.forEach(span => span.textContent = "");
      const errorInputs = document.querySelectorAll(".error-input");
      errorInputs.forEach(input => input.classList.remove("error-input"));
      if (submitBtn) submitBtn.style.display = "none";

      if (!shouldUseStorage()) {
        clearAllStoredData();
      }
    });
  }

  // ---------- REVIEW BUTTON ----------
  const reviewBtn = document.getElementById("reviewBtn");
  const reviewSection = document.getElementById("reviewSection");
  const reviewContent = document.getElementById("reviewContent");

const checkBtn = document.getElementById("checkBtn");
  if (checkBtn) {
    checkBtn.addEventListener("click", function(e) {
      e.preventDefault();
      const allGood = validateForm();
  
  if (reviewBtn && form && reviewContent && reviewSection) {
    reviewBtn.addEventListener("click", function () {
      const formData = new FormData(form);

      let output = `<h3>PLEASE REVIEW THIS INFORMATION</h3>`;
      output += `<table style="border-collapse: collapse; width: 100%; margin-top: 10px;">`;

      formData.forEach((value, key) => {
        if (key.toLowerCase().includes("pwd") || key.toLowerCase().includes("ssn")) {
          output += `
            <tr>
              <td style="border: 1px solid #ccc; padding: 6px; font-weight: bold;">${key}</td>
              <td style="border: 1px solid #ccc; padding: 6px;">(hidden for security)</td>
            </tr>
          `;
        } else if (value.trim() !== "") {
          output += `
            <tr>
              <td style="border: 1px solid #ccc; padding: 6px; font-weight: bold;">${key}</td>
              <td style="border: 1px solid #ccc; padding: 6px;">${value}</td>
            </tr>
          `;
        }
      });

      output += `</table>`;

      reviewContent.innerHTML = output;
      reviewSection.style.display = "block";
      reviewSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ---------- REMEMBER ME & NOT YOU ----------
  if (rememberMeCheckbox) {
    rememberMeCheckbox.addEventListener("change", function () {
      if (!rememberMeCheckbox.checked) {
        eraseCookie("firstName");
        clearAllStoredData();
      } else {
        const firstNameEl = document.getElementById("first_name");
        if (firstNameEl && firstNameEl.value.trim() !== "") {
          setCookie("firstName", firstNameEl.value.trim(), 48);
        }
      }
    });
  }

  if (notYouCheckbox) {
    notYouCheckbox.addEventListener("change", function () {
      if (notYouCheckbox.checked) {
        eraseCookie("firstName");
        clearAllStoredData();
        if (form) form.reset();
        if (submitBtn) submitBtn.style.display = "none";
        if (welcomeMessage) welcomeMessage.textContent = "Welcome, new user.";
        if (notYouContainer) notYouContainer.style.display = "none";
        notYouCheckbox.checked = false;
      }
    });
  }

  // ---------- INITIAL COOKIE CHECK ----------
  updateWelcomeFromCookie();
const formData = new FormData(form);
      let html = '<table style="width:100%; border-collapse:collapse;">';
      formData.forEach((value, key) => {
        let displayVal = value;
        if (/pwd|password/i.test(key)) displayVal = "(password hidden)";
        if (/ssn/i.test(key)) displayVal = value ? '***-**-****' : "";
        if (key === "conditions") { /* if repeated field, join handled below */ }
        html += `<tr><td style="padding:6px; border-bottom:1px solid #eee;"><strong>${key}</strong></td><td style="padding:6px; border-bottom:1px solid #eee;">${displayVal}</td></tr>`;
      });
      const conds = Array.from(document.querySelectorAll('input[name="conditions"]:checked')).map(cb => cb.value);
      html += `<tr><td style="padding:6px;"><strong>conditions</strong></td><td style="padding:6px;">${conds.join(', ')}</td></tr>`;
      html += "</table>";
      modalBody.innerHTML = html;

      // Enable submit button only if validateForm returned true
      if (allGood) {
        modalSubmit.disabled = false;
      } else {
        modalSubmit.disabled = true;
      }

      // Show modal
      previewModal.style.display = "block";
      previewModal.setAttribute("aria-hidden", "false");
    });
  }

  // Modal buttons
  modalBack.addEventListener("click", function(){ previewModal.style.display = "none"; previewModal.setAttribute("aria-hidden","true"); });
  modalClose.addEventListener("click", () => modalBack.click());

  // If user clicks outside the modal content, close and go back to form
  window.addEventListener("click", function(event) {
    if (event.target === previewModal) modalBack.click();
  });

  // Modal submit -> perform actual submit (but only if still valid)
  modalSubmit.addEventListener("click", function(e) {
    e.preventDefault();
    // final validation before real submit
    if (validateForm()) {
      window.location.href = "thank-you.html";
    } else {
     
      modalSubmit.disabled = true;
      
    }
  });

  const zipInput = document.getElementById("zip");
  const cityInput = document.getElementById("city");
  const stateSelect = document.getElementById("state");

  async function lookupZip(zip) {
    if (!/^\d{5}$/.test(zip)) return false;
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) return false;
      const data = await res.json();
      
      const place = data.places && data.places[0];
      if (place) {
        cityInput.value = place["place name"];
      
        const abbr = place["state abbreviation"];
       
        if (stateSelect) {
          const opt = Array.from(stateSelect.options).find(o => o.value === abbr || o.text === abbr);
          if (opt) {
            stateSelect.value = opt.value;
          } else {
           
            const newOpt = document.createElement("option");
            newOpt.value = abbr;
            newOpt.textContent = place["state"];
            stateSelect.appendChild(newOpt);
            stateSelect.value = abbr;
          }
        }
     
        cityInput.setAttribute("readonly", "true");
        stateSelect.setAttribute("disabled", "true");
        clearError("zip");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Zip lookup error:", err);
      return false;
    }
  }

  zipInput.addEventListener("blur", async function() {
    const zip = zipInput.value.trim();
    if (!zip) return;
    const ok = await lookupZip(zip);
    if (!ok) {
      showError("zip", "ZIP not found. Please enter city/state manually.");
      cityInput.removeAttribute("readonly");
      stateSelect.removeAttribute("disabled");
    } else {
  
    }
  });

 
  zipInput.addEventListener("input", function() {
    if (zipInput.value.length < 5) {
      cityInput.removeAttribute("readonly");
      stateSelect.removeAttribute("disabled");
    }
  });
});
});
