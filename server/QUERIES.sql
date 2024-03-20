CREATE TABLE IF NOT EXISTS users(
    uid varchar(255) primary key,
    role varchar(10),
    fname varchar(64),
    lname varchar(64),
    email varchar(128)
);

CREATE TABLE IF NOT EXISTS  short (
	id SERIAL PRIMARY KEY,
	question TEXT,
	answer TEXT,
	sec INT,
	points INT,
	type VARCHAR(16)
);
CREATE TABLE IF NOT EXISTS  multiple (
	id SERIAL PRIMARY KEY,
	question TEXT,
	option1 VARCHAR(255),
	option2 VARCHAR(255),
	option3 VARCHAR(255),
	option4 VARCHAR(255),
	answer VARCHAR(255),
	sec INT,
	points INT,
	type VARCHAR(16)
	);
CREATE TABLE IF NOT EXISTS tf (
	id SERIAL PRIMARY KEY,
	question TEXT,
	answer TEXT,
	sec INT,
	points INT,
	type VARCHAR(16)
);
CREATE TABLE IF NOT EXISTS quizzes(
    quizid SERIAL PRIMARY KEY,
    uid varchar(255),
    tname varchar(255),
	mid INT,
	sid INT,
	tfid INT,
    created TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid)
);
CREATE TABLE IF NOT EXISTS mclist(
	quizid int,
	mid INT,
	qnum INT,
	FOREIGN KEY (mid) REFERENCES multiple(id) ON DELETE CASCADE,
	FOREIGN KEY (quizid) REFERENCES quizzes(quizid) ON DELETE CASCADE,
	PRIMARY KEY(quizid,mid)
);
CREATE TABLE IF NOT EXISTS slist(
	quizid int,
	sid INT,
	qnum INT,
	FOREIGN KEY (sid) REFERENCES short(id) ON DELETE CASCADE,
	FOREIGN KEY (quizid) REFERENCES quizzes(quizid) ON DELETE CASCADE,
	PRIMARY KEY(quizid,sid)
);

CREATE TABLE IF NOT EXISTS tflist(
	quizid int,
	tfid INT,
	qnum INT,
	FOREIGN KEY (tfid) REFERENCES tf(id) ON DELETE CASCADE,
	FOREIGN KEY (quizid) REFERENCES quizzes(quizid) ON DELETE CASCADE,
	PRIMARY KEY(quizid,tfid)
)

CREATE TABLE IF NOT EXISTS submitted (
	id SERIAL PRIMARY KEY,
	questionid INT NOT NULL,
	qtype VARCHAR(16) NOT NULL,
	correct BOOLEAN NOT NULL,
	points INT NOT NULL,
	submitted VARCHAR(255),
	quizid INT NOT NULL,
	uid VARCHAR(255) NOT NULL,
	FOREIGN KEY (quizid) REFERENCES quizzes(quizid) ON DELETE CASCADE,
	FOREIGN KEY (uid) REFERENCES users(uid)
)