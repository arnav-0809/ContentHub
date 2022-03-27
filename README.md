# ContentHub
A backend development project comprising of 3 microservices handling the upload,read and like events of content connecting the readers and writers while 
maintaining a database using Nodejs, MongoDb(mongoose) and Docker.
# Microservices:
## Content Service
Serving books as content. A content will have a story and title.
Content ingestion happens via csv using a script to ingest data into the database
Content service stores the title, story, date published and the user id.
Comprises pf REST API's for CRUD operations on contents(title, story)
  - New contents API : sorted on the basis of date
  - Top contents API : sorted on user-interaction(Sorted on basis of Number of interactions, both read and like)
  - Upload content API : helps to post the csv file and automatically invoke the data ingestion process once it receives the csv file.
## User interaction service
Consists of add, update and read API's for following 2 interactions.
  - User Read event(validate if user exists)
  - User Like event(validate if user exists)
User Interaction service record the events done by the user. In this case the service needs to be able to record 2 types of 
events, Like and Read.
  - Like : Think about what happens when you hit the "like" button on facebook, an event is triggered, it works in a similar way.
  - Read : The content service is serving books, so read event is basically triggered once the user has completed reading the book. 

## User service
Consists of REST API's for CRUD operations on user(First name, last name, email_id, phone number)
