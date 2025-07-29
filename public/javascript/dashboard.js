document.addEventListener("DOMContentLoaded", () => {
  // DOM elements for the dashboard
  const navDashboardBtn = document.getElementById("nav-dashboard-btn");
  const dashboardSection = document.getElementById("dashboard-section");
  const totalFoodSavedKgSpan = document.getElementById("totalFoodSavedKg");
  const donorsListUl = document.getElementById("donorsList");

  // Other navigation buttons (assuming they exist and need similar display logic)
  const navAboutUsBtn = document.getElementById("nav-aboutUs-btn");
  const homeSection = document.getElementById("home-section");
  const aboutSection = document.getElementById("about-section");

  // Function to show a specific section and hide others
  function showSection(sectionToShow) {
    [homeSection, aboutSection, dashboardSection].forEach((section) => {
      if (section) {
        section.style.display = "none";
      }
    });
    if (sectionToShow) {
      sectionToShow.style.display = "block";
    }
  }
  // --- Functions to fetch and update dashboard data ---

  async function fetchTotalFoodSaved() {
    try {
      const response = await fetch("/api/donations/total-food-saved");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (totalFoodSavedKgSpan) {
        totalFoodSavedKgSpan.textContent = data.totalFoodSavedKg || 0;
      }
    } catch (error) {
      console.error("Error fetching total food saved:", error);
      if (totalFoodSavedKgSpan) {
        totalFoodSavedKgSpan.textContent = "Error";
      }
    }
  }

  async function fetchDonorsSummary() {
    try {
      const response = await fetch("/api/donations/donors-summary");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (donorsListUl) {
        donorsListUl.innerHTML = ""; // Clear previous list
        if (data.donors && data.donors.length > 0) {
          data.donors.forEach((donor) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${donor.name} (${
              donor.organization || "N/A"
            }): ${donor.totalDonatedQuantity} kg`;
            donorsListUl.appendChild(listItem);
          });
        } else {
          const listItem = document.createElement("li");
          listItem.textContent = "No donors found yet.";
          donorsListUl.appendChild(listItem);
        }
      }
    } catch (error) {
      console.error("Error fetching donors summary:", error);
      if (donorsListUl) {
        donorsListUl.innerHTML = "<li>Error loading donors.</li>";
      }
    }
  }

  // --- Event Listeners ---

  // Handle Dashboard button click
  if (navDashboardBtn) {
    navDashboardBtn.addEventListener("click", () => {
      showSection(dashboardSection);
      fetchTotalFoodSaved(); // Fetch and update data when dashboard is shown
      fetchDonorsSummary(); // Fetch and update data when dashboard is shown
    });
  }

  // Handle About Us button click (from your inline script, moved here for consistency)
  if (navAboutUsBtn) {
    navAboutUsBtn.addEventListener("click", function () {
      showSection(aboutSection);
      aboutSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Initial setup: Show home section by default
  // You might want to remove the inline script for nav-aboutUs-btn and nav-dashboard-btn
  // from index.html if you are handling all navigation via public/index.js
  showSection(homeSection);

  // You might also want to call these once on page load for the initial dashboard view
  // if the dashboard is the default visible section, or if you want to preload data.
  // Example:
  // fetchTotalFoodSaved();
  // fetchDonorsSummary();
  document.querySelectorAll("[data-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = document.getElementById(btn.dataset.target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
