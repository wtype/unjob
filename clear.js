const seenJobs = {};
const runningInterval = 1500;
let currentPage = window.location.search;
let passes = 0;

const isSamePage = () => currentPage === window.location.search;

function removeDuplicates() {
  if (passes === 6 && isSamePage) {
    console.log('%c Stopping interval ', 'background:tomato;color:black');
    clearInterval(removeDuplicatesInterval);
    passes = 0;

    console.clear();
    console.table(seenJobs);
    return;
  }

  const jobCards = document.querySelectorAll('.job-card-container');

  jobCards.forEach(job => {
    const companyName = job.querySelector('.job-card-container__company-name').innerText;
    const jobTitle = job.querySelector('.job-card-list__title').innerText;
    const jobId = job.dataset.jobId.slice(-10);
    const jobReference = `${companyName}—${jobTitle}`;

    if (jobReference in seenJobs) {
      if (seenJobs[jobReference] === jobId) {
        return;
      } else {
        console.log('%c Removing ', 'background:salmon;color:black', jobReference);
        job.remove();
      }
    } else {
      seenJobs[jobReference] = jobId;
    }
  });

  passes += 1;
}

let removeDuplicatesInterval = setInterval(removeDuplicates, runningInterval);

window.addEventListener('click', () => {
  if (!isSamePage()) {
    removeDuplicatesInterval = setInterval(removeDuplicates, runningInterval);
    currentPage = window.location.search;
  }
});
