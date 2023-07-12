---
title: "Machine Learning prep: cleaning, encoding, and splits, oh my!" 
id: "11-machine-learning-prep"
description: "Machine Learning prep"
---
Now that we’ve gained insights and business intelligence about Formula 1 at a descriptive level, we want to extend our capabilities into prediction. We’re going to take the scenario where we censor the data. This means that we will pretend that we will train a model using earlier data and apply it to future data. In practice, this means we’ll take data from 2010-2019 to train our model and then predict 2020 data.

In this section, we’ll be preparing our data to predict the final race position of a driver.

At a high level we’ll be:

- Creating new prediction features and filtering our dataset to active drivers
- Encoding our data (algorithms like numbers) and simplifying our target variable called `position`
- Splitting our dataset into training, testing, and validation

## ML data prep

1. To keep our project organized, we’ll need to create two new subfolders in our `ml` directory. Under the `ml` folder, make the subfolders `prep` and `train_predict`.
2. Create a new file under `ml/prep` called `ml_data_prep`. Copy the following code into the file and **Save**.
    ```python 
    import pandas as pd

    def model(dbt, session):
        # dbt configuration
        dbt.config(packages=["pandas"])

        # get upstream data
        fct_results = dbt.ref("fct_results").to_pandas()

        # provide years so we do not hardcode dates in filter command
        start_year=2010
        end_year=2020

        # describe the data for a full decade
        data =  fct_results.loc[fct_results['RACE_YEAR'].between(start_year, end_year)]

        # convert string to an integer
        data['POSITION'] = data['POSITION'].astype(float)

        # we cannot have nulls if we want to use total pit stops 
        data['TOTAL_PIT_STOPS_PER_RACE'] = data['TOTAL_PIT_STOPS_PER_RACE'].fillna(0)

        # some of the constructors changed their name over the year so replacing old names with current name
        mapping = {'Force India': 'Racing Point', 'Sauber': 'Alfa Romeo', 'Lotus F1': 'Renault', 'Toro Rosso': 'AlphaTauri'}
        data['CONSTRUCTOR_NAME'].replace(mapping, inplace=True)

        # create confidence metrics for drivers and constructors
        dnf_by_driver = data.groupby('DRIVER').sum()['DNF_FLAG']
        driver_race_entered = data.groupby('DRIVER').count()['DNF_FLAG']
        driver_dnf_ratio = (dnf_by_driver/driver_race_entered)
        driver_confidence = 1-driver_dnf_ratio
        driver_confidence_dict = dict(zip(driver_confidence.index,driver_confidence))

        dnf_by_constructor = data.groupby('CONSTRUCTOR_NAME').sum()['DNF_FLAG']
        constructor_race_entered = data.groupby('CONSTRUCTOR_NAME').count()['DNF_FLAG']
        constructor_dnf_ratio = (dnf_by_constructor/constructor_race_entered)
        constructor_relaiblity = 1-constructor_dnf_ratio
        constructor_relaiblity_dict = dict(zip(constructor_relaiblity.index,constructor_relaiblity))

        data['DRIVER_CONFIDENCE'] = data['DRIVER'].apply(lambda x:driver_confidence_dict[x])
        data['CONSTRUCTOR_RELAIBLITY'] = data['CONSTRUCTOR_NAME'].apply(lambda x:constructor_relaiblity_dict[x])

        #removing retired drivers and constructors
        active_constructors = ['Renault', 'Williams', 'McLaren', 'Ferrari', 'Mercedes',
                            'AlphaTauri', 'Racing Point', 'Alfa Romeo', 'Red Bull',
                            'Haas F1 Team']
        active_drivers = ['Daniel Ricciardo', 'Kevin Magnussen', 'Carlos Sainz',
                        'Valtteri Bottas', 'Lance Stroll', 'George Russell',
                        'Lando Norris', 'Sebastian Vettel', 'Kimi Räikkönen',
                        'Charles Leclerc', 'Lewis Hamilton', 'Daniil Kvyat',
                        'Max Verstappen', 'Pierre Gasly', 'Alexander Albon',
                        'Sergio Pérez', 'Esteban Ocon', 'Antonio Giovinazzi',
                        'Romain Grosjean','Nicholas Latifi']

        # create flags for active drivers and constructors so we can filter downstream              
        data['ACTIVE_DRIVER'] = data['DRIVER'].apply(lambda x: int(x in active_drivers))
        data['ACTIVE_CONSTRUCTOR'] = data['CONSTRUCTOR_NAME'].apply(lambda x: int(x in active_constructors))
        
        return data
    ```
3. As usual, let’s break down what we are doing in this Python model:
    - We’re first referencing our upstream `fct_results` table and casting it to a pandas dataframe.
    - Filtering on years 2010-2020 since we’ll need to clean all our data we are using for prediction (both training and testing).
    - Filling in empty data for `total_pit_stops` and making a mapping active constructors and drivers to avoid erroneous predictions
        - ⚠️ You might be wondering why we didn’t do this upstream in our `fct_results` table! The reason for this is that we want our machine learning cleanup to reflect the year 2020 for our predictions and give us an up-to-date team name. However, for business intelligence purposes we can keep the historical data at that point in time. Instead of thinking of one table as “one source of truth” we are creating different datasets fit for purpose: one for historical descriptions and reporting and another for relevant predictions.
    - Create new confidence features for drivers and constructors
    - Generate flags for the constructors and drivers that were active in 2020
4. Execute the following in the command bar:
    ```bash
    dbt run --select ml_data_prep
    ```
5. There are more aspects we could consider for this project, such as normalizing the driver confidence by the number of races entered. Including this would help account for a driver’s history and consider whether they are a new or long-time driver. We’re going to keep it simple for now, but these are some of the ways we can expand and improve our machine learning dbt projects. Breaking down our machine learning prep model:
    - Lambda functions &mdash; We use some lambda functions to transform our data without having to create a fully-fledged function using the `def` notation. So what exactly are lambda functions?
        - In Python, a lambda function is a small, anonymous function defined using the keyword "lambda". Lambda functions are used to perform a quick operation, such as a mathematical calculation or a transformation on a list of elements. They are often used in conjunction with higher-order functions, such as `apply`, `map`, `filter`, and `reduce`.
    - `.apply()` method &mdash; We used `.apply()` to pass our functions into our lambda expressions to the columns and perform this multiple times in our code. Let’s explain apply a little more:
        - The `.apply()` function in the pandas library is used to apply a function to a specified axis of a DataFrame or a Series. In our case the function we used was our lambda function!
        - The `.apply()` function takes two arguments: the first is the function to be applied, and the second is the axis along which the function should be applied. The axis can be specified as 0 for rows or 1 for columns. We are using the default value of 0 so we aren’t explicitly writing it in the code. This means that the function will be applied to each *row* of the DataFrame or Series.
6. Let’s look at the preview of our clean dataframe after running our `ml_data_prep` model:
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/11-machine-learning-prep/1-completed-ml-data-prep.png" title="What our clean dataframe fit for machine learning looks like"/>

## Covariate encoding

In this next part, we’ll be performing covariate encoding. Breaking down this phrase a bit, a *covariate* is a variable that is relevant to the outcome of a study or experiment, and *encoding* refers to the process of converting data (such as text or categorical variables) into a numerical format that can be used as input for a model. This is necessary because most machine learning algorithms can only work with numerical data. Algorithms don’t speak languages, have eyes to see images, etc. so we encode our data into numbers so algorithms can perform tasks by using calculations they otherwise couldn’t.

🧠 We’ll think about this as : “algorithms like numbers”.

1. Create a new file under `ml/prep` called `covariate_encoding` copy the code below and save.
    ```python
    import pandas as pd
    import numpy as np
    from sklearn.preprocessing import StandardScaler,LabelEncoder,OneHotEncoder
    from sklearn.linear_model import LogisticRegression

    def model(dbt, session):
        # dbt configuration
        dbt.config(packages=["pandas","numpy","scikit-learn"])

        # get upstream data
        data = dbt.ref("ml_data_prep").to_pandas()

        # list out covariates we want to use in addition to outcome variable we are modeling - position
        covariates = data[['RACE_YEAR','CIRCUIT_NAME','GRID','CONSTRUCTOR_NAME','DRIVER','DRIVERS_AGE_YEARS','DRIVER_CONFIDENCE','CONSTRUCTOR_RELAIBLITY','TOTAL_PIT_STOPS_PER_RACE','ACTIVE_DRIVER','ACTIVE_CONSTRUCTOR', 'POSITION']]
    
        # filter covariates on active drivers and constructors
        # use fil_cov as short for "filtered_covariates"
        fil_cov = covariates[(covariates['ACTIVE_DRIVER']==1)&(covariates['ACTIVE_CONSTRUCTOR']==1)]

        # Encode categorical variables using LabelEncoder
        # TODO: we'll update this to both ohe in the future for non-ordinal variables! 
        le = LabelEncoder()
        fil_cov['CIRCUIT_NAME'] = le.fit_transform(fil_cov['CIRCUIT_NAME'])
        fil_cov['CONSTRUCTOR_NAME'] = le.fit_transform(fil_cov['CONSTRUCTOR_NAME'])
        fil_cov['DRIVER'] = le.fit_transform(fil_cov['DRIVER'])
        fil_cov['TOTAL_PIT_STOPS_PER_RACE'] = le.fit_transform(fil_cov['TOTAL_PIT_STOPS_PER_RACE'])

        # Simply target variable "position" to represent 3 meaningful categories in Formula1
        # 1. Podium position 2. Points for team 3. Nothing - no podium or points!
        def position_index(x):
            if x<4:
                return 1
            if x>10:
                return 3
            else :
                return 2

        # we are dropping the columns that we filtered on in addition to our training variable
        encoded_data = fil_cov.drop(['ACTIVE_DRIVER','ACTIVE_CONSTRUCTOR'],1)
        encoded_data['POSITION_LABEL']= encoded_data['POSITION'].apply(lambda x: position_index(x))
        encoded_data_grouped_target = encoded_data.drop(['POSITION'],1)

        return encoded_data_grouped_target
    ```
2. Execute the following in the command bar:
    ```bash
    dbt run --select covariate_encoding
    ```
3. In this code, we are using a ton of functions from libraries! This is really cool, because we can utilize code other people have developed and bring it into our project simply by using the `import` function. [Scikit-learn](https://scikit-learn.org/stable/), “sklearn” for short, is an extremely popular data science library. Sklearn contains a wide range of machine learning techniques, including supervised and unsupervised learning algorithms, feature scaling and imputation, as well as tools model evaluation and selection. We’ll be using Sklearn for both preparing our covariates and creating models (our next section).
4. Our dataset is pretty small data so we are good to use pandas and `sklearn`. If you have larger data for your own project in mind, consider `dask` or `category_encoders`.
5. Breaking it down a bit more:
    - We’re selecting a subset of variables that will be used as predictors for a driver’s position.
    - Filter the dataset to only include rows using the active driver and constructor flags we created in the last step.
    - The next step is to use the `LabelEncoder` from scikit-learn to convert the categorical variables `CIRCUIT_NAME`, `CONSTRUCTOR_NAME`, `DRIVER`, and `TOTAL_PIT_STOPS_PER_RACE` into numerical values.
    - Create a new variable called `POSITION_LABEL`, which is a derived from our position variable.
        - 💭 Why are we changing our position variable? There are 20 total positions in Formula 1 and we are grouping them together to simplify the classification and improve performance. We also want to demonstrate you can create a new function within your dbt model!
        - Our new `position_label` variable has meaning:
            - In Formula1 if you are in:
                - Top 3 you get a “podium” position
                - Top 10 you gain points that add to your overall season total
                - Below top 10 you get no points!
        - We are mapping our original variable position to `position_label` to the corresponding places above to 1,2, and 3 respectively.
    - Drop the active driver and constructor flags since they were filter criteria and additionally drop our original position variable.

## Splitting into training and testing datasets

Now that we’ve cleaned and encoded our data, we are going to further split in by time. In this step, we will create dataframes to use for training and prediction. We’ll be creating two dataframes 1) using data from 2010-2019 for training, and 2) data from 2020 for new prediction inferences. We’ll create variables called `start_year` and `end_year` so we aren’t filtering on hardcasted values (and can more easily swap them out in the future if we want to retrain our model on different timeframes).

1. Create a file called `train_test_dataset` copy and save the following code:
    ```python 
    import pandas as pd

    def model(dbt, session):

        # dbt configuration
        dbt.config(packages=["pandas"], tags="train")

        # get upstream data
        encoding = dbt.ref("covariate_encoding").to_pandas()

        # provide years so we do not hardcode dates in filter command
        start_year=2010
        end_year=2019

        # describe the data for a full decade
        train_test_dataset =  encoding.loc[encoding['RACE_YEAR'].between(start_year, end_year)]

        return train_test_dataset
    ```

2. Create a file called `hold_out_dataset_for_prediction` copy and save the following code below. Now we’ll have a dataset with only the year 2020 that we’ll keep as a hold out set that we are going to use similar to a deployment use case.
    ```python 
    import pandas as pd

    def model(dbt, session):
        # dbt configuration
        dbt.config(packages=["pandas"], tags="predict")

        # get upstream data
        encoding = dbt.ref("covariate_encoding").to_pandas()
        
        # variable for year instead of hardcoding it 
        year=2020

        # filter the data based on the specified year
        hold_out_dataset =  encoding.loc[encoding['RACE_YEAR'] == year]
        
        return hold_out_dataset
    ```
3. Execute the following in the command bar:
    ```bash
    dbt run --select train_test_dataset hold_out_dataset_for_prediction
    ```
    To run our temporal data split models, we can use this syntax in the command line to run them both at once. Make sure you use a *space* [syntax](/reference/node-selection/syntax) between the model names to indicate you want to run both!
4. **Commit and push** our changes to keep saving our work as we go using `ml data prep and splits` before moving on.

👏 Now that we’ve finished our machine learning prep work we can move onto the fun part &mdash; training and prediction!
