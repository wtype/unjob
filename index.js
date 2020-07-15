(() => {
  console.clear();

  const seenJobs = new Set();
  let passes = 0;

  const currentPageIsValid = () => {
    return (
      window.location.hostname === 'www.linkedin.com' &&
      window.location.pathname === '/jobs/search/'
    );
  };

  function removeDupeJobs() {
    if (!currentPageIsValid()) {
      clearInterval(removeDupesInterval);
      return;
    }

    console.log('%c Checking for duplicates ', 'background:#fcb271;color:#1a1a1a');

    const jobCards = document.querySelectorAll('.job-card-container');

    jobCards.forEach(job => {
      try {
        const companyName = job.querySelector('.job-card-container__company-name').innerText;
        const jobTitle = job.querySelector('.job-card-list__title').innerText;
        const jobReference = `${companyName}—${jobTitle}`;

        if (seenJobs.has(jobReference)) {
          if (job.dataset.firstOfKind) return;
          console.log('%c Removing ', 'background:#fc8f7e;color:#1a1a1a', jobReference);
          job.remove();
        } else {
          seenJobs.add(jobReference);
          job.dataset.firstOfKind = true;
          job.querySelector('.job-card-list__title').style.color = '#ff8661';
          job.style.background = 'rgba(255, 212, 160, 0.2)';
          job.style.boxShadow = '0px 0px 0px 1.5px rgba(255, 156, 95, 0.2)';
        }

        if (passes && passes % 25 === 0) {
          console.clear();
          console.log('%c NON-DUPLICATE JOBS ', 'background:#9ffc7e;color:#1a1a1a', `TOTAL: ${seenJobs.size}`);
          console.table(seenJobs);
        }

        passes += 1;
      } catch (error) {
        return;
      }
    });
  }

  window.onload = removeDupeJobs();

  const removeDupesInterval = setInterval(removeDupeJobs, 1500);
})();