# LinkedIn Duplicate Job Remover

Ever been looking through jobs on LinkedIn and realized most of the postings are duplicates and repostings of the same jobs over and over?

Here is a quick and unpolished script to remove duplicates while searching on the /jobs/search/ section of LinkedIn.

As you move from page to page, this script will highlight the jobs you have not seen while removing those you have. Each time the script has finished on the page, it will log a table of already seen, unique jobs to the console. This allows for easy copying and pasting of the end result to a new file for future reference.

To use the script, copy and paste the code below into the [developer console](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console#Opening_the_Browser_Console) when on the [job search page](https://www.linkedin.com/jobs/search/) on LinkedIn.

**—Make sure you understand the risks associated with copying and pasting code into the developer console before doing so—**

**Warning**

I am not aware of the implications of using this script. You may be labeled as a robot, or worse: a bad human. This was simply written for practice to see how quickly a "dedupe" could go on the job search section. Hopefully you can learn from and adapt it for your own needs, but make sure you accept any risk and understand [LinkedIn's User Agreement](https://www.linkedin.com/legal/user-agreement#dos). 🍻

## Script

```javascript
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
    return window.location.hostname === 'www.linkedin.com' && window.location.pathname === '/jobs/search/';
  };

  function removeDuplicates() {
    if ((passes === 6 && isSamePage()) || !currentPageIsValid()) {
      clearInterval(removeDuplicatesInterval);
      passes = 0;

      console.clear();
      console.log('%c Pausing search ', 'background:#62fcf7;color:black');
      console.log('%c NON-DUPLICATE JOBS ', 'background:#9ffc7e;color:#1a1a1a;font-size:2rem', `TOTAL: ${jobListSize}`);
      console.table(seenJobs);
      return;
    }

    const jobCards = document.querySelectorAll('.job-card-container');

    jobCards.forEach((job) => {
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
```
