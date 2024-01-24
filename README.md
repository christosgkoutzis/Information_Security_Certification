<h1 align="center">Stock Price Checker 💰</h1>
<h3 align="center">A full stack web platform, that gives users the opportunity to view stocks, check their price and like their favorite ones.</h3>

<p align="center"> FreeCodeCamp's source code: https://github.com/freeCodeCamp/boilerplate-project-stockchecker/</p>
<p align="center"> View FreeCodeCamp's deployment: https://stock-price-checker.freecodecamp.rocks/</p>

<p align="center">
  <img src="for-readme/home.png" alt="dashboard" width=80%>
</p>

<p align="center">
    <img src="for-readme/mongo.png" alt="mongo" width=10%>
    <img src="for-readme/express.png" alt="express" width=10%>
    <img src="for-readme/react.png" alt="react" width=10%>
    <img src="for-readme/node.png" alt="node" width=10%>
</p>

## Features

This web application accepts as input from the user a stock name and a like button (checkbox input), checks if the stock name belongs to a valid stock through <a href=https://stock-price-checker-proxy.freecodecamp.rocks/>this</a> FreeCodeCamp's stock API and gives as output:

  -  The official name of the stock and its current price from the API
  
  -  The number of likes it has from the application's database  

## Installation

To try out this project yourself (instructions for bash CLI):

  1)  Clone this repo typing <code>git clone https://github.com/christosgkoutzis/Information_Security_Certification.git</code> 

  2)  Change branch to this project typing <code>git checkout origin/Stock_Price_Checker</code>

  3)  Install required node packages typing <code>npm install</code> (If you haven't installed nodejs and/or npm you also need to run <code>sudo apt install nodejs npm</code>)

  4)  Create a <code>.env</code> and save the following environmental variables for the project:
      <code>NODE_ENV=test</code>
      <code>PORT=3000</code>
      <code>DB=<your_database's_connection_string></code>

  5)  Run the unit tests and deploy the project in debugging mode (applying changes of code asychronously) using <code>npm run dev</code> command

## Development

In this project, I developed the backend part of the platform in <code>api.js</code> and <code>db-connection.js</code> files, a bunch of security features in <code>server.js</code> file, the database models in <code>models.js</code> and 10 unit tests that ensure the required functionality of the project in <code>tests/2_functional-tests.js</code> file. More specifically:

<details>
<summary>
Unit tests
</summary> <br />
  
In <code>tests/2_functional-tests.js</code> file, there is a suite of 5 functional unit tests, executed right after the <code>run</code> command and developed using chai-mocha assertion JS libraries. They execute and check the correct functionality of the following tasks:

  - Sending a GET request to the API and successfully returning stockData as an object
  
  - Sending the correct data (POST request) to the database, according to the condition of the checkbox like button (checked or not)
  
  - Ensuring that only 1 like in a specific stock per IP is accepted
    
  - Giving the correct relative likes (rel_likes) of the 2 stocks when the user submits the second form of the app
  
</details>

<details>
<summary>
Backend Development
</summary> <br />
  
  - The <code>db-connection.js</code> ensures the initialization of the database and the connection to the server
  
  - The <code>models.js</code> holds the stock schema of the non relational MongoDB database, showing the name and the likes of the stocks.
  
  - The <code>api.js</code> implements the functionality mentioned in the unit tests, interacting with the database

</details>

<details>
<summary>
Security Features
</summary> <br />
  
The website, uses HelmetJS library to implement Content Security Policy (CSP) that only allows loading of scripts and CSS from your server.

</details>
