const modal = document.getElementById("noInternetModal");

function checkInternet() {
    if (!navigator.onLine) {
        modal.classList.add("show");
    } else {
        modal.classList.remove("show");
    }
}

checkInternet();

window.addEventListener("offline", () => {
    modal.classList.add("show");
});

window.addEventListener("online", () => {
    modal.classList.remove("show");
});