# LinkedIn Duplicate Job Remover

(in-progress)

Ever been looking through jobs on LinkedIn and realized most of the postings are duplicates and repostings of the same jobs over and over?

Here is a quick and unpolished script to remove duplicates while searching on the /jobs/search/ section of LinkedIn.

As you move from page to page, this script will highlight the jobs you have not seen while removing those you have.

To use the script, copy and paste the code below into the developer console when on the job search page on LinkedIn.

The script will log jobs being removed and jobs that are good to look at in the console. This allows for easy copying and pasting of the end result to a new file for future reference.

**—Make sure you understand the risks associated with copying and pasting code into the developer console before doing so—**

**Warning**

I am not aware of the implications of using this script. You may be labeled as a robot, or worse: a bad human. This was simply written for practice to see how quickly a "dedupe" could go on the job search section. Hopefully you can learn from and adapt it for your own needs. I've certainly found it to be a nice tool to help wade through the many duplicates on LinkedIn.

Note that since there is no stop to the interval, you should not keep this script running for long.

## Script

```javascript
(() => {
  console.clear();

  const seenJobs = new Set();
  let passes = 0;

  const currentPageIsValid = () => {
    return window.location.hostname === 'www.linkedin.com' && window.location.pathname === '/jobs/search/';
  };

  function removeDupeJobs() {
    if (!currentPageIsValid()) {
      clearInterval(removeDupesInterval);
      return;
    }

    console.log('%c Checking for duplicates ', 'background:#fcb271;color:#1a1a1a');

    const jobCards = document.querySelectorAll('.job-card-container');

    jobCards.forEach((job) => {
      try {
        const companyName = job.querySelector('.job-card-container__company-name').innerText;
        const jobTitle = job.querySelector('.job-card-list__title').innerText;
        const jobId = job.dataset.jobId;
        const jobReference = `${companyName}—${jobTitle}–${jobId}`;

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
```

## Issues

The script is currently single-pass. If you attempt to revisit a page, the DOM elements will have been seen and will be removed. Should probably store and work with the entire DOM element.
