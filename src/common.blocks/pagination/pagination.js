function setTableCaption(currentPage, tableCaption) {
    const page = parseInt(currentPage.innerText);
    tableCaption.innerText = (12 * (page - 1)) + 1 + " - " + (12 * page) + " из 100+ вариантов аренды";
}

document.addEventListener("DOMContentLoaded", function () {
    const paginationForm = document.body.querySelector(".pagination");
    const forwardButton = paginationForm.querySelector(".pagination__button-forward"); 
    const tableCaption = paginationForm.children[1];
    const items = [paginationForm.children[0].children[0].children[0], 
    paginationForm.children[0].children[0].children[1],
    paginationForm.children[0].children[0].children[2],
    paginationForm.children[0].children[0].children[3],
    paginationForm.children[0].children[0].children[4]];
    let currentPage = paginationForm.querySelector(".pagination__current"); 
    
    forwardButton.addEventListener("mouseup", function () {
        if (items[3].isSameNode(currentPage)) {
        currentPage.classList.remove("pagination__current");
        items[4].classList.add("pagination__current");
        currentPage = items[4];
        forwardButton.classList.add("pagination__button_fade");
        }

        if (items[2].isSameNode(currentPage)) {
        const i = parseInt(items[2].innerText);
        switch (true) {
            case (i < 12): 
            items[0].innerText = items[1].innerText;
            items[1].innerText = items[2].innerText;
            items[2].innerText = parseInt(items[2].innerText) + 1;
            break;
            case (i === 12):
            items[0].innerText = items[1].innerText;
            items[1].innerText = items[2].innerText;
            items[2].innerText = parseInt(items[2].innerText) + 1;
            items[3].innerText = parseInt(items[2].innerText) + 1;
            break;
            default:
            currentPage.classList.remove("pagination__current");
            items[3].classList.add("pagination__current");
            currentPage = items[3];
            break;
        }
        } 

        if (items[1].isSameNode(currentPage)) {
        console.log("nope 2");
        currentPage.classList.remove("pagination__current");
        items[2].classList.add("pagination__current");
        currentPage = items[2];
        }

        if (items[0].isSameNode(currentPage)) {
        console.log("nope 1");
        currentPage.classList.remove("pagination__current");
        items[1].classList.add("pagination__current");
        currentPage = items[1];
        }

        setTableCaption(currentPage, tableCaption);
    }); 

    items[0].addEventListener("mouseup", function () {
        if (!this.classList.contains("pagination__current")) {
        switch (parseInt(this.innerText)) {
            case 1:
            currentPage.classList.remove("pagination__current");
            this.classList.add("pagination__current");
            currentPage = this;
            break;
            case 2:
            items[0].innerText = 1;
            items[1].innerText = 2;
            items[2].innerText = 3;
            currentPage.classList.remove("pagination__current");
            items[1].classList.add("pagination__current");
            currentPage = items[1];
            break;
            case 11:
            items[0].innerText = 9;
            items[1].innerText = 10;
            items[2].innerText = 11;
            items[3].innerText = "...";
            currentPage.classList.remove("pagination__current");
            items[2].classList.add("pagination__current");
            currentPage = items[2];
            forwardButton.classList.remove("pagination__button_fade");
            break;
            default: 
            items[2].innerText = items[0].innerText;
            items[1].innerText = parseInt(items[0].innerText)-1;
            items[0].innerText = parseInt(items[1].innerText)-1;
            currentPage.classList.remove("pagination__current");
            items[2].classList.add("pagination__current");
            currentPage = items[2];
            break;
        }
        }

        setTableCaption(currentPage, tableCaption);
    });

    items[1].addEventListener("mouseup", function () {
        if (!this.classList.contains("pagination__current")) {
        currentPage.classList.remove("pagination__current");
        this.classList.add("pagination__current");
        currentPage = this;
        }

        setTableCaption(currentPage, tableCaption);
    });

    items[2].addEventListener("mouseup", function () {
        if (!this.classList.contains("pagination__current")) {
        switch (parseInt(this.innerText)) {
            case 13: 
            currentPage.classList.remove("pagination__current");
            items[2].classList.add("pagination__current");
            currentPage = items[2];
            break;
            case 12:
            items[0].innerText = items[1].innerText;
            items[1].innerText = items[2].innerText;
            items[2].innerText = parseInt(items[2].innerText) + 1;
            items[3].innerText = parseInt(items[2].innerText) + 1;
            currentPage.classList.remove("pagination__current");
            items[1].classList.add("pagination__current");
            currentPage = items[1];
            break;
            default:
            items[0].innerText = items[1].innerText;
            items[1].innerText = items[2].innerText;
            items[2].innerText = parseInt(items[2].innerText) + 1;
            currentPage.classList.remove("pagination__current");
            items[1].classList.add("pagination__current");
            currentPage = items[1];
            break;
        }
        }

        setTableCaption(currentPage, tableCaption);
    });

    items[3].addEventListener("mouseup", function () {
        if (!this.classList.contains("pagination__current")) {
        if (parseInt(this.innerText) === 14) {
            currentPage.classList.remove("pagination__current");
            items[3].classList.add("pagination__current");
            currentPage = items[3];
        }
        }

        setTableCaption(currentPage, tableCaption);
    });

    items[4].addEventListener("mouseup", function () {
        if (!this.classList.contains("pagination__current")) {
        items[0].innerText = 11;
        items[1].innerText = 12;
        items[2].innerText = 13;
        items[3].innerText = 14;
        currentPage.classList.remove("pagination__current");
        items[4].classList.add("pagination__current");
        currentPage = items[4];
        forwardButton.classList.add("pagination__button_fade");
        }

        setTableCaption(currentPage, tableCaption);
    });
});
