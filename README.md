# Simple CRUD App with React, Node, Postgres

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

## Import CSV to Postgresql (Heroku host ex.):

- Connect to Heroku CLI and create app to hold DB
  `heroku create <app name> --region eu`

- Provision db:
  `heroku addons:create heroku-postgresql:mini`

- Push table to PG db:
  `heroku pg:psql -a < tableschema.sql` (Name the .sql file what you want)
- (In separate terminal) Login into DB: `psql --host=<host> --port=5432 --username=<username> --password --dbname=<dbname>` (details from db instance in Heroku > dashboard > app name > resources > addon tile for postgres > settings > credentials)
- Drop, check or redo permissions:

```
DROP SCHEMA public CASCADE; <-- drop tables
CREATE SCHEMA public; <-- This reinstates the permissions so you can redo push step above
```

- Verify table created with `\dt` command once logged into DB in separate terminal.

- Enter heroku postgres interface on cli: `heroku pg:psql -a <app name>`

- Migrate CSV to database (in order of the column headers): `\copy "Ioc"(id,url,created_at,updated_at,removed_date,status,report_method_one,report_method_two,form,host,follow_up_date,follow_up_count,comments) FROM './src/data/iocs.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER;`

`\copy "Form"(name,url) FROM './src/data/forms.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER;`

`\copy "Host"(name,email) FROM './src/data/hosts.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER;`

- If you forget to set, in the prisma schema, to accept null values (use `?` after type in model) you can modify the tables:

```
ALTER TABLE "<name>"
ALTER COLUMN <column name> DROP NOT NULL;
```

- Finally, set the highest ID in the tables manually so that you can create records, since you are populating ids with the csv data. (note the double quotes around table naming schemes that I had to use in this series of steps.) `COALESCE` is not required here but good practice.

```
SELECT setval('"Ioc_id_seq"', COALESCE((SELECT MAX(id)+1 FROM "Ioc"), 1), false);
SELECT setval('"Host_id_seq"', COALESCE((SELECT MAX(id)+1 FROM "Host"), 1), false);
SELECT setval('"Form_id_seq"', COALESCE((SELECT MAX(id)+1 FROM "Form"), 1), false);

```

## Seed db with prisma:
- `npx prisma db push` (generate your Prisma client and create the database tables.)
- Verify creation of tables with `\dt`
- View table properties `\d+ "Table name"`
- Exit with `\q`
- `npx prisma db seed` (currently not functional. Seed with migrate csv step above in pgsql terminal through heroku.)
- Issues establishing connection to Database or DATABASE_URL not found error from schema, run `npx prisma generate` again.
- Adding migrations:
````
npx prisma migrate dev --name <migration-name> --create-only
```
- Then edit the migration in PostgreSQL (this allow null values ie optional)
```
ALTER TABLE myTable ALTER COLUMN myColumn DROP NOT NULL;
```
- Thenk apply migration:
```
npx prisma migrate dev
```

To do:
- Fix seed command Prisma

- Add ZF call to server with functions.
- Complete ZF ui and options on show page (email type, flash messages, ect.)

- Test server
- Test client

- Deploy with minikube (finish db-deployment.yaml)

- Data dashboard

- Option/low priority (style app)
- Option/low priority (restrict file type attachment to image)
- Optional? Protect routes to edit/delete. (all routes but home page.)
