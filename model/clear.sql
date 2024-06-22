SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `address`;
DROP TABLE IF EXISTS `event`;
DROP TABLE IF EXISTS `participation`;
DROP TABLE IF EXISTS `sport`;
DROP TABLE IF EXISTS `user`;
SET FOREIGN_KEY_CHECKS = 1;

DROP TRIGGER IF EXISTS before_sport_delete;
DROP TRIGGER IF EXISTS prevent_duplicate_participation;
DROP TRIGGER IF EXISTS prevent_owner_participation;
DROP TRIGGER IF EXISTS delete_address_after_event;
DROP TRIGGER IF EXISTS prevent_start_date_after_end_date_insert;
DROP TRIGGER IF EXISTS prevent_start_date_after_end_date_update;
DROP TRIGGER IF EXISTS prevent_creation_of_past_events_insert;
DROP TRIGGER IF EXISTS prevent_creation_of_past_events_update;

DROP PROCEDURE IF EXISTS prevent_start_date_after_end_date_procedure;
DROP PROCEDURE IF EXISTS prevent_creation_of_past_events_procedure;
