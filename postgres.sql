CREATE TABLE test (
  id SERIAL PRIMARY KEY, 
  countNum TEXT NOT NULL
);

INSERT INTO test (countNum) VALUES ('test');

CREATE TABLE userEmails(
id SERIAL PRIMARY KEY,
userEmails TEXT NOT NULL
);

INSERT INTO userEmails (userEmails, userNames) VALUES ('test@email.com', 'john doe');