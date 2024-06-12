INSERT INTO user (id, username, password, role) VALUES (1, 'admin', '$2a$10$wuQLIafDI3E37//wfrTvf.evfq0v3/AxSWGkz5Ef6MWpY4x0LXm1m', 'ADMIN'); -- password: 'admin'
INSERT INTO user (id, username, password, role) VALUES (2, 'john', '$2a$10$tLY8EPU1vZLwWG57IXt8RO6z6ZCAXtR6GigFyL.kAJlxci0XtbtA6', 'USER'); -- password: 'john'

INSERT INTO sport (id, name) VALUES (1, 'Other');
INSERT INTO sport (id, name) VALUES (2, 'Football');

INSERT INTO address (id, country, city) VALUES (1, 'Poland', 'Warsaw');

INSERT INTO event (id, title, description, owner_id, sport_id, address_id) VALUES (1, 'Test event', 'Example description', 2, 2, 1);

