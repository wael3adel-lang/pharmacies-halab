/* =========================================
   PHARMACIES - HALAB
   Main Application
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const neighborhoodToggle =
        document.getElementById("neighborhoodToggle");

    const neighborhoodDropdown =
        document.getElementById("neighborhoodDropdown");

    const selectedNeighborhood =
        document.getElementById("selectedNeighborhood");

    const neighborhoodList =
        document.getElementById("neighborhoodList");

    const neighborhoodSearch =
        document.getElementById("neighborhoodSearch");

    const pharmacySearch =
        document.getElementById("pharmacySearch");

    const clearSearch =
        document.getElementById("clearSearch");

    const pharmacyList =
        document.getElementById("pharmacyList");

    const totalPharmacies =
        document.getElementById("totalPharmacies");

    const nightPharmacies =
        document.getElementById("nightPharmacies");

    const allDayPharmacies =
        document.getElementById("allDayPharmacies");

    const resultsCount =
        document.getElementById("resultsCount");

    const noResults =
        document.getElementById("noResults");


    /* =========================================
       DATA CHECK
    ========================================= */

    if (
        typeof pharmacies === "undefined" ||
        !Array.isArray(pharmacies)
    ) {

        console.error(
            "لم يتم العثور على بيانات الصيدليات في data.js"
        );

        if (resultsCount) {
            resultsCount.textContent =
                "تعذر تحميل بيانات الصيدليات";
        }

        return;
    }


    /* =========================================
       STATE
    ========================================= */

    let selectedArea = "all";

    let searchText = "";

    let areaSearchText = "";


    /* =========================================
       GET AREAS FROM DATA
    ========================================= */

    const areas = [
        ...new Set(
            pharmacies
                .map(pharmacy => pharmacy.area)
                .filter(Boolean)
        )
    ];


    /* =========================================
       OPEN / CLOSE NEIGHBORHOODS
    ========================================= */

    neighborhoodToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                neighborhoodDropdown.classList.contains("open");

            if (isOpen) {

                neighborhoodDropdown.classList.remove("open");

            } else {

                neighborhoodDropdown.classList.add("open");

                neighborhoodSearch.focus();

            }

        }
    );


    /* =========================================
       CLOSE WHEN CLICKING OUTSIDE
    ========================================= */

    document.addEventListener(
        "click",
        event => {

            const selector =
                document.getElementById(
                    "neighborhoodSelector"
                );

            if (
                selector &&
                !selector.contains(event.target)
            ) {

                neighborhoodDropdown.classList.remove(
                    "open"
                );

            }

        }
    );


    /* =========================================
       RENDER NEIGHBORHOODS
    ========================================= */

    function renderNeighborhoods() {

        neighborhoodList.innerHTML = "";


        /* جميع الأحياء */

        const allButton =
            document.createElement("button");

        allButton.type = "button";

        allButton.className =
            "neighborhood-option " +
            (selectedArea === "all"
                ? "active"
                : "");

        allButton.textContent =
            "جميع الأحياء";


        allButton.addEventListener(
            "click",
            () => {

                selectedArea = "all";

                selectedNeighborhood.textContent =
                    "جميع الأحياء";

                neighborhoodDropdown.classList.remove(
                    "open"
                );

                renderNeighborhoods();

                renderPharmacies();

            }
        );


        neighborhoodList.appendChild(
            allButton
        );


        /* تصفية الأحياء */

        const filteredAreas =
            areas.filter(area =>
                area.includes(areaSearchText)
            );


        filteredAreas.forEach(area => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "neighborhood-option " +
                (selectedArea === area
                    ? "active"
                    : "");

            button.textContent = area;


            button.addEventListener(
                "click",
                () => {

                    selectedArea = area;

                    selectedNeighborhood.textContent =
                        area;

                    neighborhoodDropdown.classList.remove(
                        "open"
                    );

                    renderNeighborhoods();

                    renderPharmacies();

                }
            );


            neighborhoodList.appendChild(
                button
            );

        });


        /* لا توجد أحياء */

        if (
            filteredAreas.length === 0
        ) {

            const empty =
                document.createElement("div");

            empty.className =
                "neighborhood-empty";

            empty.textContent =
                "لا يوجد حي بهذا الاسم";

            neighborhoodList.appendChild(
                empty
            );

        }

    }


    /* =========================================
       FILTER PHARMACIES
    ========================================= */

    function getFilteredPharmacies() {

        return pharmacies.filter(
            pharmacy => {

                const matchesArea =
                    selectedArea === "all" ||
                    pharmacy.area === selectedArea;


                const text =
                    `${pharmacy.name || ""}
                     ${pharmacy.area || ""}
                     ${pharmacy.address || ""}`
                        .toLowerCase();


                const matchesSearch =
                    text.includes(
                        searchText.toLowerCase()
                    );


                return (
                    matchesArea &&
                    matchesSearch
                );

            }
        );

    }


    /* =========================================
       RENDER PHARMACIES
    ========================================= */

    function renderPharmacies() {

        const filtered =
            getFilteredPharmacies();


        pharmacyList.innerHTML = "";


        /* الإحصائيات */

        totalPharmacies.textContent =
            filtered.length;


        const nightCount =
            filtered.filter(
                pharmacy =>
                    pharmacy.duty !== "24"
            ).length;


        const allDayCount =
            filtered.filter(
                pharmacy =>
                    pharmacy.duty === "24"
            ).length;


        nightPharmacies.textContent =
            nightCount;


        allDayPharmacies.textContent =
            allDayCount;


        /* وصف النتائج */

        if (
            selectedArea === "all"
        ) {

            resultsCount.textContent =
                "الصيدليات المناوبة حالياً";

        } else {

            resultsCount.textContent =
                `الصيدليات المناوبة في حي ${selectedArea}`;

        }


        /* لا توجد نتائج */

        if (
            filtered.length === 0
        ) {

            noResults.style.display =
                "block";

            return;

        }


        noResults.style.display =
            "none";


        /* عرض الصيدليات */

        filtered.forEach(
            pharmacy => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "pharmacy-card";


                /* وقت المناوبة */

                const dutyText =
                    pharmacy.duty === "24"
                        ? "24 ساعة"
                        : "حتى 1:30 ليلاً";


                /* الخريطة */

                let mapLink = "#";


                if (
                    pharmacy.lat &&
                    pharmacy.lng
                ) {

                    mapLink =
                        `https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`;

                }


                /* الهاتف */

                let phoneButton = "";


                if (
                    pharmacy.phone
                ) {

                    phoneButton = `
                        <a
                            class="action-button phone-button"
                            href="tel:${pharmacy.phone}"
                        >
                            اتصال
                        </a>
                    `;

                }


                card.innerHTML = `

                    <div class="pharmacy-top">

                        <div>

                            <h3 class="pharmacy-name">
                                ${pharmacy.name || ""}
                            </h3>

                            <div class="area-name">
                                ${pharmacy.area || ""}
                            </div>

                        </div>

                        <span class="status">
                            ${dutyText}
                        </span>

                    </div>


                    <div class="pharmacy-address">
                        ${pharmacy.address || ""}
                    </div>


                    <div class="pharmacy-actions">

                        <a
                            class="action-button location-button"
                            href="${mapLink}"
                            target="_blank"
                            rel="noopener"
                        >
                            الموقع على الخريطة
                        </a>

                        ${phoneButton}

                    </div>

                `;


                pharmacyList.appendChild(
                    card
                );

            }
        );

    }


    /* =========================================
       NEIGHBORHOOD SEARCH
    ========================================= */

    neighborhoodSearch.addEventListener(
        "input",
        event => {

            areaSearchText =
                event.target.value.trim();

            renderNeighborhoods();

        }
    );


    /* =========================================
       PHARMACY SEARCH
    ========================================= */

    pharmacySearch.addEventListener(
        "input",
        event => {

            searchText =
                event.target.value.trim();

            renderPharmacies();

        }
    );


    /* =========================================
       CLEAR SEARCH
    ========================================= */

    clearSearch.addEventListener(
        "click",
        () => {

            pharmacySearch.value = "";

            searchText = "";

            renderPharmacies();

            pharmacySearch.focus();

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    renderNeighborhoods();

    renderPharmacies();

});
