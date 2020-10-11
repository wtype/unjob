(() => {
  console.clear();
  console.log('%c Searching for duplicates... ', 'background:#8b83fc;color:black');

  const seenJobs = {};
  const runningInterval = 1500;
  let currentPage = window.location.search;
  let jobListSize = 0;
  let passes = 0;

  const isSamePage = () => currentPage === window.location.search;

  const currentPageIsValid = () => {
    return (
      window.location.hostname === 'www.linkedin.com' &&
      window.location.pathname === '/jobs/search/'
    );
  };

  function removeDuplicates() {
    if (passes === 6 && isSamePage() || !currentPageIsValid()) {
      clearInterval(removeDuplicatesInterval);
      passes = 0;

      console.clear();
      console.log('%c Pausing search ', 'background:#62fcf7;color:black');
      console.log('%c NON-DUPLICATE JOBS ', 'background:#9ffc7e;color:#1a1a1a;font-size:2rem', `TOTAL: ${jobListSize}`);
      console.table(seenJobs);
      return;
    }

    const jobCards = document.querySelectorAll('.job-card-container');

    jobCards.forEach(job => {
      try {
        const companyName = job.querySelector('.job-card-container__company-name').innerText;
        const jobTitle = job.querySelector('.job-card-list__title').innerText;
        const jobId = job.dataset.jobId.slice(-10);
        const jobReference = `${companyName}—${jobTitle}`;

        if (jobReference in seenJobs) {
          if (seenJobs[jobReference] === jobId) {
            job.querySelector('.job-card-list__title').style.color = '#fc4955';
            job.style.background = 'rgba(255, 125, 102, 0.1)';
            job.style.boxShadow = '0px 0px 0px 1.5px rgba(252, 148, 191, 0.2)';
            return;
          } else {
            console.log('%c Removing ', 'background:salmon;color:black', jobReference);
            job.remove();
          }
        } else {
          console.log('%c Adding ', 'background:#8efc62;color:black', jobReference);
          seenJobs[jobReference] = jobId;
          jobListSize += 1;
        }
      } catch (error) {
        return;
      }
    });

    passes += 1;
  }

  let removeDuplicatesInterval = setInterval(removeDuplicates, runningInterval);

  window.addEventListener('click', () => {
    if (!isSamePage() && currentPageIsValid()) {
      removeDuplicatesInterval = setInterval(removeDuplicates, runningInterval);
      currentPage = window.location.search;
    }
  });
})();

function autoTurnPages(value, interval = 2.5) {
  if (!value || typeof value !== 'boolean') return;

  setInterval(() => {
    const page = document.querySelector('.active');
    const nextPage = page.nextElementSibling.querySelector('button');

    if (nextPage) {
      nextPage.click();
    } else {
      return;
    }
  }, interval * 10000);
}