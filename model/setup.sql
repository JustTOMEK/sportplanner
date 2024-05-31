CREATE TABLE address (
    id              INTEGER NOT NULL,
    country         VARCHAR(50) NOT NULL,
    city            VARCHAR(50) NOT NULL,
    street          VARCHAR(50),
    building_number INTEGER,
    flat_number     INTEGER,
    postal_code     VARCHAR(10)
);

ALTER TABLE address ADD CONSTRAINT address_pk PRIMARY KEY (id);

CREATE TABLE event (
    id          INTEGER NOT NULL,
    title       VARCHAR(50) NOT NULL,
    description TEXT,
    owner_id    INTEGER NOT NULL,
    sport_id    INTEGER NOT NULL,
    address_id  INTEGER NOT NULL,
    latitude    DOUBLE,
    longitude   DOUBLE
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
    name VARCHAR(20) NOT NULL
);

ALTER TABLE sport ADD CONSTRAINT sport_pk PRIMARY KEY (id);

CREATE TABLE user (
    id            INTEGER NOT NULL,
    username      VARCHAR(20) NOT NULL,
    email         VARCHAR(50),
    password_hash VARCHAR(512) NOT NULL
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

