# js-simpleauth

Simple authentication API using [JavaScript](https://www.javascript.com/) and [MongoDB](https://www.mongodb.com/). In addition to that, the following [npm](https://www.npmjs.com/) packages were used:
* [bcryptjs](https://www.npmjs.com/package/bcrypt) - to allow hashing passwords, so they are not savedd as plain text in the DB
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - to allow jwt authentication
* [config](https://www.npmjs.com/package/config) - is used for global variables
* [express-validator](https://www.npmjs.com/package/express-validator) - to easily validate requests' body parameters
* [mongoose](https://www.npmjs.com/package/mongoose) - abstraction layer to interact with the database and create models

## Usage

1. Clone the project in your local folder with `git clone https://github.com/guigasparotto/js-simpleauth.git`
2. Open the project folder in your preferred editor - suggestion: [VS Code](https://code.visualstudio.com/)
3. Open the terminal and navigate to the app directory, then run `npm install` to install the dependencies required
4. In the `default.config` file, located in the `config ` folder, enter the DB connection string (instructions to create the DB below) and a JWT secret that will be used to authenticate in the API
5. Once the database is created, and the parameters are set in the `default.config` file, run `npm run server` to start the application, you should see the logs below
```
[nodemon] starting `node server.js`
Server started on port 5000
MongoDB connected...
```
 
## Create the Database

The application uses [MongoDB](https://www.mongodb.com/) as its database, in a free tier cloud cluster, running directly from MongoDB servers. To create a database, follow the instructions below:
1. Create an account on [MongoDB](https://www.mongodb.com/) website - it's free
2. In the **Projects** tab, create a new project (e.g. simpleauth) - leave the other option empty or as default
3. Inside the project, create a new cluster in the **Clusters** tab - the website will direct you to the subscription page, free is fine
4. The options in the cluster creation page can be left as default - in the **Cluster Tier** step, make sure **M0 Sandbox** is selected, which is free forever. Once you go ahead, it will take a few minutes until is all set.
5. In the left panel, under **Security**, select **Network Access** and add your IP to the list so you can access the database
6. Back to the **Clusters** page, once the cluster is created, click in the **Connect** button - add your IP address, and create a DB user by setting username, password and clicking in the create user button
7. In the **Choose a connection method** step, select **Connect your application** - the connection string will be displayed, copy it and paste in the `MongoURI` parameter, in the `default.json` file

## API

With the server running and the DB connected, the following endpoints are available - you can use [Postman](https://www.postman.com/) or the API client of your choice. The server runs on PORT 5000 by default, so in this case, the default API base address will be `http://localhost:5000`.
* POST `/api/auth` - Authentication, takes the parameters below and returns the user's token, which should be used to send requests to private endpoints.
```
{
    "email": "Enter a registered email",
    "password": "Enter your password"
}
```
* GET `/api/auth` - Retrieves current user's information. Authenticate the request with a header in the format `x-auth-token: [your-token]`
* POST `/api/users` - Creates a new user, the request doesn't require authentication and its body should contain the parameters below. It returns the user's token. 
```
{
    "name": "Enter your name",
    "email": "Enter your email",
    "password": "Enter your password"
}
```
* GET `/api/users` - Returns a list of all users recorded in the database. Authenticate the request with a header in the format `x-auth-token: [your-token]`
* PUT `/api/users` - Updates authenticated user's name and password - email can't be updated. Authenticate the request with a header in the format `x-auth-token: [your-token]`. Both paramaters are optional.
```
{
    "name": "Enter new name",
    "password": "Enter new password"
}
```
