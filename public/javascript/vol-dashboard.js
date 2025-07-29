// document.addEventListener("DOMContentLoaded", () => {
//   const donationList = document.getElementById("donationList");
//   const assignedList = document.getElementById("assignedList");
//   const pickupCount = document.getElementById("pickupCount");
//   const foodSaved = document.getElementById("foodSaved");

//   const volunteerProfileForm = document.getElementById("volunteerProfileForm"); // New ID
//   const volProfileNameInput = document.getElementById("volProfileName");
//   const volProfileEmailInput = document.getElementById("volProfileEmail");
//   const volProfilePhoneInput = document.getElementById("volProfilePhone");
//   const volProfileAddressInput = document.getElementById("volProfileAddress");
//   const volProfileGenderSelect = document.getElementById("volProfileGender");
//   const volProfileDobInput = document.getElementById("volProfileDob");
//   const volProfileStudyInput = document.getElementById("volProfileStudy");
//   const volProfilePreferredLocationInput = document.getElementById(
//     "volProfilePreferredLocation"
//   );

//   let completedPickups = 0;
//   let totalFood = 0;

//   const donations = [
//     {
//       id: 1,
//       donor: "Restaurant A",
//       foodType: "Cooked Rice & Curry",
//       quantity: 10,
//       location: "MG Road",
//     },
//     {
//       id: 2,
//       donor: "Event Hall B",
//       foodType: "Snacks & Juices",
//       quantity: 5,
//       location: "Benz Circle",
//     },
//     {
//       id: 3,
//       donor: "Family Home C",
//       foodType: "Chapatis & Dal",
//       quantity: 8,
//       location: "Guntur Road",
//     },
//   ];

//   const assignedPickups = [];

//   const navButtons = document.querySelectorAll(".nav-button-vol-donor");

//   function handleLogout() {
//     console.log("Volunteer Logout button clicked!");
//     localStorage.removeItem("userToken"); // Clear the token
//     localStorage.removeItem("userRole"); // Clear role
//     localStorage.removeItem("userId"); // Clear userId
//     localStorage.removeItem("userEmail"); // Clear email
//     alert("You have been logged out."); // User feedback
//     window.location.href = "/"; // Redirect to login page
//   }

//   function loadVolunteerProfile() {
//     const userName = localStorage.getItem("userName");
//     const userEmail = localStorage.getItem("userEmail");
//     const userPhoneNumber = localStorage.getItem("userPhoneNumber");
//     const userAddress = localStorage.getItem("userAddress");
//     const userGender = localStorage.getItem("userGender");
//     const userDob = localStorage.getItem("userDob");
//     const userStudyOccupation = localStorage.getItem("userStudyOccupation");
//     const userPreferredLocation = localStorage.getItem("userPreferredLocation");

//     if (volProfileNameInput) volProfileNameInput.value = userName || "";
//     if (volProfileEmailInput) volProfileEmailInput.value = userEmail || ""; // Email is read-only
//     if (volProfilePhoneInput)
//       volProfilePhoneInput.value = userPhoneNumber || "";
//     if (volProfileAddressInput)
//       volProfileAddressInput.value = userAddress || "";
//     if (volProfileGenderSelect) volProfileGenderSelect.value = userGender || "";
//     // Date input requires 'YYYY-MM-DD' format
//     if (volProfileDobInput && userDob)
//       volProfileDobInput.value = userDob.split("T")[0] || "";
//     if (volProfileStudyInput)
//       volProfileStudyInput.value = userStudyOccupation || "";
//     if (volProfilePreferredLocationInput)
//       volProfilePreferredLocationInput.value = userPreferredLocation || "";
//   }

//   navButtons.forEach((button) => {
//     button.addEventListener("click", (event) => {
//       const targetId = event.currentTarget.dataset.target;

//       if (event.currentTarget.id === "logout-btn") {
//         // Use the ID directly
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

//   function renderDonations() {
//     donationList.innerHTML = "";
//     if (donations.length === 0) {
//       return;
//     }
//     donations.forEach((donation) => {
//       const card = document.createElement("div");
//       card.className = "card";
//       card.innerHTML = `
//         <h3>${donation.donor}</h3>
//         <p><strong>Food:</strong> ${donation.foodType}</p>
//         <p><strong>Quantity:</strong> ${donation.quantity} kg</p>
//         <p><strong>Location:</strong> ${donation.location}</p>
//         <button onclick="acceptPickup(${donation.id}) ">Accept Pickup</button>
//       `;
//       donationList.appendChild(card);
//     });
//   }

//   function renderAssignedPickups() {
//     assignedList.innerHTML = "";
//     if (assignedPickups.length === 0) {
//       return;
//     }
//     assignedPickups.forEach((pickup) => {
//       const card = document.createElement("div");
//       card.className = "card";
//       card.dataset.pickupId = pickup.id;
//       card.innerHTML = `
//         <h3>${pickup.donor}</h3>
//         <p><strong>Food:</strong> ${pickup.foodType}</p>
//         <p><strong>Quantity:</strong> ${pickup.quantity} kg</p>
//         <p><strong>Location:</strong> ${pickup.location}</p>
//         <button onclick="markDelivered(${pickup.id})">Mark as Delivered</button>
//       `;
//       assignedList.appendChild(card);
//     });
//   }

//   window.acceptPickup = function (id) {
//     const donationIndex = donations.findIndex((d) => d.id === id);

//     if (donationIndex !== -1) {
//       const [acceptedDonation] = donations.splice(donationIndex, 1); // Remove from available
//       assignedPickups.push(acceptedDonation); // Add to assigned

//       renderDonations(); // Re-render available donations
//       renderAssignedPickups(); // Re-render assigned pickups
//     }
//   };

//   window.markDelivered = function (id) {
//     // Find the delivered item in the assignedPickups array
//     const deliveredIndex = assignedPickups.findIndex((p) => p.id === id);

//     if (deliveredIndex !== -1) {
//       const [deliveredPickup] = assignedPickups.splice(deliveredIndex, 1);

//       completedPickups++;
//       totalFood += deliveredPickup.quantity;

//       pickupCount.textContent = completedPickups;
//       foodSaved.textContent = totalFood;

//       renderAssignedPickups();
//     }
//   };

//   if (volunteerProfileForm) {
//     volunteerProfileForm.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       // Implement logic to send updated profile data to your backend API
//       // (This requires a new API endpoint, see Step 4)
//       const updatedData = {
//         name: volProfileNameInput.value,
//         phoneNumber: volProfilePhoneInput.value,
//         address: volProfileAddressInput.value,
//         gender: volProfileGenderSelect.value,
//         dob: volProfileDobInput.value,
//         studyOccupation: volProfileStudyInput.value,
//         preferredLocation: volProfilePreferredLocationInput.value,
//       };

//       try {
//         const token = localStorage.getItem("userToken");
//         const response = await fetch("/api/users/profile", {
//           // Assuming new API endpoint
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
//           // Optionally update localStorage with new data if backend returns it
//           localStorage.setItem("userName", data.user.name);
//           localStorage.setItem("userPhoneNumber", data.user.phoneNumber);
//           localStorage.setItem("userAddress", data.user.address);
//           localStorage.setItem("userGender", data.user.gender);
//           localStorage.setItem("userDob", data.user.dob);
//           localStorage.setItem(
//             "userStudyOccupation",
//             data.user.studyOccupation
//           );
//           localStorage.setItem(
//             "userPreferredLocation",
//             data.user.preferredLocation
//           );
//           // Reload profile to ensure consistency (or just update values directly)
//           loadVolunteerProfile();
//         } else {
//           alert(`Failed to update profile: ${data.message || "Server error"}`);
//         }
//       } catch (error) {
//         console.error("Error updating volunteer profile:", error);
//         alert("An error occurred while updating profile.");
//       }
//     });
//   }

//   renderDonations();
//   renderAssignedPickups();
//   loadVolunteerProfile();
// });

// public/javascript/vol-dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const donationList = document.getElementById("donationList"); // For available
  const assignedList = document.getElementById("assignedList"); // For assigned
  const pickupCount = document.getElementById("pickupCount"); // For impact summary
  const foodSaved = document.getElementById("foodSaved"); // For impact summary

  const volunteerProfileForm = document.getElementById("volunteerProfileForm");
  const logoutButton = document.getElementById("logout-btn");

  // Navigation buttons
  const navAvailableBtn = document.querySelector(
    '.nav-button-vol-donor[data-target="available"]'
  );
  const navAssignedBtn = document.querySelector(
    '.nav-button-vol-donor[data-target="assigned"]'
  );
  const navImpactBtn = document.querySelector(
    '.nav-button-vol-donor[data-target="impact"]'
  );
  const navProfileBtn = document.querySelector(
    '.nav-button-vol-donor[data-target="profile"]'
  );

  // Sections
  const availableSection = document.getElementById("available");
  const assignedSection = document.getElementById("assigned");
  const impactSection = document.getElementById("impact");
  const profileSection = document.getElementById("profile");

  // --- Functions to fetch and render donations ---

  async function fetchAvailableDonations() {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("/api/donations/available", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Unauthorized. Please log in.");
          window.location.href = "/login";
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      renderDonations(data.donations);
    } catch (error) {
      console.error("Error fetching available donations:", error);
      if (donationList) {
        donationList.innerHTML = `<p style="color: red;">Error loading available donations. Please try again.</p>`;
      }
    }
  }

  function renderDonations(donations) {
    if (donationList) {
      donationList.innerHTML = ""; // Clear existing donations
      const noAvailableMessage = document.getElementById(
        "noAvailableDonationsMessage"
      );
      if (noAvailableMessage) noAvailableMessage.remove();

      if (donations.length === 0) {
        const p = document.createElement("p");
        p.id = "noAvailableDonationsMessage";
        p.textContent = "No available donations at the moment.";
        donationList.appendChild(p);
        return;
      }

      donations.forEach((donation) => {
        const card = document.createElement("div");
        card.className = "donation-card";
        card.innerHTML = `
          <h3>${donation.foodType} - ${donation.quantity} kg</h3>
          <p><strong>Donor:</strong> ${
            donation.donor ? donation.donor.name : "N/A"
          } (${donation.donor ? donation.donor.organization : "N/A"})</p>
          <p><strong>Address:</strong> ${donation.address}</p>
          <p><strong>Ready Until:</strong> ${new Date(
            donation.readyUntilDate
          ).toLocaleDateString()} at ${donation.readyUntilTime}</p>
          <button class="accept-btn" data-id="${
            donation._id
          }">Accept Pickup</button>
        `;
        donationList.appendChild(card);
      });

      document.querySelectorAll(".accept-btn").forEach((button) => {
        button.addEventListener("click", handleAcceptPickup);
      });
    }
  }

  async function handleAcceptPickup(event) {
    const donationId = event.target.dataset.id;
    if (!confirm("Are you sure you want to accept this pickup?")) {
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(
        `/api/donations/${donationId}/accept-pickup`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchAvailableDonations(); // Refresh available donations
        fetchAssignedPickups(); // Refresh assigned pickups
        fetchImpactSummary(); // Refresh impact summary (if applicable)
      } else {
        alert(`Failed to accept pickup: ${data.message || "Server error"}`);
      }
    } catch (error) {
      console.error("Error accepting pickup:", error);
      alert("An error occurred while accepting the pickup.");
    }
  }

  async function fetchAssignedPickups() {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("/api/donations/my-pickups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Already handled in fetchAvailableDonations, but good to have
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      renderAssignedPickups(data.pickups);
    } catch (error) {
      console.error("Error fetching assigned pickups:", error);
      if (assignedList) {
        assignedList.innerHTML = `<p style="color: red;">Error loading your pickups.</p>`;
      }
    }
  }

  function renderAssignedPickups(pickups) {
    if (assignedList) {
      assignedList.innerHTML = ""; // Clear existing pickups
      const noAssignedMessage = document.getElementById(
        "noAssignedPickupsMessage"
      );
      if (noAssignedMessage) noAssignedMessage.remove();

      if (pickups.length === 0) {
        const p = document.createElement("p");
        p.id = "noAssignedPickupsMessage";
        p.textContent = "You haven't accepted any pickups yet.";
        assignedList.appendChild(p);
        return;
      }

      pickups.forEach((pickup) => {
        const card = document.createElement("div");
        card.className = "donation-card assigned";
        let actionButton = "";

        // Only show "Mark as Delivered" button if status is "picked-up"
        if (pickup.status === "picked-up") {
          actionButton = `<button class="mark-delivered-btn" data-id="${pickup._id}">Mark as Delivered</button>`;
        } else if (pickup.status === "delivered") {
          actionButton = `<p class="status-delivered">DELIVERED</p>`;
        }

        card.innerHTML = `
          <h3>${pickup.foodType} - ${pickup.quantity} kg</h3>
          <p><strong>From:</strong> ${
            pickup.donor ? pickup.donor.name : "N/A"
          } (${pickup.donor ? pickup.donor.organization : "N/A"})</p>
          <p><strong>Contact:</strong> ${
            pickup.donor ? pickup.donor.phoneNumber : "N/A"
          }</p>
          <p><strong>Pickup Address:</strong> ${pickup.address}</p>
          <p><strong>Status:</strong> ${pickup.status.toUpperCase()}</p>
          ${actionButton}
        `;
        assignedList.appendChild(card);
      });

      // Attach event listeners to the new mark-delivered buttons
      document.querySelectorAll(".mark-delivered-btn").forEach((button) => {
        button.addEventListener("click", handleMarkDelivered);
      });
    }
  }

  async function handleMarkDelivered(event) {
    const donationId = event.target.dataset.id;
    if (!confirm("Are you sure you want to mark this donation as DELIVERED?")) {
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(
        `/api/donations/${donationId}/mark-delivered`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchAssignedPickups(); // Refresh assigned pickups list
        fetchImpactSummary(); // Update impact summary
      } else {
        alert(`Failed to mark as delivered: ${data.message || "Server error"}`);
      }
    } catch (error) {
      console.error("Error marking as delivered:", error);
      alert("An error occurred while marking the donation as delivered.");
    }
  }

  // Function to fetch and update impact summary
  async function fetchImpactSummary() {
    // This is a placeholder. You'll need a backend route for volunteer-specific impact.
    // For now, it will just update based on client-side variables if you have them.
    // If you want to calculate from DB, you'd need a new API route like:
    // router.get("/my-impact", protect, authorizeRoles("volunteer"), async (req, res) => { ... });
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("/api/donations/my-pickups", {
        // Re-using my-pickups for demo
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      let completed = 0;
      let foodKg = 0;
      data.pickups.forEach((p) => {
        if (p.status === "delivered") {
          // Assuming you'll add a "mark as delivered" action later
          completed++;
          foodKg += p.quantity;
        }
      });
      if (pickupCount) pickupCount.textContent = completed;
      if (foodSaved) foodSaved.textContent = foodKg;
    } catch (error) {
      console.error("Error fetching impact summary:", error);
      if (pickupCount) pickupCount.textContent = "Error";
      if (foodSaved) foodSaved.textContent = "Error";
    }
  }

  // --- Load volunteer profile ---
  function loadVolunteerProfile() {
    const volProfileNameInput = document.getElementById("volProfileName");
    const volProfileEmailInput = document.getElementById("volProfileEmail");
    const volProfilePhoneInput = document.getElementById("volProfilePhone");
    const volProfileAddressInput = document.getElementById("volProfileAddress");
    const volProfileGenderSelect = document.getElementById("volProfileGender");
    const volProfileDobInput = document.getElementById("volProfileDob");
    const volProfileStudyInput = document.getElementById("volProfileStudy");
    const volProfilePreferredLocationInput = document.getElementById(
      "volProfilePreferredLocation"
    );

    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userPhoneNumber = localStorage.getItem("userPhoneNumber");
    const userAddress = localStorage.getItem("userAddress");
    const userGender = localStorage.getItem("userGender");
    const userDob = localStorage.getItem("userDob");
    const userStudyOccupation = localStorage.getItem("userStudyOccupation");
    const userPreferredLocation = localStorage.getItem("userPreferredLocation");

    if (volProfileNameInput) volProfileNameInput.value = userName || "";
    if (volProfileEmailInput) volProfileEmailInput.value = userEmail || "";
    if (volProfilePhoneInput)
      volProfilePhoneInput.value = userPhoneNumber || "";
    if (volProfileAddressInput)
      volProfileAddressInput.value = userAddress || "";
    if (volProfileGenderSelect) volProfileGenderSelect.value = userGender || "";
    if (volProfileDobInput && userDob)
      volProfileDobInput.value = userDob.split("T")[0] || "";
    if (volProfileStudyInput)
      volProfileStudyInput.value = userStudyOccupation || "";
    if (volProfilePreferredLocationInput)
      volProfilePreferredLocationInput.value = userPreferredLocation || "";
  }

  // --- Profile update handler ---
  if (volunteerProfileForm) {
    volunteerProfileForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const updatedData = {
        name: volProfileNameInput.value,
        phoneNumber: volProfilePhoneInput.value,
        address: volProfileAddressInput.value,
        gender: volProfileGenderSelect.value,
        dob: volProfileDobInput.value,
        studyOccupation: volProfileStudyInput.value,
        preferredLocation: volProfilePreferredLocationInput.value,
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
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userPhoneNumber", data.user.phoneNumber);
          localStorage.setItem("userAddress", data.user.address);
          localStorage.setItem("userGender", data.user.gender);
          localStorage.setItem("userDob", data.user.dob);
          localStorage.setItem(
            "userStudyOccupation",
            data.user.studyOccupation
          );
          localStorage.setItem(
            "userPreferredLocation",
            data.user.preferredLocation
          );
          loadVolunteerProfile();
        } else {
          alert(`Failed to update profile: ${data.message || "Server error"}`);
        }
      } catch (error) {
        console.error("Error updating volunteer profile:", error);
        alert("An error occurred while updating profile.");
      }
    });
  }

  // --- Logout handler ---
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userPhoneNumber");
      localStorage.removeItem("userAddress");
      localStorage.removeItem("userGender");
      localStorage.removeItem("userDob");
      localStorage.removeItem("userStudyOccupation");
      localStorage.removeItem("userPreferredLocation");
      alert("You have been logged out.");
      window.location.href = "/";
    });
  }

  // --- Navigation Event Listeners (Updated to scroll) ---
  if (navAvailableBtn) {
    navAvailableBtn.addEventListener("click", () => {
      if (availableSection) {
        availableSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      fetchAvailableDonations(); // Refresh data when scrolled to
    });
  }

  if (navAssignedBtn) {
    navAssignedBtn.addEventListener("click", () => {
      if (assignedSection) {
        assignedSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      fetchAssignedPickups(); // Refresh data when scrolled to
    });
  }

  if (navImpactBtn) {
    navImpactBtn.addEventListener("click", () => {
      if (impactSection) {
        impactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      fetchImpactSummary(); // Refresh data when scrolled to
    });
  }

  if (navProfileBtn) {
    navProfileBtn.addEventListener("click", () => {
      if (profileSection) {
        profileSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      loadVolunteerProfile(); // Refresh profile data when scrolled to
    });
  }

  // --- Initial Data Fetching on Page Load ---
  // All sections are visible, so we just fetch data for the relevant ones.
  fetchAvailableDonations();
  fetchAssignedPickups();
  fetchImpactSummary(); // Call this to populate impact on load
  loadVolunteerProfile(); // Call this to populate profile on load
});
