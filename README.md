# fastapiapp

## creating fasapi application

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


# status codes
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

# Architecture of fastapi application
-Model -- tables creation
-Router -- routes requests to controllers
-Controller -- controller logic 
-Service -- business logic
-repository -- data access layer
-Middleware -- request pipeline
-schema -- pydantic model for validation

# database 

# non relational db
mongodb
cassandra
redis
dynamodb

## constraints in database
primary key -- eg: student_id ,staff_id
forign key -- eg: department_id in student table
unique key -- eg: email, phone number
not null -- eg: name 
check -- eg:  salary > 0
default -- eg: timestamp:func.now()

## modules
-sqlalchemy-orm(obj relational mapping )
-fastapi-- web framework
-uvicorn-- server for runniing fastapi
-application--`uvicorn app.main:app --reload`
-psycopg2 -- postgresql driver
-pydantics -- data validation
-typing extensions-- type hints
-alembic--  database migration 
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


