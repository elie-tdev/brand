-- \c permanencelabs;

-- CREATE NOLOGIN PARENT ROLES
CREATE ROLE onebrand_administrator_role WITH NOLOGIN NOINHERIT;
CREATE ROLE onebrand_read_write_role WITH NOLOGIN NOINHERIT;
CREATE ROLE onebrand_read_only_role WITH NOLOGIN NOINHERIT;

-- ACCESS DB
REVOKE CONNECT ON DATABASE permanencelabs FROM PUBLIC;
GRANT CONNECT ON DATABASE permanencelabs TO onebrand_administrator_role;
GRANT CONNECT ON DATABASE permanencelabs TO onebrand_read_write_role;
GRANT CONNECT ON DATABASE permanencelabs TO onebrand_read_only_role;

-- ACCESS SCHEMA
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA onebrand, public TO onebrand_administrator_role;
GRANT USAGE ON SCHEMA onebrand, public TO onebrand_read_write_role;
GRANT USAGE ON SCHEMA onebrand, public TO onebrand_read_only_role;

-- GRANT ALL ON ADMIN ROLE; this is migration user
GRANT ALL ON SCHEMA onebrand TO onebrand_administrator_role;

-- SET ROLE DEFAULT PRIVILEGES
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA onebrand GRANT ALL ON TABLES TO onebrand_administrator_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA onebrand GRANT SELECT, INSERT, UPDATE ON TABLES TO onebrand_read_write_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA onebrand GRANT SELECT ON TABLES TO onebrand_read_only_role;

-- SET SEARCH_PATH
-- ALTER ROLE postgres SET search_path TO onebrand;
ALTER ROLE onebrand_administrator_role SET search_path TO onebrand, public;
ALTER ROLE onebrand_read_write_role SET search_path TO onebrand, public;
ALTER ROLE onebrand_read_only_role SET search_path TO onebrand, public;
