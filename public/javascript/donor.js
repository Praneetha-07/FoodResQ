// document.addEventListener("DOMContentLoaded", () => {
//   // --- DOM Elements ---
//   const header = document.querySelector(".volun-donor-header");
//   const navButtons = document.querySelectorAll(".nav-button-vol-donor");
//   const donationForm = document.getElementById("donationForm");
//   const donationHistoryDiv = document.getElementById("donationHistory");
//   const donorProfileForm = document.getElementById("donorProfileForm");
//   const logoutButton = document.getElementById("logout-donor");

//   const donorNameInput = document.getElementById("donorName");
//   const donorLocationInput = document.getElementById("donorLocation"); // This typically maps to address
//   const donorPhoneInput = document.getElementById("donorPhone");
//   const donorOrgInput = document.getElementById("donorOrg");

//   // Summary elements
//   const totalDonationsMadeSpan = document.getElementById("totalDonationsMade");
//   const totalFoodContributedSpan = document.getElementById(
//     "totalFoodContributed"
//   );

//   // --- State Variables ---
//   let donationsMade = []; // Array to store all donor's submitted donations
//   let totalDonationsCount = 0;
//   let totalFoodKg = 0;

//   // --- Functions ---

//   // Function to load user profile from localStorage and populate form
//   function loadDonorProfile() {
//     const userName = localStorage.getItem("userName");
//     const userEmail = localStorage.getItem("userEmail"); // Not used in this snippet, but useful for profile
//     const userPhoneNumber = localStorage.getItem("userPhoneNumber");
//     const userAddress = localStorage.getItem("userAddress");
//     const userOrganization = localStorage.getItem("userOrganization");

//     if (donorNameInput) donorNameInput.value = userName || "";
//     if (donorLocationInput) donorLocationInput.value = userAddress || "";
//     if (donorPhoneInput) donorPhoneInput.value = userPhoneNumber || "";
//     if (donorOrgInput) donorOrgInput.value = userOrganization || "";
//   }

//   // Function to update the summary section
//   function updateSummary() {
//     totalDonationsCount = donationsMade.length;
//     totalFoodKg = donationsMade.reduce(
//       (sum, donation) => sum + donation.quantity,
//       0
//     );

//     totalDonationsMadeSpan.textContent = totalDonationsCount;
//     totalFoodContributedSpan.textContent = totalFoodKg;
//   }

//   // Function to render the donation history
//   function renderDonationHistory() {
//     donationHistoryDiv.innerHTML = ""; // Clear existing entries

//     if (donationsMade.length === 0) {
//       return;
//     }

//     donationsMade.forEach((donation) => {
//       const donationCard = document.createElement("div");
//       donationCard.className = "donation-card"; // Apply a class for styling
//       donationCard.dataset.donationId = donation.id; // Store ID for actions

//       donationCard.innerHTML = `
//         <h3>${donation.foodType}</h3>
//         <p><strong>Quantity:</strong> ${donation.quantity} kg</p>
//         <p><strong>Address:</strong> ${donation.address}</p>
//         <p><strong>Ready Until:</strong> ${donation.readyUntilTime} ${
//         donation.readyUntilDate ? `on ${donation.readyUntilDate}` : ""
//       }</p>
//         <p><strong>Status:</strong> <span class="status-${donation.status
//           .toLowerCase()
//           .replace(/\s/g, "-")}}">${donation.status}</span></p>
//         ${
//           donation.notes
//             ? `<p><strong>Notes:</strong> ${donation.notes}</p>`
//             : ""
//         }
//         ${
//           donation.imageUpload
//             ? `<img src="${donation.imageUpload}" alt="Donation Image" style="max-width: 100px; height: auto;">`
//             : ""
//         }
//         ${
//           donation.status === "Pending Pickup"
//             ? `<button class="cancel-donation-btn" data-id="${donation.id}">Cancel</button>`
//             : ""
//         }
//         `;
//       donationHistoryDiv.appendChild(donationCard);
//     });

//     // Add event listeners for new cancel buttons
//     document.querySelectorAll(".cancel-donation-btn").forEach((button) => {
//       button.addEventListener("click", cancelDonation);
//     });
//   }

//   // Function to handle donation cancellation
//   function cancelDonation(event) {
//     const donationId = parseInt(event.target.dataset.id);
//     const index = donationsMade.findIndex((d) => d.id === donationId);

//     if (index !== -1 && donationsMade[index].status === "Pending Pickup") {
//       const confirmed = confirm(
//         "Are you sure you want to cancel this donation?"
//       );
//       if (confirmed) {
//         donationsMade[index].status = "Cancelled"; // Update status
//         updateSummary(); // Re-calculate totals (if cancelled donations shouldn't count)
//         renderDonationHistory(); // Re-render to update status in UI
//         alert(`Donation ${donationId} has been cancelled.`);
//       }
//     } else {
//       alert("Cannot cancel this donation.");
//     }
//   }

//   // Function to handle form submission for new donations
//   function handleDonationFormSubmit(event) {
//     event.preventDefault(); // Prevent default form submission

//     const formData = new FormData(donationForm);
//     const newDonation = {
//       id: Date.now(), // Simple unique ID based on timestamp
//       foodType: formData.get("foodType"),
//       quantity: parseFloat(formData.get("quantity")), // Convert to number
//       address: formData.get("address"),
//       readyUntilTime: formData.get("readyUntilTime"),
//       readyUntilDate: formData.get("readyUntilDate"), // Optional date
//       notes: formData.get("notes"),
//       imageUpload: null, // Placeholder for image, handle actual upload separately
//       status: "Pending Pickup", // Initial status
//       submissionDate: new Date().toLocaleDateString(),
//       submissionTime: new Date().toLocaleTimeString(),
//     };

//     const imageFile = formData.get("imageUpload");
//     if (imageFile && imageFile.name) {
//       console.log("Image selected:", imageFile.name);
//       newDonation.imageUpload = URL.createObjectURL(imageFile); // For temporary client-side display
//     }

//     donationsMade.push(newDonation); // Add the new donation to the array
//     donationForm.reset(); // Clear the form

//     updateSummary(); // Update totals
//     renderDonationHistory(); // Re-render history to show the new donation

//     alert("Donation submitted successfully!");
//     console.log("Current donations:", donationsMade);
//   }

//   // Function for Logout (Consolidated to one definition)
//   function handleLogout() {
//     console.log("Donor Logout button clicked!");
//     localStorage.removeItem("userToken");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userPhoneNumber");
//     localStorage.removeItem("userAddress");
//     localStorage.removeItem("userOrganization"); // Clear donor-specific data
//     alert("You have been logged out.");
//     window.location.href = "/"; // Redirect to login page
//   }

//   // --- Event Listeners ---

//   // Navigation button click handler for smooth scrolling
//   navButtons.forEach((button) => {
//     button.addEventListener("click", (event) => {
//       const targetId = event.currentTarget.dataset.target;

//       if (event.currentTarget.id === "logout-donor") {
//         handleLogout();
//       } else if (targetId) {
//         const targetSection = document.getElementById(targetId);
//         if (targetSection) {
//           targetSection.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }
//       }
//     });
//   });

//   // Attach submit event listener to the donation form
//   if (donationForm) {
//     donationForm.addEventListener("submit", handleDonationFormSubmit);
//   }

//   // Attach submit event listener for the donor profile form (with fetch logic)
//   if (donorProfileForm) {
//     donorProfileForm.addEventListener("submit", async (event) => {
//       event.preventDefault(); // Prevent default form submission

//       const updatedData = {
//         name: donorNameInput.value,
//         phoneNumber: donorPhoneInput.value,
//         address: donorLocationInput.value, // Assuming donorLocation is address
//         organization: donorOrgInput.value,
//       };

//       try {
//         const token = localStorage.getItem("userToken");
//         const response = await fetch("/api/users/profile", {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(updatedData),
//         });

//         const data = await response.json();
//         if (response.ok) {
//           alert(data.message);
//           // Update localStorage with new data returned from backend
//           localStorage.setItem("userName", data.user.name);
//           localStorage.setItem("userPhoneNumber", data.user.phoneNumber);
//           localStorage.setItem("userAddress", data.user.address);
//           localStorage.setItem("userOrganization", data.user.organization);
//           // Reload profile to ensure consistency with updated localStorage values
//           loadDonorProfile();
//         } else {
//           alert(`Failed to update profile: ${data.message || "Server error"}`);
//         }
//       } catch (error) {
//         console.error("Error updating donor profile:", error);
//         alert("An error occurred while updating profile.");
//       }
//     });
//   }

//   // --- Initial Render & Setup ---
//   updateSummary(); // Initialize summary display
//   renderDonationHistory(); // Render any initial donations
//   loadDonorProfile(); // Load and display donor profile data
// });

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const header = document.querySelector(".volun-donor-header");
  const navButtons = document.querySelectorAll(".nav-button-vol-donor");
  const donationForm = document.getElementById("donationForm"); // Assuming your donation form has this ID
  const donationHistoryDiv = document.getElementById("donationHistory");
  const donorProfileForm = document.getElementById("donorProfileForm");
  const logoutButton = document.getElementById("logout-donor");

  const donorNameInput = document.getElementById("donorName");
  const donorLocationInput = document.getElementById("donorLocation"); // This typically maps to address
  const donorPhoneInput = document.getElementById("donorPhone");
  const donorOrgInput = document.getElementById("donorOrg");

  // Summary elements (these will now be updated from API)
  const totalDonationsMadeSpan = document.getElementById("totalDonationsMade");
  const totalFoodContributedSpan = document.getElementById(
    "totalFoodContributed"
  );

  // --- Functions ---

  // Function to show/hide sections based on data-target
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      navButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const targetId = button.dataset.target;
      document.querySelectorAll(".volun-donor-sec").forEach((section) => {
        section.style.display = "none";
      });
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = "block";
      }
    });
  });

  // Function to load user profile from localStorage and populate form
  function loadDonorProfile() {
    const userName = localStorage.getItem("userName");
    const userPhoneNumber = localStorage.getItem("userPhoneNumber");
    const userAddress = localStorage.getItem("userAddress");
    const userOrganization = localStorage.getItem("userOrganization");

    if (donorNameInput) donorNameInput.value = userName || "";
    if (donorPhoneInput) donorPhoneInput.value = userPhoneNumber || "";
    if (donorLocationInput) donorLocationInput.value = userAddress || "";
    if (donorOrgInput) donorOrgInput.value = userOrganization || "";
  }

  // Function to handle donation form submission
  async function handleDonationSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const foodType = document.getElementById("foodType").value;
    const quantity = parseFloat(document.getElementById("quantity").value);
    const address = document.getElementById("donationAddress").value;
    const readyUntilDate = document.getElementById("readyUntilDate").value;
    const readyUntilTime = document.getElementById("readyUntilTime").value;

    if (
      !foodType ||
      isNaN(quantity) ||
      quantity <= 0 ||
      !address ||
      !readyUntilDate ||
      !readyUntilTime
    ) {
      alert("Please fill in all donation details correctly.");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodType,
          quantity,
          address,
          readyUntilDate,
          readyUntilTime,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        donationForm.reset(); // Clear the form
        fetchDonationsForDonor(); // Refresh donation history and summary
      } else {
        alert(`Failed to submit donation: ${data.message || "Server error"}`);
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("An error occurred while submitting donation.");
    }
  }

  // Function to fetch and render donor's past donations and update summary
  async function fetchDonationsForDonor() {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("/api/donations/my-donations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const donations = data.donations;

      // Update summary
      let totalFood = 0;
      donations.forEach((d) => {
        totalFood += d.quantity;
      });
      totalDonationsMadeSpan.textContent = donations.length;
      totalFoodContributedSpan.textContent = totalFood;

      // Render history
      donationHistoryDiv.innerHTML = "";
      if (donations.length > 0) {
        donations.forEach((donation) => {
          const donationElement = document.createElement("div");
          donationElement.classList.add("donation-item");
          donationElement.style.border = "2px solid rgb(241, 183, 183)";
          donationElement.style.padding = "10px";
          donationElement.style.marginBottom = "10px";
          donationElement.style.borderRadius = "5px";

          donationElement.innerHTML = `
            <p><strong>Food Type:</strong> ${donation.foodType}</p>
            <p><strong>Quantity:</strong> ${donation.quantity} kg</p>
            <p><strong>Address:</strong> ${donation.address}</p>
            <p><strong>Ready Until:</strong> ${new Date(
              donation.readyUntilDate
            ).toLocaleDateString()} at ${donation.readyUntilTime}</p>
            <p><strong>Status:</strong> ${donation.status}</p>
            <p><small>Donated On: ${new Date(
              donation.createdAt
            ).toLocaleDateString()}</small></p>
          `;
          donationHistoryDiv.appendChild(donationElement);
        });
      } else {
        donationHistoryDiv.innerHTML = "<p>No donations made yet.</p>";
      }
    } catch (error) {
      console.error("Error fetching donor donations:", error);
      donationHistoryDiv.innerHTML =
        "<p style='color: red;'>Failed to load donation history.</p>";
    }
  }

  // Handle donor profile form submission
  if (donorProfileForm) {
    donorProfileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const updatedData = {
        name: donorNameInput.value,
        phoneNumber: donorPhoneInput.value,
        address: donorLocationInput.value, // Assuming donorLocation is address
        organization: donorOrgInput.value,
      };

      try {
        const token = localStorage.getItem("userToken");
        const response = await fetch("/api/users/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          // Update localStorage with new data returned from backend
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userPhoneNumber", data.user.phoneNumber);
          localStorage.setItem("userAddress", data.user.address);
          localStorage.setItem("userOrganization", data.user.organization);
          // Reload profile to ensure consistency with updated localStorage values
          loadDonorProfile();
        } else {
          alert(`Failed to update profile: ${data.message || "Server error"}`);
        }
      } catch (error) {
        console.error("Error updating donor profile:", error);
        alert("An error occurred while updating profile.");
      }
    });
  }

  // Handle logout
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhoneNumber");
      localStorage.removeItem("userAddress");
      localStorage.removeItem("userOrganization");
      alert("Logged out successfully!");
      window.location.href = "/login"; // Redirect to login page
    });
  }

  // --- Initial Render & Setup ---
  // Ensure the correct section is shown initially if applicable
  const initialTarget =
    document.querySelector(".nav-button-vol-donor.active")?.dataset.target ||
    "submitDonation";
  const initialSection = document.getElementById(initialTarget);
  if (initialSection) {
    initialSection.style.display = "block";
  } else {
    // Default to submitDonation if no active button found
    document.getElementById("submitDonation").style.display = "block";
    document
      .querySelector(".nav-button-vol-donor[data-target='submitDonation']")
      ?.classList.add("active");
  }

  loadDonorProfile(); // Load and display donor profile data

  // Attach event listener for donation form
  if (donationForm) {
    donationForm.addEventListener("submit", handleDonationSubmit);
  }

  // Fetch initial donations history when the page loads
  fetchDonationsForDonor();
});
