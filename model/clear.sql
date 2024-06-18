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
