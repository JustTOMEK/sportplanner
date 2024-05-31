CREATE TABLE address (
    id              INTEGER NOT NULL,
    country         VARCHAR2(50 CHAR) NOT NULL,
    city            VARCHAR2(50 CHAR) NOT NULL,
    street          VARCHAR2(50 CHAR),
    building_number INTEGER,
    flat_number     INTEGER,
    postal_code     VARCHAR2(10 CHAR)
);

ALTER TABLE address ADD CONSTRAINT address_pk PRIMARY KEY (id);

CREATE TABLE event (
    id          INTEGER NOT NULL,
    title       VARCHAR2(50) NOT NULL,
    description CLOB,
    owner_id    INTEGER NOT NULL,
    sport_id    INTEGER NOT NULL,
    address_id  INTEGER NOT NULL,
    latitude    NUMBER,
    longitude   NUMBER
);

ALTER TABLE event ADD CONSTRAINT event_pk PRIMARY KEY (id);

CREATE TABLE participation (
    id       INTEGER NOT NULL,
    user_id  INTEGER NOT NULL,
    event_id INTEGER NOT NULL
);

ALTER TABLE participation ADD CONSTRAINT participation_pk PRIMARY KEY (id);

CREATE TABLE sport (
    id   INTEGER NOT NULL,
    name VARCHAR2(20) NOT NULL
);

ALTER TABLE sport ADD CONSTRAINT sport_pk PRIMARY KEY (id);

CREATE TABLE user (
    id            INTEGER NOT NULL,
    username      VARCHAR2(20) NOT NULL,
    email         VARCHAR2(50),
    password_hash VARCHAR2(512) NOT NULL
);

ALTER TABLE user ADD CONSTRAINT user_pk PRIMARY KEY (id);

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

