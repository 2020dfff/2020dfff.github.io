---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---
{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

# 🔥 About Me

Welcome to my personal page!

My name is Yang Fei (费扬), a second-year master student at [School of Computing](https://www.comp.nus.edu.sg/), National University of Singapore, major in Computer Science. I graduated as **Shanghai Outstanding Undergraduate** from Shanghai Jiao Tong University in 2023.06 with a bachelor’s degree from the Department of Cyber Science and Engineering, [SEIEE school](https://www.seiee.sjtu.edu.cn/). Prior to that, I graduated my high at [Huaiyin High School](http://www.huaizhong.com.cn/index.aspx) with honor.

I won the **Outstanding Undergraduate Scholarship** of SJTU 3 times in 2020-2022 (Top 15% in SJTU), also won the **Top Cybersecurity Student Scholarship** in the fall of 2022. I won Meritorious Award in 2021 MCM, and was selected as Merit Student in my sophomore year.

I am deeply interested in research areas encompassing **Graph Algorithm**, and **Data Mining** skills. My passion lies in applying my mathematical and programming expertise to address real-world challenges in network analysis, including the simulation of **social, recommender or multi-agent systems**. I am also keen to explore the innovative applications of **LLMs** within these domains.

I have researched in several groups and maintain close communication with professional teachers in different fields. I finished my graduation project under the guidance of [Prof. Jiaping Gui](https://guijiaping.github.io/) at SJTU, I was an enthusiastic participant in the 2022 [UCInspire program](https://sites.uci.edu/ucinspire/research-faculty/), participated in [DSP LAB](https://faculty.sites.uci.edu/zhouli/research/) lead by [Prof. Zhou Li](https://scholar.google.de/citations?hl=zh-CN&user=zxJYEVwAAAAJ). I am now under the guidance of [Prof. Xiaokui XIAO](https://www.comp.nus.edu.sg/~xiaoxk/) at NUS.

## Basic Information

> 21 Lower Kent Ridge Rd, Singapore 119077
>
> +65 88851417 / +86 18015158812
>
> Mail me: [[NUS]](mailto:yfei11@u.nus.edu) / [[SJTU]](mailto:2019dfff@sjtu.edu.cn) / [[SHLAB]](mailto:feiyang@pjlab.org)

# 📖 Publications

1. Yimin Shi, **Yang Fei**, Shiqi Zhang, Haixun Wang, Xiaokui Xiao, *You Are What You Bought: Generating Customer Personas for E-commerce Applications*, (Submitted to **KDD'25**), Aug 2024.

2. Shengyue Yao\*, **Yang Fei\***, Shanzhe Lei, Xuhong Wang, Lin Yilun, Yu Qiao, *Optimizing Organization in Multi-Agent Systems via a Time and Task Sensitive Strategy $T^2$SO: Theoretical and Practical Evidences*, (Submitted to **AAAI'25**), Aug 2024.

🏫 Educations
=============

---

> ### **National University of Singapore**   📅 **[Aug 2023 -- May 2025(expected)]**
>
> Master of Computing, **Computer Science**

---

- **Overall GPA:** 3.92
- **Relevant Courses:** Advanced Computer Networks, Database Security, Distributed System, Knowledge Discovery and Data Mining.

---

> ### **Shanghai Jiaotong University**   📅 **[Sep 2019 -- Jun 2023]**
>
> Bachelor of Engineering, **Information Security**

---

- **Major GPA:** 3.74
- **A courses:**  Modern Number Theory, Information Security Innovation, Operating System, Windows Security, Data Mining and 20 others.

---

> ### **Huaiyin High School**   📅 **[Sep 2016 -- Jun 2019]**

- **2019-College Entrance Exam: 415/480 (top 0.01%)**

💻 Research Experiences
==============

---

> ### A Persona-Based LLM-assisted Reccommender System
>
> > **Nov 2023 -- Aug 2024**
> >
> > ***Master Dissertation***
> >
> > ***Prof. Xiaokui Xiao***
>

- Leverage LLM-assigned persona labels to construct a tripartite graph and apply rec-models like **LGCN**.
- Improve major accuracy metrics by **5-15%** when intuitively combined with the sota GNN-based recommender system.

---

> ### Network Anomalous Node Identification
>
> > **Jan 2023 -- Jun 2023**
> >
> > ***Graduation Project***
> >
> > ***Prof. Jiaping Gui***
>

- Quickly and effectively perform **anomalous node detection** and **reliability analysis**.
- Realize the general application from offline collected data sets to public data sets based on the graph theory algorithm.
- Form a journal article in *Cyber Security and Data Governance*.

---

> ### UCInspire Summer Program
>
> > **Jun 2022 -- Sep 2022**
> >
> > ***Summer Research***
> >
> > ***Prof. Zhou Li***

- Start with basic Graph neural network model on anomaly detection like **DeepWalk, NetWalk and Euler.**
- Apply NetWalk on **LANL** dataset to help detect unusual online flows, and make a fair comparison with Euler. Develop a new Model for anomaly detection, which has a **much better performance** on this topic.

---

> ### CITtrip : Student Research Training Program
>
> >  **Mar 2021 -- Mar 2022**
> >
> > ***College Innovation Program***
> >
> > ***Prof. Jie Guo***

- Use BERT, LDA and other models in the **NLP field** to help analyze harmful speeches on the Internet, realize measurement innovation.
- Define **anonymous** Internet users, establish relationship networks, and identify key users.
- Our project won the **2022 Outstanding College Innovation Project** in Shanghai.

⌨ Selected Course Projects
===========

---

### **Simple Network Sniffer: EzSniffer**

> ***Python, Scapy, PyQt5***
>
> **Nov 2021**

- A simple network sniffer developed based on **linux platform** and **python** language uses **PyQt5** for interface design.
- Main functions include: **capturing and analyzing** the local ethernet selected by the user, realizing packet filtering, searching, IP packet fragmentation and reorganization, and file storage.
- It contains as many types of messages as possible (ICMP, UDP, TCP, etc.), with good **usability and readability.**

---

### **Campus Carpooling System: Huajiao Carpooling**

> ***Django, Node.js, React, MySQL***
>
> **May 2021**

- Realize the **demand of carpooling for students** in partial campus and build a usable website.
- Carried out this group cooperation project in the form of **agile development**, a total of three rounds of iterations, and finally deployed the website.

---

### Personal Blog System

> **SpringBoot, MyBatis, React, Antd, MySQL**
>
> **May 2022**

- Build a platform to express your views and realize fragmented learning, we can also display personalized content.
- I’m mainly in charge of building the front-end framework. Considering the simple, clear, and componentizable features of react, it was chosen. Also selected antd as the component library.

---

### "Smart Eyes" - Bridge Bearing Damage Detection System

> **OpenCV, Yolo5, Raspberry Pi**
>
> **Aug 2022**

- Manufactures a real-time detection device with a high-quality camera installed on a fixed telescopic pole, and is equipped with a crack damage identification system with a Raspberry Pi as a carrier.
- Use OpenCV to implement image preprocessing, feature extraction and image matching mechanism, data training on yolov5.

---

### Basic File Safe

> **GNU Make, GCC, C/C++**
>
> **Oct 2022**

- Combined with encryption and access rights control, overloading system calls ensures the security of important personal data from the operating system level.
- Supported password input and verified user core permissions, also added timer management program.

🏆 Honors and Awards
====================

---

- Top Cybersecurity Student Scholarship **(Top 3%)**; Nov 2022
- Outstanding Undergraduate Scholarship of SJTU **(Top 15%)**; **3×recipient**, Nov 2020-2022
- Mathematical Contest in Modeling, **Meritorious**; Apr 2021
- Mathematical Contest in Modeling, **Honorable Mention**; Apr 2020
- Merit Student, Apr 2020

✨ Technical Skills
===================

---

- **Programming Languages**:

  - Python, C++, Go, SQL, MATLAB, Git, Latex, Office, etc.
- Libraries:

  - Pytorch, Numpy, Pandas, Seaborn, Networkx, etc
- Languages:

  - Mandarin (Native)
  - English (**TOEFL: 109 / GRE: 322**)
  - French (Beginner)
- Other Interest:

  - Basketball: I participate in several basketball teams in my high school, SJTU and NUS.
  - Hiking:
  - Scuba Diving: I will immediately pursue a AOW this year once I have time! (OW is not enough!)

🦾 Leadership / Extracurricular
===============================

---

- **College Student Work Office, President**, **Fall 2019 -- Present**

  - Organize and plan the training course of ideal and faith education in the college, with a total of four sessions, more than **2000 trainees**, and undertake **six forums**.
  - Led chapter of **50+** members to work towards goals that improve and promote community service, academics, and unity.
- **Club Unions, Cadre**, **Fall 2019 -- Fall 2020**

  - Participate in undertaking **large-scale cultural and sports activities** on campus, such as \"Qiyuan Loy Krathong Festival, Club Recruitment, Student Festival\" and other related activities.
  - The cumulative readings of articles related to the event **exceeded one million**.
- **Vaccination Site Volunteer**, **Fall 2021**
- **Shanghai International Marathon Volunteer**, **Fall 2020, 2021**

# 💻 Internships

***

> ### Shanghai Artificial Intelligence Laboratory
>
> > **Jun 2024 -- Oct 2024 (Expected)**
>
>
> > **AI Researcher**

- We conduct research on **AI Application** in **Urban Computing** fields like traffic and society.
- Develop a **LLM-powered MAS platform** which adapt its organization in various task scenarios.

---

> ### **HUAWEI ICT Department**
>
>> **Aug 2022 -- Oct 2022**
>>
>
>> ***Software Development Engineer***
>>

- Interned in **packet core network department, ddb group**, focus on distributed database microservices built on cloud core.
- We provide a full range of core network software, help operators build an agile and reliable core network. Build DDB micro-service based on Go Cell framework, realize synchronous data processing.

# 📝 Misc

<div class='image-scroll-container'>
    <div class='image-gallery'>
        <div>
            <div class="badge">Basketball</div>
            <img src='images/basketball1.png' alt="sym">
        </div>
        <div>
            <div class="badge">Basketball</div>
            <img src='images/basketball2.png' alt="sym">
        </div>
        <div>
            <div class="badge">Diving</div>
            <img src='images/diving1.png' alt="sym">
        </div>
        <div>
            <div class="badge">Diving</div>
            <img src='images/diving2.png' alt="sym">
        </div>
        <div>
            <div class="badge">My dog</div>
            <img src='images/dingdang.png' alt="sym">
        </div>
        <div>
            <div class="badge">My dog</div>
            <img src='images/dingdang2.png' alt="sym">
        </div>
    </div>
</div>


