# fastapiapp
## creating fast api application 


# CRUD operations
-create
-Read
-Update
-Delete

# Rest API
-GET
-POST
-PUT
-DELETE


# status code
-200 OK
-201 created
-204 No content
-400 Bad request
-402 Unauthorized
-403 Forbidden
-404 Not found 
-405 Method Not Allowed 
-409 conflict
-500 Internal server error




## modules
-sqlalchemy-orm(obj relational mapping )
-fastapi-- web framework
-uvicorn-- server for runniing fastapi
-application--
  ```bash
  cd backend
  uvicorn app.main:app --reload
  ```
-psycopg2 -- postgresql driver
-pydantics -- data validation
-typing extensions-- type hints

## concepts:
 ---orm (object relational mapping)-- to convert python code t0 sql commands without writing sql commands
 -----depends
    -- dependency injection-- to inject dependencies into route handlers
    
-------sessionmaker
            - to create a session with the database for a single request
    --declarative base 
            -to create a base class for all the models

    --session local 
            to create 



```bash
cd backend
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "initial migration"
alembic upgrade head
```
ybs-cfhr-hwp


npm install axios 
ui > axios > localhost:8000 (api call) > fastapi (python )> db > useeffect > setstate >rerender> ui

useeffect-->  which is used to call the api or which is used to fetch the data from the api automatically when the page is loaded 

useState --> which is used to store the data in the component and which will update the componen when the data is  updated or changed 


#hashing algorithm
argon2
bcrypt

jwt tokens--> used to authenticate and authorize users 
its in the format xxxx.yyyy.zzzzz basically 3 parts
1.header -> algo + token type : { alg:HS256 , type:JWT }
2.payload ->data, for eg:{user_id: 1, role:admin}
3.signature -> used to verify the token :{hash(header+ payload+ secretkey) }

access token  -> used to access protected resources
refresh token -> used to refresh access token

pip install python-multipart



                                        Abstract 

The Job Recommendation Assistant Using Semantic Search and Resume Analysis is an AI-powered web application that helps students and job seekers find suitable job opportunities based on their skills, qualifications, and experience. The system analyzes uploaded resumes, extracts key information, and compares it with job descriptions using Natural Language Processing (NLP), semantic search, and Retrieval-Augmented Generation (RAG) to provide accurate job recommendations. It also identifies skill gaps, suggests resume improvements, and offers personalized career guidance, making the job search process faster, smarter, and more effective.