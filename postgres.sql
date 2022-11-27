CREATE TABLE test (
  id SERIAL PRIMARY KEY, 
  countNum TEXT NOT NULL
);

INSERT INTO test (countNum) VALUES ('test');

CREATE TABLE feedback (
  id SERIAL PRIMARY key,
  advice varchar(100)
);

CREATE TABLE userEmails(
id SERIAL PRIMARY KEY,
userEmails TEXT NOT NULL,
userNames TEXT NOT NULL
);

INSERT INTO userEmails (userEmails, userNames) VALUES ('test@email.com', 'john doe');

CREATE TABLE discussion (
  id SERIAL PRIMARY key,
  post varchar(100)
);

INSERT INTO discussion (post) VALUES ('This is the original post');