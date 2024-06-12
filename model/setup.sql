CREATE TABLE address (
    id              INTEGER AUTO_INCREMENT PRIMARY KEY,
    country         VARCHAR(50) NOT NULL,
    city            VARCHAR(50) NOT NULL,
    street          VARCHAR(50),
    building_number INTEGER,
    flat_number     INTEGER,
    postal_code     VARCHAR(10)
);

CREATE TABLE event (
    id                INTEGER AUTO_INCREMENT PRIMARY KEY,
    title             VARCHAR(50) NOT NULL,
    description       TEXT,
    owner_id          INTEGER NOT NULL,
    sport_id          INTEGER NOT NULL,
    address_id        INTEGER NOT NULL,
    latitude          DOUBLE,
    longitude         DOUBLE,
    modification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE participation (
    id       INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id  INTEGER NOT NULL,
    event_id INTEGER NOT NULL
);

CREATE TABLE sport (
    id   INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE user (
    id       INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    email    VARCHAR(50) UNIQUE,
    password VARCHAR(512) NOT NULL,
    role     ENUM('USER','ADMIN')
);

ALTER TABLE event
    ADD CONSTRAINT event_address_fk FOREIGN KEY (address_id)
        REFERENCES address (id);

ALTER TABLE event
    ADD CONSTRAINT event_sport_fk FOREIGN KEY (sport_id)
        REFERENCES sport (id);

ALTER TABLE event
    ADD CONSTRAINT event_user_fk FOREIGN KEY (owner_id)
        REFERENCES user (id);

ALTER TABLE participation
    ADD CONSTRAINT participation_event_fk FOREIGN KEY (event_id)
        REFERENCES event (id);

ALTER TABLE participation
    ADD CONSTRAINT participation_user_fk FOREIGN KEY (user_id)
        REFERENCES user (id);

