async function loadPartial(section) {
  try {
    const response = await fetch(`/manager/load-partial/${section}`);
    if (!response.ok) throw new Error("Failed to load section");

    const { success, html, counts } = await response.json();

    if (!success) throw new Error("Failed to retrieve section data");

    const sections = {
      approved: document.getElementById("approved-section"),
      pending: document.getElementById("pending-section"),
      disapproved: document.getElementById("disapproved-section"),
    };

    //java script of content
    if (sections[section]) {
      sections[section].innerHTML = html;
    }

    updateCounts(counts);
    await buttonListener();
  } catch (error) {
    console.error("Error loading partial:", error);
  }
}

function updateCounts(counts) {
  document.querySelector(".approved-count").textContent = counts.approved || 0;
  document.querySelector(".pending-count").textContent = counts.pending || 0;
  document.querySelector(".disapproved-count").textContent =
    counts.disapproved || 0;
}

async function buttonListener() {
  const container = document.querySelector(".container");
  container.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      let action = this.classList.contains("approve-btn")
        ? "approve"
        : this.classList.contains("disapprove-btn")
        ? "disapprove"
        : this.classList.contains("remove-btn")
        ? "remove"
        : null;

      if (!action) return;

      const productId = this.getAttribute("data-id");

      try {
        const response = await fetch(
          `/manager/content-moderation?action=${action}&productId=${productId}`,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );

        const result = await response.json();

        if (!result.success) {
          throw new Error(`Failed to ${action} the product`);
        }

        let sectionToReload;
        if (action === "approve") {
          sectionToReload = "pending";
        } else if (action === "disapprove") {
          sectionToReload = "pending";
        } else if (
          action === "remove" &&
          this.classList.contains("approve-side")
        ) {
          sectionToReload = "approved";
        } else {
          sectionToReload = "disapproved";
        }

        await loadPartial(sectionToReload);
      } catch (error) {
        console.error(error);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const tabs = document.querySelectorAll(".tab");

  await loadPartial("pending");

  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      const tabId = tab.id.replace("tab-", "");
      await loadPartial(tabId);
      switchTab(tabId);
    });
  });

  function switchTab(activeTab) {
    tabs.forEach((t) => t.classList.remove("active"));

    const sections = {
      approved: document.getElementById("approved-section"),
      pending: document.getElementById("pending-section"),
      disapproved: document.getElementById("disapproved-section"),
    };

    Object.values(sections).forEach((s) => s.classList.add("hidden"));

    document.getElementById(`tab-${activeTab}`).classList.add("active");
    sections[activeTab].classList.remove("hidden");
  }
});
