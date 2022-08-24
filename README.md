**NC-News**

**Hosted version:**

A hosted version of this project can be found here: https://craigs-nc-news.herokuapp.com/api

**Project summary:**

This project is a backend api allowing for interaction with a PostgreSQL database. The database consists of data relating primarily to news articles as well as users inerations with these articles such as posting comments and upvoting. It is designed so that users can access data regarding the articles, article topics, users and comments which can be retrieved using the numerous endpoints which allow for various ways of filtering and presenting the data.

**Cloning this project:**

This project caan be forked and cloned from here: https://github.com/ccccc170/BE-Project-NC-News

**Minimum Versions:**

Ensure that these versions of Nodejs and PostgreSQL are installed to run this project:

- node v18.2.0
- postgres v12.11

**Installing dependencies:**

The follwoing dependencies should be installed in order to ensure this project can be used:

- dotenv v16.0.0
- express v4.18.1
- pg v8.7.3
- pg-format v1.0.4

Ensure the follwoing dev dependencies are installed for further development purposes:

- husky v7.0.4,
- jest v27.5.1
- jest-extended v2.0.0
- jest-sorted v1.0.14
- supertest v6.2.4

Running the command `npm i` after cloning and opening the project should ensure that all dependencies are installed.

**Creating .env files:**

In order to run this project, environment variables must to added to .env files as follows:

- You will need to create two .env files for your project: `.env.test` and `.env.development`.
- Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names).
- Double check that these .env files are .gitignored.

**Seeding local databases:**

Run the script `npm run setup-dbs` to create both the test and development databases. Run the script `npm run seed` to seed your working database (this will be either the development or test database depending on the value of NODE_ENV).

**Running tests:**

This project was created adhering to TDD. The `__tests__` directory includes all of the tests that were written and checked to ensure the quality of this project within two files, `app.test.js` amd `utils.test.js`. These tests were written using the Jest testing framework for JavaScript and SuperTest. The project's tests make use of `jest`, `jest-extended` and `jest-sorted` as well as `supertest`. With the dev dependencies outlined above installed, the test suite can be run using the script `npm test`, follwed by a test file name to run one of the specific files. Adding `.only` to any test or describe block within the file will allow for specific tests to be run.
