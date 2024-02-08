# Simple Notes App with React, Node, Postgres
A simple project to refresh my memory on React, Node and explore TypeScript.

## To run server:
- CD `notes-app-server`
- Cmd: `npm start`

## To run frontend:
- CD `notes-app`
- Cmd: `npm start`

## Database Configuration:
- Using ElephantSQL
- Create table with SQL by clicking on the instance, then left panel will have `Browser` tab to click.
- Create the table with desired attributes (ex):
```
CREATE TABLE public."Note" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT
);
```
- Populate table then with desired attributes (ex):
```
INSERT INTO public."Note" (title, content)
VALUES ('test title', 'test content bla bla');
```

Then configure server endpoints.
