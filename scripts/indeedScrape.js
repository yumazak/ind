// ==UserScript==
// @name         Indeed Job Details Scraper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://jp.indeed.com/jobs*
// @grant        none
// ==/UserScript==

const getTitle = () => {
  const jobTitleElement = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]');
  if (!jobTitleElement) return ""
  const title = jobTitleElement.childNodes[0].textContent.split(" - job post")[0]
  
  return title
}

const getCompanyName = () => {
  const companyNameElement = document.querySelector('[data-testid="inlineHeader-companyName"]');
  if (!companyNameElement) return ""
  let companyNameSpanElement = companyNameElement.querySelector("span")
  if (!companyNameSpanElement) return ""
  const companyName = companyNameSpanElement.textContent

  return companyName
}

const getLocation = () => {
  const locationElement = document.querySelector('[data-testid="jobsearch-JobInfoHeader-companyLocation"]');
  if (!locationElement) return ""
  let locationSpanElement = locationElement.querySelector("span")
  if (!locationSpanElement) return ""
  const location = locationSpanElement.textContent

  return location
}

const getSalary = () => {
  const salaryElement = document.getElementById('salaryInfoAndJobType');
  if (!salaryElement) return ""
  let salarySpanElement = salaryElement.querySelector("span")
  if (!salarySpanElement) return ""
  const salary = salarySpanElement.textContent
  return salary
}

const getJobType = () => {
  try {
    const jobTypeElement = document.getElementById('salaryInfoAndJobType');
    if (!jobTypeElement) return ""
    let jobTypeSpanElements = jobTypeElement.querySelectorAll("span")
    if (!jobTypeSpanElements) return ""
    const jobType = jobTypeSpanElements[1].textContent.split(" -  ")[1]
    return jobType
  } catch (error) {
    // console.error("勤務形態を取得できませんでした")
    return ""
  }
}

const getJobDescription = () => {
  try {
    const jobLocationSectionWrapper = document.getElementById('jobLocationSectionWrapper');
    if (!jobLocationSectionWrapper) {
      throw new Error('jobLocationSectionWrapper not found');
    }
    const nextSiblingDiv = jobLocationSectionWrapper.nextElementSibling;
    if (!nextSiblingDiv || !nextSiblingDiv.firstChild || !nextSiblingDiv.firstChild.children || nextSiblingDiv.firstChild.children.length < 2) {
      throw new Error('Required elements not found');
    }
    const jobDescription = nextSiblingDiv.firstChild.children[1].innerText;
    return jobDescription;
  } catch (error) {
    // console.error("仕事内容を取得できませんでした", error);
    return '';
  }
}

const getRequiredSkills = () => {
  try {
    return document.getElementsByClassName("jobsearch-JobComponent-description")[0].children[8].firstChild.children[1].innerText
  } catch (error) {
    // console.error("求める人材を取得できませんでした。", error)
    return ''
  }
}

const getAppealPoints = () => {
  try {
    return document.getElementsByClassName("jobsearch-JobComponent-description")[0].children[9].firstChild.children[1].innerText
  } catch (error) {
    // console.error("アピールポイントを取得できませんでした。", error)
    return ''
  }
}

const getInfos = () => {
  let jobData = {
    jobDescription: "",
    requiredSkills: "",
    appealPoints: "",
    workingHoursAndDays: "",
    workForm: "",
    holidays: "",
    locationNotes: "",
    trialPeriod: "",
    compensationAndBenefits: "",
    socialInsurance: "",
    headOfficeLocation: "",
    industry: "",
    representativePhoneNumber: "",
    representativeName: "",
    other: ""
  }
  try {
    document.getElementsByClassName("jobsearch-JobComponent-description")[0].childNodes.forEach(data => {
      if (!data.firstChild || data.firstChild.children.length < 2) return
      const infoTitle = data.firstChild.children[0].innerText
      const value = data.firstChild.children[1].innerText
      switch (infoTitle) {
        case "仕事内容":
          jobData.jobDescription = value
          break;
        case "求める人材":
          jobData.requiredSkills = value
          break
        case "アピールポイント":
          jobData.appealPoints = value
          break
        case "勤務時間・曜日":
          jobData.workingHoursAndDays = value
          break
        case "休暇・休日":
          jobData.holidays = value
          break
        case "勤務地備考":
          jobData.locationNotes = value
          break
        case "試用期間":
          jobData.trialPeriod = value
          break
        case "待遇・福利厚生":
          jobData.compensationAndBenefits = value
          break
        case "社会保険":
          jobData.socialInsurance = value
          break
        case "本社所在地":
          jobData.headOfficeLocation = value
          break
        case "業種":
          jobData.industry = value
          break
        case "代表電話番号":
          jobData.representativePhoneNumber = value
          break
        case "代表者名":
          jobData.representativeName = value
          break
        case "その他":
          jobData.other = value
          break
      }
      
    })
    return jobData
  } catch (error) {
    // console.error(`取得できませんでした。`, error)
    return ''
  }
}

const getJobDetail = async () => {
  const title = getTitle()
  const companyName = getCompanyName()
  const location = getLocation()
  const salary = getSalary()
  const jobType = getJobType()
  const jobDescription = getJobDescription()
  const requiredSkills = getRequiredSkills()
  const appealPoints = getAppealPoints()
  const infos = getInfos()
  const jobData = {
    title: title,
    companyName: companyName,
    location: location,
    salary: salary,
    jobType: jobType,
    jobDescription: jobDescription,
    requiredSkills: requiredSkills,
    appealPoints: appealPoints,
    ...infos
  }

  return jobData
}

const postData = async (jobData) => {
  try {
    const response = await fetch('http://127.0.0.1:3000/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobData)
    })
    return response
  } catch (error) {
    console.error("POSTに失敗しました", error)
    return ""
  }

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const jumpToNextPage = () => {
  const currentUrl = window.location.href;

  // URLからクエリパラメータを取得
  const urlParams = new URLSearchParams(window.location.search);
  const startParam = urlParams.get('start');

  if (startParam !== null) {
    // startパラメータが存在する場合、値を数値に変換して10を加える
    const newStartValue = parseInt(startParam) + 10;
    // if (newStartValue == 1000) {
    //   console.info("finish")
    //   return
    // }
    // 新しいURLを作成
    const newUrl = currentUrl.replace(`start=${startParam}`, `start=${newStartValue}`);

    // 新しいURLにリダイレクト
    window.location.href = newUrl;
  } else {
    // startパラメータが存在しない場合、新しいURLを作成してstartパラメータを追加
    const newUrl = `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}start=0`;

    // 新しいURLにリダイレクト
    window.location.href = newUrl;
  }
}

(function() {
  'use strict';

  window.addEventListener('load', async () => {
      window.scrollTo(0, document.body.scrollHeight);

      const jobCardsSelector = "#mosaic-provider-jobcards > ul > li";
      const jobCards = document.querySelectorAll(jobCardsSelector);
      let count = 0
      for (const jobCard of jobCards) {
        count += 1
        // if (count > 3) break;
        const anchor = jobCard.querySelector("a"); // a タグを選択
        if (!anchor) continue;
        const id = anchor.getAttribute("data-jk")
        const jobComponent = document.querySelector('.jobsearch-JobComponent');
        
        if (jobComponent) {
          
          anchor.click()
          await sleep(1000);
          const jobData = await getJobDetail()
          jobData.id = id
          const res = await postData(jobData)
          if (res.status == 400) console.error("保存済みのジョブです")
          if (res.status == 500) console.error("予期しないエラーが発生しました")
        }
      }
      jumpToNextPage()
  });
})();