//POST : Issue

Explanation:

We import the Issue model from where it's defined (adjust the path if necessary).
The createIssue function is an asynchronous function that takes the Koa context (ctx) as an argument.
It extracts the title and description from the request body (ctx.request.body).
Basic input validation is performed to ensure both fields are present.
Issue.create() uses the Sequelize model to insert a new record into the issues table in your MySQL database.
On successful creation, we set the HTTP status to 201 Created and send the newly created issue object back in the response body.
If any error occurs during the process (e.g., database error), we log the error and send a 500 Internal Server Error response.