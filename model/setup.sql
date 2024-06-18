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


DELIMITER //

CREATE TRIGGER before_sport_delete
BEFORE DELETE ON sport
FOR EACH ROW
BEGIN
    DECLARE other_sport_id INT;

    -- Get the id of the sport 'Other'
    SELECT id INTO other_sport_id
    FROM sport
    WHERE name = 'Other'
    LIMIT 1;

    -- Update the sport_id in event table to 'Other' sport id
    UPDATE event
    SET sport_id = other_sport_id
    WHERE sport_id = OLD.id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER prevent_duplicate_participation
BEFORE INSERT ON participation
FOR EACH ROW
BEGIN
    DECLARE rowcount INT;
    DECLARE msg VARCHAR(255);

    SELECT COUNT(*)
    INTO rowcount
    FROM participation
    WHERE event_id = NEW.event_id AND user_id = NEW.user_id;

    IF rowcount > 0 THEN
        SET msg = 'A user cannot sign up for the same event more than once.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER prevent_owner_participation
BEFORE INSERT ON participation
FOR EACH ROW
BEGIN
    DECLARE rowcount INT;
    DECLARE msg VARCHAR(255);

    SELECT COUNT(*)
    INTO rowcount
    FROM event
    WHERE id = NEW.event_id AND owner_id = NEW.user_id;

    IF rowcount > 0 THEN
        SET msg = 'A user cannot sign up for the event that they own.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;
END //

DELIMITER ;

DELIMITER //
