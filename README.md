# vaccine-clinical-trial

### Vaccine Clinical Trial Data Analysis

This repository contains two Jupyter notebooks that analyze vaccine-related clinical trial data sourced from ClinicalTrials.gov, using the Aggregate Analysis of ClinicalTrials.gov (AACT) database. The analysis aims to provide insights into the landscape of vaccine trials, identifying trends and important findings from the data.

#### Project Overview

Clinical trials are essential for testing new drugs, therapies, and medical devices. This project focuses on creating an advanced and user-centric database for vaccine-related clinical trials. The goal is to improve research efficiency, support informed decision-making, and facilitate collaboration and data sharing among researchers. The key methodologies and processes involved in this project include:

1. Data Collection and Integration: Compiling comprehensive data on vaccine trials from ClinicalTrials.gov.
2. Methodology Development: Extracting and standardizing vaccine-related trial information.
3. Data Analytics: Conducting detailed data analytics to identify trends and insights in vaccine trials.
4. Visualization: Generating visual analytics and summary statistics to present the data effectively.

#### Notebooks

1. Vaccine Clinical Trial Data Analysis.ipynb: This notebook contains the main analysis, including data extraction, cleaning, and visualization.
2. Vaccine_Trials_Dataset_Creation.ipynb: This notebook includes additional code and analysis specific to the project's requirements. The final dataframe created at the end of this notebook is the final filtered dataset for clinical vaccine trials information.

#### Getting Started

##### Prerequisites

To run the notebooks, you need to have the following software installed:

1. Python 3.x
2. Jupyter Notebook or Jupyter Lab
3. PostgreSQL

You also need to install the required Python packages. You can install them using pip:

  - pip install pandas numpy matplotlib seaborn psycopg2

##### Setting Up the Database

The raw data can be downloaded from the AACT database. Follow these steps to download and set up the data on your local system:

1. Download the Data:

      Visit the AACT Download Page and download the required data files.

2. List of Required Raw Data Files:

    - brief_summaries.csv
    - studies.csv
    - designs.csv
    - interventions.csv
    - browse_conditions.csv
    - browse_interventions.csv
    - keywords.csv
    - conditions.csv
    - design_groups.csv

3. Set Up PostgreSQL:

    - Install PostgreSQL on your system if it is not already installed.
    - Create a new PostgreSQL database.
    - Load the downloaded data files into your PostgreSQL database. You can use pgAdmin or any other tool to perform this task.

4. Configure Database Connection:

    - Update the database connection settings in the notebooks to connect to your local PostgreSQL database.

#### How to Use the Notebooks

1. Clone the Repository:

    - git clone https://github.com/your-username/polygon-health-analytics.git
    - cd polygon-health-analytics

2. Open the Notebooks:

    - jupyter notebook
    
      This will open Jupyter Notebook in your browser. Navigate to the directory where you cloned the repository and open the notebooks.

3. Run the Notebooks:

    - Execute the cells in the notebooks sequentially to perform the data analysis and generate visualizations.
    - Note: While running the Vaccine_Trials_Dataset_Creation.ipynb, make sure to replace the file paths with the paths on your local system.

#### Data Description

The data includes various details about clinical trials, such as study type, intervention type, primary purpose, study design, participant demographics, and outcomes. The main columns used in the analysis include:

- nct_id: Unique identifier for each clinical trial
- start_date: Start date of the trial
- completion_date: Completion date of the trial
- primary_completion_date: Primary completion date of the trial
- phase: Phase of the trial
- overall_status: Overall status of the trial (e.g., completed, recruiting)
- study_type: Type of study (e.g., interventional, observational)
- intervention_type: Type of intervention (e.g., biological, drug)
- primary_purpose: Primary purpose of the trial (e.g., prevention, treatment)

#### Analysis and Visualization

The notebooks include various analyses and visualizations, such as:

- Distribution of vaccine trials by country/region
- Distribution of primary purposes and statuses of vaccine trials
- Trends in vaccine trial initiation over the years
- Analysis of trial phases and statuses
- Study types and experimental designs
- Number of vaccine trials per indication
- [visualization shown through this link](https://polygonhealthanalytics.github.io/vaccine-clinical-trial/)

#### Future Work

In the future, we plan to expand the analysis to other therapeutic areas and improve the database's user interface to make it more accessible and user-friendly.

#### Contribution

If you would like to contribute to this project, please fork the repository and create a pull request with your changes. We welcome any contributions that improve the analysis or add new features.

#### License

This project is licensed under the MIT License.

#### Contact

For any questions or support, please contact Atul Poddar at atulp3@illinois.edu.

