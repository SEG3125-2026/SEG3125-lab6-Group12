let currentPage = 1;
const totalPages = 5;

function updateHeroForPage(page) {
  const defaultHero = document.getElementById('defaultHero');
  const questionPageHero = document.getElementById('questionPageHero');
  if (!defaultHero || !questionPageHero) return;

  if (page === 5) {
    defaultHero.classList.add('d-none');
    questionPageHero.classList.remove('d-none');
  } else {
    defaultHero.classList.remove('d-none');
    questionPageHero.classList.add('d-none');
  }
}

function showPage(page) {
  for (let i = 1; i <= totalPages; i++) {
    const elements = document.querySelectorAll('.page' + i);
    elements.forEach((el) => {
      el.style.display = 'none';
    });
  }

  const currentElements = document.querySelectorAll('.page' + page);
  currentElements.forEach((el) => {
    el.style.display = 'block';
  });

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

  updateHeroForPage(page);
}

function validateCurrentPage() {
  const visiblePageFields = Array.from(document.querySelectorAll(`.page${currentPage} input, .page${currentPage} textarea, .page${currentPage} select`));
  for (const field of visiblePageFields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }
  return true;
}

function changePage(step) {
  if (step > 0 && !validateCurrentPage()) {
    return;
  }

  currentPage += step;
  if (currentPage > totalPages) currentPage = totalPages;

  showPage(currentPage);
  document.getElementById('myform').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function submitSurvey(event) {
  event.preventDefault();

  const form = document.getElementById('myform');
  const submitButton = document.getElementById('submitButton');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';

  try {
    const formData = new FormData(form);
    const body = new URLSearchParams(formData);

    const response = await fetch('/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    if (!response.ok) {
      throw new Error('Was unable to submit survey');
    }

    alert('Survey submitted! Thank you for your feedback.');
    form.reset();
    currentPage = 1;
    showPage(currentPage);
    submitButton.disabled = false;
    submitButton.textContent = 'Submit your Questionnaire';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit your Questionnaire';
    alert(error.message);
  }
}

showPage(currentPage);
document.getElementById('myform').addEventListener('submit', submitSurvey);

document.querySelectorAll('.hero-image-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const title = trigger.dataset.title || 'Survey Image';
    const src = trigger.dataset.src;
    const alt = trigger.dataset.alt || title;
    const url = trigger.dataset.url || 'https://www.uottawa.ca/en';
    const modalLabel = document.getElementById('imageModalLabel');
    const modalImage = document.getElementById('modalImage');
    const modalVisitLink = document.getElementById('modalVisitLink');
    if (modalLabel) modalLabel.textContent = title;
    if (modalImage && src) {
      modalImage.src = src;
      modalImage.alt = alt;
    }
    if (modalVisitLink) {
      modalVisitLink.href = url;
    }
  });
});
