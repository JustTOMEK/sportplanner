INSERT INTO user (username, password, role) VALUES ('admin', '$2a$10$wuQLIafDI3E37//wfrTvf.evfq0v3/AxSWGkz5Ef6MWpY4x0LXm1m', 'ADMIN'); -- password: 'admin'
INSERT INTO user (username, password, role) VALUES ('john', '$2a$10$tLY8EPU1vZLwWG57IXt8RO6z6ZCAXtR6GigFyL.kAJlxci0XtbtA6', 'USER'); -- password: 'john'

INSERT INTO sport (name) VALUES ('Other');
INSERT INTO sport (name) VALUES ('Football');

INSERT INTO address (country, city) VALUES ('Poland', 'Warsaw');

INSERT INTO event (title, owner_id, sport_id, address_id) VALUES ('Test event', 2, 2, 1);

