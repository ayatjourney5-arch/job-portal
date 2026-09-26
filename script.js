/* =========================================================
   JOBIFY - JOB PORTAL JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // ================= ELEMENTS =================

    const searchInput = document.getElementById("searchInput");
    const locationInput = document.getElementById("locationInput");
    const searchBtn = document.getElementById("searchBtn");

    const jobsContainer = document.getElementById("jobsContainer");
    const resultText = document.getElementById("resultText");

    const categoryFilter = document.getElementById("categoryFilter");
    const clearFilters = document.getElementById("clearFilters");
    const sortJobs = document.getElementById("sortJobs");

    const modal = document.getElementById("jobModal");
    const closeModal = document.getElementById("closeModal");

    const modalTitle = document.getElementById("modalTitle");
    const modalCompany = document.getElementById("modalCompany");
    const modalLocation = document.getElementById("modalLocation");
    const modalType = document.getElementById("modalType");
    const modalDescription = document.getElementById("modalDescription");
    const modalLogo = document.getElementById("modalLogo");

    const applyBtn = document.getElementById("applyBtn");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");


    // ================= MOBILE MENU =================

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
        });
    });


    // ================= GET JOBS =================

    function getJobs() {
        return Array.from(document.querySelectorAll(".job-card"));
    }


    // ================= SEARCH + FILTER =================

    function filterJobs() {

        const searchTerm = searchInput.value.toLowerCase().trim();
        const locationTerm = locationInput.value.toLowerCase().trim();

        const selectedTypes = Array.from(
            document.querySelectorAll(".job-type:checked")
        ).map(input => input.value);

        const selectedExperience = Array.from(
            document.querySelectorAll(".experience:checked")
        ).map(input => input.value);

        const selectedCategory = categoryFilter.value;

        let visibleJobs = [];

        getJobs().forEach(job => {

            const title = job.dataset.title.toLowerCase();
            const company = job.dataset.company.toLowerCase();
            const location = job.dataset.location.toLowerCase();
            const type = job.dataset.type;
            const experience = job.dataset.experience;
            const category = job.dataset.category;

            const matchesSearch =
                searchTerm === "" ||
                title.includes(searchTerm) ||
                company.includes(searchTerm) ||
                category.toLowerCase().includes(searchTerm);

            const matchesLocation =
                locationTerm === "" ||
                location.includes(locationTerm);

            const matchesType =
                selectedTypes.length === 0 ||
                selectedTypes.includes(type);

            const matchesExperience =
                selectedExperience.length === 0 ||
                selectedExperience.includes(experience);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            if (
                matchesSearch &&
                matchesLocation &&
                matchesType &&
                matchesExperience &&
                matchesCategory
            ) {
                job.style.display = "flex";
                visibleJobs.push(job);
            } else {
                job.style.display = "none";
            }
        });


        // Update results count

        if (visibleJobs.length === 0) {

            resultText.textContent = "No jobs found";

            if (!document.querySelector(".no-results")) {

                const noResults = document.createElement("div");

                noResults.className = "no-results";

                noResults.innerHTML = `
                    <h3>No jobs found</h3>
                    <p>Try changing your search or filters.</p>
                `;

                jobsContainer.appendChild(noResults);
            }

        } else {

            resultText.textContent =
                `Showing ${visibleJobs.length} available job${visibleJobs.length !== 1 ? "s" : ""}`;

            const noResults = document.querySelector(".no-results");

            if (noResults) {
                noResults.remove();
            }
        }

    }


    // ================= SEARCH BUTTON =================

    searchBtn.addEventListener("click", () => {

        filterJobs();

        document.getElementById("jobs").scrollIntoView({
            behavior: "smooth"
        });

    });


    // ================= ENTER KEY SEARCH =================

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            searchBtn.click();
        }

    });


    locationInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            searchBtn.click();
        }

    });


    // ================= REAL-TIME SEARCH =================

    searchInput.addEventListener("input", filterJobs);

    locationInput.addEventListener("input", filterJobs);


    // ================= FILTER EVENTS =================

    document.querySelectorAll(".job-type").forEach(input => {
        input.addEventListener("change", filterJobs);
    });

    document.querySelectorAll(".experience").forEach(input => {
        input.addEventListener("change", filterJobs);
    });

    categoryFilter.addEventListener("change", filterJobs);


    // ================= CLEAR FILTERS =================

    clearFilters.addEventListener("click", () => {

        searchInput.value = "";
        locationInput.value = "";

        document.querySelectorAll(
            ".job-type, .experience"
        ).forEach(input => {
            input.checked = false;
        });

        categoryFilter.value = "all";

        filterJobs();

        showToast("Filters cleared");

    });


    // ================= SORT JOBS =================

    sortJobs.addEventListener("change", () => {

        const jobs = getJobs();

        if (sortJobs.value === "salary") {

            jobs.sort((a, b) => {

                return (
                    Number(b.dataset.salary) -
                    Number(a.dataset.salary)
                );

            });

        } else {

            const order = {
                "1": 1,
                "2": 2,
                "3": 3,
                "4": 4,
                "5": 5,
                "6": 6,
                "7": 7,
                "8": 8
            };

            jobs.sort((a, b) => {

                return (
                    (order[a.dataset.salary] || 0) -
                    (order[b.dataset.salary] || 0)
                );

            });
        }

        jobs.forEach(job => {
            jobsContainer.appendChild(job);
        });

        filterJobs();

    });


    // ================= POPULAR SEARCHES =================

    document.querySelectorAll(".popular-searches button")
        .forEach(button => {

            button.addEventListener("click", () => {

                searchInput.value =
                    button.dataset.search;

                locationInput.value = "";

                filterJobs();

                document.getElementById("jobs").scrollIntoView({
                    behavior: "smooth"
                });

            });

        });


    // ================= SAVE JOB =================

    document.querySelectorAll(".save-btn").forEach(button => {

        button.addEventListener("click", () => {

            button.classList.toggle("saved");

            if (button.classList.contains("saved")) {

                button.innerHTML = "♥";

                showToast("Job saved successfully");

            } else {

                button.innerHTML = "♡";

                showToast("Job removed from saved jobs");

            }

        });

    });


    // ================= OPEN JOB DETAILS =================

    document.querySelectorAll(".details-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const job = button.closest(".job-card");

                modalTitle.textContent =
                    job.dataset.title;

                modalCompany.textContent =
                    job.dataset.company;

                modalLocation.textContent =
                    "⌖ " + job.dataset.location;

                modalType.textContent =
                    "● " + job.dataset.type;

                modalDescription.textContent =
                    job.dataset.description;

                modalLogo.textContent =
                    job.dataset.company.charAt(0);

                modal.classList.add("show");

                document.body.style.overflow = "hidden";

            });

        });


    // ================= CLOSE MODAL =================

    closeModal.addEventListener("click", closeJobModal);

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closeJobModal();
        }

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeJobModal();
        }

    });


    function closeJobModal() {

        modal.classList.remove("show");

        document.body.style.overflow = "";

    }


    // ================= APPLY BUTTON =================

    applyBtn.addEventListener("click", () => {

        const title = modalTitle.textContent;

        showToast(`Application started for ${title}`);

        setTimeout(() => {
            closeJobModal();
        }, 1000);

    });


    // ================= POST JOB BUTTONS =================

    document.querySelectorAll(
        ".post-job-btn, .cta-btn"
    ).forEach(button => {

        button.addEventListener("click", () => {

            showToast("Job posting feature coming soon!");

        });

    });


    // ================= SIGN IN =================

    document.querySelector(".login-btn")
        .addEventListener("click", () => {

            showToast("Sign in feature coming soon!");

        });


    // ================= TOAST =================

    function showToast(message) {

        toastMessage.textContent = message;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }


    // ================= INITIAL LOAD =================

    filterJobs();

});
