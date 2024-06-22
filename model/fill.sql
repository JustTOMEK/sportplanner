INSERT INTO user (id, username, password, role) VALUES (1, 'admin', '$2a$10$wuQLIafDI3E37//wfrTvf.evfq0v3/AxSWGkz5Ef6MWpY4x0LXm1m', 'ADMIN'); -- password: 'admin'
INSERT INTO user (id, username, password, role) VALUES (2, 'john', '$2a$10$tLY8EPU1vZLwWG57IXt8RO6z6ZCAXtR6GigFyL.kAJlxci0XtbtA6', 'USER'); -- password: 'john'

INSERT INTO sport (id, name) VALUES (1, 'Other');
INSERT INTO sport (id, name) VALUES (2, 'Football');
INSERT INTO sport (id, name) VALUES (3, 'Volleyball');
INSERT INTO sport (id, name) VALUES (4, 'Basketball');
INSERT INTO sport (id, name) VALUES (5, 'Hockey');
INSERT INTO sport (id, name) VALUES (6, 'Tennis');
INSERT INTO sport (id, name) VALUES (7, 'Golf');
INSERT INTO sport (id, name) VALUES (8, 'Rugby');
INSERT INTO sport (id, name) VALUES (9, 'Boxing');
INSERT INTO sport (id, name) VALUES (10, 'Wrestling');
INSERT INTO sport (id, name) VALUES (11, 'Cycling');

INSERT INTO address (id, country, city, street, building_number, postal_code) VALUES (1, 'Poland', 'Warsaw', 'ul. Stefana Batorego', '10a', '02-591');
INSERT INTO address (id, country, city, street, building_number, postal_code) VALUES (2, 'Poland', 'Cracow', 'ul. Władysława Reymonta', '20', '30-059');
INSERT INTO address (id, country, city, street, building_number, postal_code) VALUES (3, 'Poland', 'Warsaw', 'ul. Jana Kasprowicza', '119a', '01-949');

INSERT INTO event (id, title, description, owner_id, sport_id, address_id, latitude, longitude) VALUES (1, 'Amateur football match', 'Not only for professionals!', 1, 2, 1, 52.21294004217454, 21.011496065445016);
INSERT INTO event (id, title, description, owner_id, sport_id, address_id, latitude, longitude) VALUES (2, 'Basketball tournament', 'All skill levels welcome!', 2, 4, 2, 50.06365397844488, 19.9117641340657);
INSERT INTO event (id, title, description, owner_id, sport_id, address_id) VALUES (3, 'Bike trip to the Kampinos National Park', 'Be prepared for the mud', 2, 11, 3);

INSERT INTO participation (user_id, event_id) VALUES (2, 1);
INSERT INTO participation (user_id, event_id) VALUES (1, 2);

