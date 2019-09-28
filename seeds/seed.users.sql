BEGIN;

INSERT INTO users(user_name,email,password,first_name,last_name)
VALUES ('test','testing@test.com','Test123!','User','Testing');

COMMIT;