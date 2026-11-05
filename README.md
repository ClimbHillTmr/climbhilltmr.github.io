# Qi Guo · Research & Engineering

### Machine learning for physical and clinical systems · 让 AI 走进真实的物理世界

南方科技大学电子信息博士研究生，具有统计学与计算金融背景。关注机器学习如何理解真实物理与临床系统，并将研究问题转化为可复现的实验、模型与科研软件。

Doctoral student in Electronic Information at SUSTech with a background in statistics and computational finance. My work connects machine learning, physical modeling, and research software across intelligent sensing, semiconductor processes, healthcare, and microfluidics.

🌐 **Academic Homepage (个人学术主页)**: **[https://climbhilltmr.github.io/](https://climbhilltmr.github.io/)**  
💻 **Public Repositories (开源代码仓库)**: **[https://github.com/ClimbHillTmr?tab=repositories](https://github.com/ClimbHillTmr?tab=repositories)**

---

## Research interests · 研究方向

| Area | Questions & Themes |
| --- | --- |
| **01 Intelligent sensing · 智能传感** | 气体传感阵列、温度调制、动力学响应与长期漂移恢复；研究表征中的物理可观测性及跨条件泛化。<br>Temperature-modulated MEMS gas sensing, long-term drift recovery, and physics-informed representation learning. |
| **02 Semiconductor processes · 半导体工艺** | 亚纳米氦离子束光刻、刻蚀与纳米压印中的多物理场蒙特卡洛模拟、统计建模与逆向优化。<br>Multiphysics Monte Carlo simulation, statistical modeling, and optimization for lithography, etching, and nanoimprint processes. |
| **03 Clinical machine learning · 临床机器学习** | 维持性血液透析血流动力学不稳定性与纵向治疗序列；坚持患者级独立划分、时间因果边界与多中心外部验证。<br>Dialysis instability and longitudinal treatment modeling, emphasizing incremental predictive value and multicenter external validation. |
| **04 Intelligent microfluidics · 智能微流控** | 数字微流控（DMF）液滴目标检测、形态分割、防冲突路径规划与自动化实验软件系统。<br>Droplet detection, morphological segmentation, collision-free routing, and closed-loop laboratory software. |

---

## Selected projects · 代表性开源与科研系统

### [rig-gateway](https://github.com/ClimbHillTmr/rig-gateway)
**MCP · Remote research workflows · Python**

面向远程科研工作站与实验设备的自托管 MCP 网关，提供分级操作权限、沙箱访问与完整可审计的远程研究工作流。  
A self-hosted MCP gateway for remote research machines, offering tiered capabilities, file access, and auditable workflow verification.

### [SubNano-HIL-MC](https://github.com/ClimbHillTmr/SubNano-HIL-MC)
**Physical modeling · Monte Carlo · Scientific computing**

面向亚纳米氦离子束光刻的多物理场蒙特卡洛研究框架，定量连接材料表征、离子散射、二次电子级联、能量沉积与线边缘粗糙度（LER）分析。  
A multiphysics Monte Carlo framework connecting material characterization, ion transport, energy deposition, and line-edge roughness analysis in helium ion lithography.

### [climbhilltmr.github.io](https://climbhilltmr.github.io/)
**Academic homepage · Bilingual interface · Native HTML / CSS / JavaScript**

中英双语学术主页（源码位于本仓库 [`/docs`](docs/) 目录），汇集研究方向、发表论文与科研系统，支持论文领域筛选、关键词实时检索（`/`）、DOI 跳转与一键 BibTeX 引用复制。  
Bilingual academic homepage hosted at [https://climbhilltmr.github.io/](https://climbhilltmr.github.io/) with publication search, topic filters, project overviews, and one-click BibTeX citations.

---

## Methods & tools · 方法与工具

- **Modeling & analysis** — Python, NumPy, pandas, SciPy, scikit-learn, LightGBM, PyTorch.
- **Scientific computing** — Statistical modeling, numerical simulation, Monte Carlo methods, Gaussian processes, and Bayesian optimization.
- **Computer vision** — OpenCV, YOLO, SAM, morphological metrology, and spatio-temporal path planning.
- **Research engineering** — FastAPI, Model Context Protocol (MCP), hardware SDK integration, and reproducible experiment workflows.

## How I work · 研究与工程原则

从真实问题出发，重视评估协议设计、可复现性与证据边界；严格区分统计预测价值与因果机制推断，让算法、物理先验和实验系统共同服务于科学目标。

I start with concrete questions, make evaluation assumptions explicit, and strictly distinguish predictive evidence from causal claims—building research tools that can be inspected, reproduced, and used.

---

**Stay curious. Follow the evidence.**  
保持好奇，尊重证据。
