INSERT INTO user (username, password, role) VALUES ('john', '$2a$10$tLY8EPU1vZLwWG57IXt8RO6z6ZCAXtR6GigFyL.kAJlxci0XtbtA6', 'USER'); -- password: 'john'

INSERT INTO sport (name) VALUES ('Other');
INSERT INTO sport (name) VALUES ('Football');

INSERT INTO address (country, city) VALUES ('Poland', 'Warsaw');

INSERT INTO event (title, owner_id, sport_id, address_id) VALUES ('Test event', 1, 2, 1);

