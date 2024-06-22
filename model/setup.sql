CREATE TABLE user (
    id       INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    email    VARCHAR(50) UNIQUE,
    password VARCHAR(512) NOT NULL,
    role     ENUM('USER','ADMIN')
);

CREATE TABLE sport (
    id   INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE address (
    id              INTEGER AUTO_INCREMENT PRIMARY KEY,
    country         VARCHAR(50) NOT NULL,
    city            VARCHAR(50) NOT NULL,
    street          VARCHAR(50),
    building_number VARCHAR(10),
    flat_number     VARCHAR(10),
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
    modification_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    start_date        TIMESTAMP NOT NULL,
    end_date          TIMESTAMP NOT NULL,
    CONSTRAINT event_user_fk FOREIGN KEY (owner_id) REFERENCES user (id),
    CONSTRAINT event_sport_fk FOREIGN KEY (sport_id) REFERENCES sport (id),
    CONSTRAINT event_address_fk FOREIGN KEY (address_id) REFERENCES address (id)
);

CREATE TABLE participation (
    id       INTEGER AUTO_INCREMENT PRIMARY KEY,
    event_id INTEGER NOT NULL,
    user_id  INTEGER NOT NULL,
    UNIQUE (user_id, event_id),
    CONSTRAINT participation_event_fk FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE,
    CONSTRAINT participation_user_fk FOREIGN KEY (user_id) REFERENCES user (id)
);


DELIMITER //

CREATE TRIGGER change_deleted_sport_to_other
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

CREATE TRIGGER delete_address_after_event
AFTER DELETE ON event
FOR EACH ROW
BEGIN
    DELETE FROM address WHERE id = OLD.address_id;
END //

CREATE TRIGGER prevent_start_date_after_end_date_insert
BEFORE INSERT ON event
FOR EACH ROW
BEGIN
    CALL prevent_start_date_after_end_date_procedure(NEW.start_date, NEW.end_date);
END //

CREATE TRIGGER prevent_start_date_after_end_date_update
BEFORE UPDATE ON event
FOR EACH ROW
BEGIN
    CALL prevent_start_date_after_end_date_procedure(NEW.start_date, NEW.end_date);
END //

CREATE TRIGGER prevent_creation_of_past_events_insert
BEFORE INSERT ON event
FOR EACH ROW
BEGIN
    CALL prevent_creation_of_past_events_procedure(NEW.end_date);
END //

CREATE TRIGGER prevent_creation_of_past_events_update
BEFORE UPDATE ON event
FOR EACH ROW
BEGIN
    CALL prevent_creation_of_past_events_procedure(NEW.end_date);
END //

CREATE PROCEDURE prevent_start_date_after_end_date_procedure(IN new_start_date TIMESTAMP, IN new_end_date TIMESTAMP)
BEGIN
    DECLARE msg VARCHAR(255);

    IF new_start_date > new_end_date THEN
        SET msg = 'An event cannot start after it ended.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;
END //

CREATE PROCEDURE prevent_creation_of_past_events_procedure(IN end_date TIMESTAMP)
BEGIN
    DECLARE msg VARCHAR(255);

    IF end_date <= CURRENT_TIMESTAMP THEN
        SET msg = 'An event that ended cannot be created.';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;
END //

DELIMITER ;
