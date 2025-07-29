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
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
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
      window.location.href = "/"; // Redirect to login page
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
