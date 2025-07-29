function showForm(formId) {
  const allForms = document.querySelectorAll(".form-section");
  const allTabButtons = document.querySelectorAll(".tab-button");

  allForms.forEach((form) => {
    form.classList.remove("active");
  });
  allTabButtons.forEach((button) => {
    button.classList.remove("active");
  });

  const targetForm = document.getElementById(formId + "Form");
  if (targetForm) {
    targetForm.classList.add("active");
  } else {
    console.warn(`Form section with ID '${formId}Form' not found.`);
  }

  let targetButton;
  if (formId === "register") {
    targetButton = document.querySelector(
      `.tab-button[onclick="showForm('register')"]`
    );
  } else if (formId === "volunteer") {
    targetButton = document.querySelector(
      `.tab-button[onclick="showForm('volunteer')"]`
    );
  } else {
    targetButton = document.querySelector(
      `.tab-button[onclick="showForm('login')"]`
    );
  }

  if (targetButton) {
    targetButton.classList.add("active");
  } else {
    console.warn(`Tab button for '${formId}' not found.`);
  }

  localStorage.setItem("activeForm", formId);
}

// When the page loads, check for a stored preference or URL parameter
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedForm = urlParams.get("form");

  // Get form elements - these need to be defined *before* handleLogin/handleRegistration
  // Make sure these IDs match your login.html
  const loginUserForm = document.getElementById("loginUserForm");
  const registerDonorForm = document.getElementById("registerDonorForm");
  const registerVolunteerForm = document.getElementById(
    "registerVolunteerForm"
  );

  async function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission

    const email = loginUserForm.email.value;
    const password = loginUserForm.password.value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        alert(data.message);
        // Store common user info
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.name || "");
        localStorage.setItem("userPhoneNumber", data.phoneNumber || "");
        localStorage.setItem("userAddress", data.address || "");

        // Store role-specific info
        if (data.role === "volunteer") {
          localStorage.setItem("userGender", data.gender || "");
          localStorage.setItem("userDob", data.dob || ""); // Store as string
          localStorage.setItem(
            "userStudyOccupation",
            data.studyOccupation || ""
          );
          localStorage.setItem(
            "userPreferredLocation",
            data.preferredLocation || ""
          );
        } else if (data.role === "donor") {
          localStorage.setItem("userOrganization", data.organization || "");
        }

        // Redirect to appropriate dashboard
        if (data.role === "donor") {
          window.location.href = "/Donor-dashboard";
        } else if (data.role === "volunteer") {
          window.location.href = "/vol-dashboard";
        } else {
          // Fallback or error if role is unexpected
          alert("Login successful, but unknown role. Redirecting to home.");
          window.location.href = "/";
        }
      } else {
        // Login failed
        alert(
          `Login failed: ${data.message || "Please check your credentials."}`
        );
        console.error("Login error:", data);
      }
    } catch (error) {
      console.error("Network error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  }

  async function handleRegistration(event, role) {
    event.preventDefault(); // Prevent default form submission

    let formData = {};
    if (role === "donor") {
      formData = {
        name: registerDonorForm.name.value,
        email: registerDonorForm.email.value,
        password: registerDonorForm.password.value,
        phoneNumber: registerDonorForm.phoneNumber.value,
        address: registerDonorForm.address.value,
        organization: registerDonorForm.organization.value,
        role: "donor",
      };
    } else if (role === "volunteer") {
      formData = {
        name: registerVolunteerForm.name.value,
        email: registerVolunteerForm.email.value,
        password: registerVolunteerForm.password.value,
        phoneNumber: registerVolunteerForm.phoneNumber.value,
        address: registerVolunteerForm.address.value,
        gender: registerVolunteerForm.gender.value,
        dob: registerVolunteerForm.dob.value,
        studyOccupation: registerVolunteerForm.studyOccupation.value,
        preferredLocation: registerVolunteerForm.preferredLocation.value,
        role: "volunteer",
      };
    } else {
      alert("Invalid registration role specified.");
      return; // Stop function execution
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${data.message}`);
        // Store common user info
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.name || "");
        localStorage.setItem("userPhoneNumber", data.phoneNumber || "");
        localStorage.setItem("userAddress", data.address || "");

        // Store role-specific info
        if (data.role === "volunteer") {
          localStorage.setItem("userGender", data.gender || "");
          localStorage.setItem("userDob", data.dob || "");
          localStorage.setItem(
            "userStudyOccupation",
            data.studyOccupation || ""
          );
          localStorage.setItem(
            "userPreferredLocation",
            data.preferredLocation || ""
          );
        } else if (data.role === "donor") {
          localStorage.setItem("userOrganization", data.organization || "");
        }

        // Redirect to appropriate dashboard
        if (data.role === "donor") {
          window.location.href = "/Donor-dashboard";
        } else if (data.role === "volunteer") {
          window.location.href = "/vol-dashboard";
        } else {
          // Fallback if role is unexpected after registration
          alert(
            "Registration successful, but an unexpected role was returned."
          );
          window.location.href = "/";
        }
      } else {
        const errorMessage =
          data.message ||
          (data.errors
            ? data.errors.join(", ")
            : "Registration failed. Please try again.");
        alert(`Registration failed: ${errorMessage}`);
        console.error("Registration error response:", data);
      }
    } catch (error) {
      console.error("Network error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    }
  }

  // --- Attach Event Listeners ---
  // Ensure the form elements are accessible before adding listeners
  if (loginUserForm) {
    loginUserForm.addEventListener("submit", handleLogin);
  }
  if (registerDonorForm) {
    registerDonorForm.addEventListener("submit", (event) =>
      handleRegistration(event, "donor")
    );
  }
  if (registerVolunteerForm) {
    registerVolunteerForm.addEventListener("submit", (event) =>
      handleRegistration(event, "volunteer")
    );
  }

  // --- Consolidated Initial Form Display and Auto-Redirect Logic ---
  const userToken = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");

  if (userToken && userRole) {
    // If user is already logged in, redirect them immediately
    if (userRole === "donor") {
      window.location.href = "/Donor-dashboard";
    } else if (userRole === "volunteer") {
      window.location.href = "/vol-dashboard";
    } else {
      // Handle unexpected role by showing login or redirecting to home
      console.warn(
        "Logged-in user has an unexpected role. Showing login form."
      );
      showForm("login"); // Default to login form if role is unknown
    }
  } else if (requestedForm) {
    // If not logged in, but a form is requested via URL param (e.g., from /volunteer)
    showForm(requestedForm);
  } else {
    // If nothing, default to login form
    showForm("login");
  }
});
