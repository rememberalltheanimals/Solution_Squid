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
userPwords TEXT NOT NULL,
emailList bit
);

INSERT INTO users (userEmails, userfNames, userlNames, userPwords, emailList) VALUES ('test@email.com', 'john', 'doe', 'hashedPassword', 1);

CREATE TABLE discussion (
  id SERIAL PRIMARY key,
  post varchar(100)
);

INSERT INTO discussion (post) VALUES ('This is the original post');