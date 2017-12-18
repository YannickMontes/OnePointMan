SELECT setval('public."GROUP_idgroup_seq"',1,FALSE);
SELECT setval('public."PINPOINT_idpinpoint_seq"', 1, FALSE);

INSERT INTO public."USER" (iduser, nom, prenom) VALUES (1, 'NIQUETA', 'Maman');
INSERT INTO public."USER" (iduser, nom, prenom) VALUES (2, 'Watson', 'Emma');
INSERT INTO public."USER" (iduser, nom, prenom) VALUES (3, 'Radcliffe', 'Daniel');
INSERT INTO public."USER" (iduser, nom, prenom) VALUES (4, 'QuifaitRonWeaslay', 'LacteurRoux');
INSERT INTO public."USER" (iduser,nom, prenom) VALUES (5, 'Smeagol', 'Gollum');
INSERT INTO public."USER" (iduser,nom, prenom) VALUES (6, 'LeSage', 'Samwise');
INSERT INTO public."USER" (iduser,nom, prenom) VALUES (7, 'LeFag', 'Frodon');

INSERT INTO public."GROUP" (nom) VALUES ('HarryPotter');
INSERT INTO public."GROUP" (nom) VALUES ('LOTR');
INSERT INTO public."GROUP" (nom) VALUES ('Female');
INSERT INTO public."GROUP" (nom) VALUES ('Male');

INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (2, 1);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (3, 1);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (4, 1);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (5, 2);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (6, 2);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (7, 2);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (1, 3);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (2, 3);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (3, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (4, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (5, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (6, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (7, 4);

INSERT INTO public."PINPOINT" (description, pinlt, pinlg, idgroup, idcreator, daterdv) VALUES ('slt sa va tu ??', 23, 45, 1, 2, now());
INSERT INTO public."PINPOINT" (description, pinlt, pinlg, idgroup, idcreator, daterdv) VALUES ('LE PP DES PD ', 54, 67, 2, 5, now());
INSERT INTO public."PINPOINT" (description, pinlt, pinlg, idgroup, idcreator, daterdv) VALUES ('EMMA WATSON IS HOT', 67, 33, 3, 2, now());
INSERT INTO public."PINPOINT" (description, pinlt, pinlg, idgroup, idcreator, daterdv) VALUES ('tous les memes', 23, 45, 4, 6, now());
INSERT INTO public."PINPOINT" (description, pinlt, pinlg, idgroup, idcreator, daterdv) VALUES ('LE PPPPPP DES PUUUUUTES', 23, 45, 2, 7, now());

-- insert de devon et vincent ds ts les groupes
﻿INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (1638237456238594, 1);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (1638237456238594, 2);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (1638237456238594, 3);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (1638237456238594, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (1638237456238594, 5);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (1638237456238594, 6);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (10210309534404438, 1);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (10210309534404438, 2);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (10210309534404438, 3);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (10210309534404438, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (10210309534404438, 5);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (10210309534404438, 6);


