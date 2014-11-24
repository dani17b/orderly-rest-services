RestMock.js
==========

A Rest mock service
------------------------------------------------------
> [RestMock] is a service that allows you to create mock services rest for testing web applications against a service not yet developed.

Installation
----
Depends on Node.js and npm:

    npm install restMock -g

Module Usage
-----
Every time we add a new service , we must place a response in the json file for the service folder.
In case you want the service to be GET , simply this, but in case it is POST, we need to create an orderly request.orderly file format will be the scheme against the entries received are validated json format. 

Example
-----
We want to create a mock of an accessible rest service by url / products / comment , for it created in the services folder located at data folder, and products inside her comment folder, find the file which request.orderly with the scheme of orderly format requests:
> object {
  object {
    integer productId;
    string comment;
  } messageComment;
}*;

Then we have to create a json response , therefore in the same file we create a json response file:
>{
    "message" : "ok"
}

Now launch the program:
>node restMock.js

Finally we make the request to the service and can see that we will return the correct answer if the input json is invalid at the port 8080.
