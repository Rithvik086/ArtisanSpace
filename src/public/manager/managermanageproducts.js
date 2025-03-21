async function loadPartial(section) {
  try {
    const response = await fetch(`/manager/load-partial/${section}`);
    if (!response) throw new Error("Failed to load section");
    const sections = {
      approved: document.getElementById("approved-section"),
      pending: document.getElementById("pending-section"),
      disapproved: document.getElementById("disapproved-section"),
    };
    sections[section].innerHTML = await response.text();

    await buttonListener();
  } catch (error) {
    console.error("Error loading partial:", error);
  }
}

async function buttonListener() {
  const container = document.querySelector(".container");
  container.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const action = this.classList.contains("approve-btn")
        ? "approve"
        : "disapprove";
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
        if (!response) throw new Error(`Failed to ${action} the product`);

        await loadPartial("pending");
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
