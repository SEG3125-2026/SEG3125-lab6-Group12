let currentPage = 1;
const totalPages = 5;
// TODO: add validation to prevent going to next page if required questions are not answered

function showPage(page) {
    for (let i = 1; i <= totalPages; i++) {
        const elements = document.querySelectorAll('.page' + i);
        elements.forEach(el => el.style.display = 'none');
    }
    const currentElements = document.querySelectorAll('.page' + page);
    currentElements.forEach(el => el.style.display = 'block');

    const progressBar = document.getElementById('surveyProgressBar');
    if (progressBar) {
        const percentage = (page / totalPages) * 100;
        progressBar.style.width = percentage + '%';
        progressBar.setAttribute('aria-valuenow', page);
        progressBar.textContent = `Page ${page} of ${totalPages}`;
    }

    if (page === totalPages) {
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('submitButton').style.display = 'inline-block';
    } else {
        document.getElementById('nextBtn').style.display = 'inline-block';
        document.getElementById('submitButton').style.display = 'none';
    }
}

function changePage(step) {
    currentPage += step;
    if (currentPage > totalPages) currentPage = totalPages;
    
    showPage(currentPage);
    document.getElementById('myform').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
showPage(currentPage);