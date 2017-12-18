﻿DROP TABLE IF EXISTS "USER" CASCADE;
DROP TABLE IF EXISTS "GROUP" CASCADE;
DROP TABLE IF EXISTS "PINPOINT" CASCADE;
DROP TABLE IF EXISTS "DRAWING" CASCADE;
DROP TABLE IF EXISTS "FRIENDS" CASCADE;
DROP TABLE IF EXISTS "USER_GROUP" CASCADE;
DROP TABLE IF EXISTS "TRACK_POS" CASCADE;

CREATE TABLE "USER"(
    iduser bigint PRIMARY KEY,
    isconnected boolean,
    nom varchar(50),
    prenom varchar(50),
    msg varchar(255),
    lastconnexion timestamp with time zone,
    lt numeric(10,8),
    lg numeric(11,8),
    dateposition timestamp with time zone
);

CREATE TABLE "GROUP"(
    idgroup serial PRIMARY KEY,
    nom varchar(70),
    creationdate date
);

CREATE TABLE "PINPOINT"(
    idpinpoint serial PRIMARY KEY,
    description varchar(255),
    pinlt numeric(10,8),
    pinlg numeric(11,8),
    daterdv timestamp with time zone,
    dateexpiration timestamp with time zone,
    idcreator bigint REFERENCES "USER" (iduser),
    idgroup integer REFERENCES "GROUP" (idgroup)
);

CREATE TABLE "DRAWING"(
    iddrawing serial PRIMARY KEY,
    description varchar(255),
    nelg numeric(11,8),
    swlg numeric(11,8),
    swlt numeric(10,8),
    nelt numeric(10,8),
    actif boolean DEFAULT true,
    zoom integer,
    img bytea,
    idcreator bigint REFERENCES "USER" (iduser),
    idgroup integer REFERENCES "GROUP" (idgroup)
);

CREATE TABLE "FRIENDS"(
    iduser1 bigint REFERENCES "USER" (iduser),
    iduser2 bigint REFERENCES "USER" (iduser),
    CONSTRAINT pk_FRIENDS PRIMARY KEY (iduser1, iduser2)
);

CREATE TABLE "USER_GROUP"(
    sharesposition boolean DEFAULT true,
    iscreator boolean DEFAULT false,
    istracking boolean DEFAULT false,
    userglt numeric(10,8),
    userglg numeric(11,8),
    dateposition timestamp with time zone,
    iduser bigint REFERENCES "USER" (iduser),
    idgroup integer REFERENCES "GROUP" (idgroup),
    CONSTRAINT pk_USER_GROUP PRIMARY KEY (iduser, idgroup)
);

CREATE TABLE "TRACK_POS"(
    lg numeric(11,8),
    lt numeric(10,8),
    idgroup integer REFERENCES "GROUP" (idgroup),
    iduser bigint REFERENCES "USER" (iduser),
    timepos timestamp with time zone,
    CONSTRAINT pk_TRACK_POS PRIMARY KEY (iduser, idgroup, timepos)

)