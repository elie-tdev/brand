-- CREATE LOGIN USERS
CREATE USER onebrand_app_administrator LOGIN INHERIT IN ROLE onebrand_administrator_role ENCRYPTED PASSWORD 'olvidar';
CREATE USER onebrand_app_user LOGIN INHERIT IN ROLE onebrand_read_write_role ENCRYPTED PASSWORD 'olvidar';
CREATE USER onebrand_read_only_user LOGIN INHERIT IN ROLE onebrand_read_only_role ENCRYPTED PASSWORD 'olvidar';