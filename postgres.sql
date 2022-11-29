CREATE TABLE test (
  id SERIAL PRIMARY KEY, 
  countNum TEXT NOT NULL
);

INSERT INTO test (countNum) VALUES ('test');

CREATE TABLE feedback (
  id SERIAL PRIMARY key,
  advice varchar(100)
);

CREATE TABLE users(
id SERIAL PRIMARY KEY,
userEmails TEXT NOT NULL,
userfNames TEXT NOT NULL,
userlNames TEXT NOT NULL,
userPwords TEXT NOT NULL
);

INSERT INTO users (userEmails, userfNames, userlNames, userPwords) VALUES ('test@email.com', 'john', 'doe', 'hashedPassword');