/* =========================================
   VARIABLES
========================================= */

const areasList = document.getElementById("areasList");

const pharmaciesGrid =
    document.getElementById("pharmaciesGrid");

const pharmacySearch =
    document.getElementById("pharmacySearch");

const areaSearch =
    document.getElementById("areaSearch");

const clearSearch =
    document.getElementById("clearSearch");

const pharmacyCount =
    document.getElementById("pharmacyCount");

const emptyState =
    document.getElementById("emptyState");

const resultsDescription =
    document.getElementById("resultsDescription");


let selectedArea = "all";

let selectedDuty = "all";

let searchText = "";


/* =========================================
   AREAS
========================================= */

const areas = [
    "الجميلية",
    "الشعار",
    "الميدان",
    "السليمانية",
    "الشيخ طه",
    "العمري",
    "الفردوس",
    "الهلك",
    "العباسية",
    "الجيزرية",
    "سليمان الحلبي",
    "الميريديان",
    "حلب الجديدة",
    "الفرقان",
    "السكري",
    "صلاح الدين",
    "المشارقة",
    "الصاخور",
    "الحمدانية",
    "الراموسة",
    "الأنصاري",
    "الزبدية",
    "الكلاسة",
    "بستان القصر",
    "الإذاعة",
    "الزهراء",
    "جمعية الزهراء",
    "الموكامبو",
    "شارع النيل",
    "الأعظمية"
];


/* =========================================
   RENDER AREAS
========================================= */

function renderAreas(search = "") {

    areasList.innerHTML = "";

    const filteredAreas = areas.filter(area =>
        area.includes(search)
    );

    const allButton = document.createElement("button");

    allButton.className =
        "area-button " +
        (selectedArea === "all" ? "active" : "");

    allButton.textContent = "جميع الأحياء";

    allButton.addEventListener("click", () => {

        selectedArea = "all";

        renderAreas(areaSearch.value);

        renderPharmacies();

    });

    areasList.appendChild(allButton);


    filteredAreas.forEach(area => {

        const button =
            document.createElement("button");

        button.className =
            "area-button " +
            (selectedArea === area ? "active" : "");

        button.textContent = area;

        button.addEventListener("click", () => {

            selectedArea = area;

            renderAreas(areaSearch.value);

            renderPharmacies();

        });

        areasList.appendChild(button);

    });

}


/* =========================================
   FILTER PHARMACIES
========================================= */

function getFilteredPharmacies() {

    return pharmacies.filter(pharmacy => {

        const matchesArea =
            selectedArea === "all" ||
            pharmacy.area === selectedArea;


        const matchesDuty =
            selectedDuty === "all" ||
            pharmacy.duty === selectedDuty;


        const text =
            `${pharmacy.name}
            ${pharmacy.area}
            ${pharmacy.address}`.toLowerCase();


        const matchesSearch =
            text.includes(searchText.toLowerCase());


        return (
            matchesArea &&
            matchesDuty &&
            matchesSearch
        );

    });

}


/* =========================================
   RENDER PHARMACIES
========================================= */

function renderPharmacies() {

    const filtered =
        getFilteredPharmacies();

    pharmaciesGrid.innerHTML = "";

    pharmacyCount.textContent =
        filtered.length;


    if (selectedArea === "all") {

        resultsDescription.textContent =
            "الصيدليات المناوبة حالياً";

    } else {

        resultsDescription.textContent =
            `الصيدليات المناوبة في حي ${selectedArea}`;

    }


    if (filtered.length === 0) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    filtered.forEach(pharmacy => {

        const card =
            document.createElement("article");

        card.className =
            "pharmacy-card";


        const dutyText =
            pharmacy.duty === "24"
                ? "24 ساعة"
                : "حتى 1:30 ليلاً";


        const dutyClass =
            pharmacy.duty === "24"
                ? "status-24"
                : "status-0130";


        let mapLink = "#";


        if (
            pharmacy.lat &&
            pharmacy.lng
        ) {

            mapLink =
                `https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}`;

        }


        let phoneButton = "";


        if (pharmacy.phone) {

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
                        ${pharmacy.name}
                    </h3>

                    <div class="area-name">
                        ${pharmacy.area}
                    </div>

                </div>

                <span class="status ${dutyClass}">
                    ${dutyText}
                </span>

            </div>


            <div class="pharmacy-address">
                ${pharmacy.address}
            </div>


            <div class="pharmacy-actions">

                <a
                    class="action-button location-button"
                    href="${mapLink}"
                    target="_blank"
                >
                    الموقع على الخريطة
                </a>

                ${phoneButton}

            </div>

        `;


        pharmaciesGrid.appendChild(card);

    });

}


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
   AREA SEARCH
========================================= */

areaSearch.addEventListener(
    "input",
    event => {

        renderAreas(
            event.target.value.trim()
        );

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
   DUTY FILTER
========================================= */

document
    .querySelectorAll(".filter-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-button"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                selectedDuty =
                    button.dataset.duty;


                renderPharmacies();

            }
        );

    });


/* =========================================
   INITIALIZE
========================================= */

renderAreas();

renderPharmacies();
