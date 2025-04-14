---
layout: default
permalink: /internships/
title: "Internships"
excerpt: ""
author_profile: true
---
<style>
.internship-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.internship-content {
  flex: 1;
  min-width: 65%;
  padding-right: 20px;
}

.company-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 90px;
  box-sizing: border-box;
}

/* AI Lab logo (672x390) - 宽长形状 */
.ailab-logo-container img {
  width: 150px;
  height: auto;
  object-fit: contain;
}

/* Huawei logo SVG */
.huawei-logo-container img {
  width: 180px;
  height: auto;
  object-fit: contain;
}

@media (max-width: 768px) {
  .internship-container {
    flex-direction: column-reverse;
  }

  .internship-content {
    padding-right: 0;
  }

  .company-logo-container {
    justify-content: center;
    margin-bottom: 20px;
    width: 100%;
    height: auto;
    padding: 10px 0;
  }

  .ailab-logo-container img {
    width: 160px;
  }

  .huawei-logo-container img {
    width: 120px;
  }
}
</style>

# 💼 Internships

<div class="internship-container">
  <div class="internship-content">
    <blockquote>
      <h3>Shanghai Artificial Intelligence Laboratory</h3>
      <blockquote>
        <p><strong>Jun 2024 -- Dec 2024</strong></p>
      </blockquote>
      <blockquote>
        <p><strong>AI Researcher</strong></p>
      </blockquote>
    </blockquote>
    <ul>
      <li>We conduct research on <strong>AI Application</strong> in <strong>Urban Computing</strong> fields like traffic and society.</li>
      <li>Develop a <strong>LLM-powered MAS platform</strong> which adapt its organization in various task scenarios.</li>
    </ul>
  </div>
  <div class="company-logo-container ailab-logo-container">
    <img src="/images/ailab-logo.png" alt="Shanghai AI Lab Logo">
  </div>
</div>


---

<div class="internship-container">
  <div class="internship-content">
    <blockquote>
      <h3>HUAWEI ICT Department</h3>
      <blockquote>
        <p><strong>Aug 2022 -- Oct 2022</strong></p>
      </blockquote>
      <blockquote>
        <p><strong><em>Software Development Engineer</em></strong></p>
      </blockquote>
    </blockquote>
    <ul>
      <li>Interned in <strong>packet core network department, ddb group</strong>, focus on distributed database microservices built on cloud core.</li>
      <li>We provide a full range of core network software, help operators build an agile and reliable core network. Build DDB micro-service based on Go Cell framework, realize synchronous data processing.</li>
    </ul>
  </div>
  <div class="company-logo-container huawei-logo-container">
    <img src="/images/huawei-logo.svg" alt="Huawei Logo">
  </div>
</div>
