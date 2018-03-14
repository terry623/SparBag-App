require('../../config.js');
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);

const schemaSql = `
    DROP TABLE IF EXISTS Users;
    DROP TABLE IF EXISTS Weights;
    DROP TABLE IF EXISTS Reserve;

    CREATE TABLE Users (
        id               serial PRIMARY KEY NOT NULL,
        "username"       varchar(30) NOT NULL,
        "email"          varchar(30) NOT NULL,
        "password"       varchar(30) NOT NULL,
        "passportnumber" varchar(30) NOT NULL,
        "about_me"       varchar(5000),
        "check_item"     boolean DEFAULT TRUE,
        "rule_1"         varchar(5000),
        "rule_2"         varchar(5000),
        "birthday"       varchar(30) NOT NULL,
        "select_country" integer DEFAULT 0,
        "phonenumber"    varchar(30) NOT NULL,
        "select_money"   integer DEFAULT 0,
        "fb"             varchar(30) NOT NULL
    );

    CREATE TABLE Weights (
        id              serial PRIMARY KEY NOT NULL,
        "username"      varchar(30) NOT NULL,
        "kg"            integer,
        "dep"           varchar(30) NOT NULL,
        "arr"           varchar(30) NOT NULL,
        "fly_way"       varchar(30) NOT NULL,
        "fly_1"         varchar(30) NOT NULL,
        "fly_2"         varchar(30) NOT NULL,
        "fly_3"         varchar(30) NOT NULL,
        "company"       varchar(30) NOT NULL,
        "date"          varchar(30) NOT NULL,
        "meet_start"    varchar(30) NOT NULL,
        "meet_end"      varchar(30) NOT NULL,
        "meet_place"    varchar(30) NOT NULL,
        "money_type"    varchar(30) NOT NULL,
        "money"         integer,
        "remain_kg"     integer
    );

    CREATE TABLE Reserve (
        id               serial PRIMARY KEY NOT NULL,
        "weight_id"      integer,
        "lend"           varchar(30) NOT NULL,
        "borrow"         varchar(30) NOT NULL,
        "ask_time"       varchar(30) NOT NULL,
        "ask_kg"         integer,
        "status"         varchar(30) NOT NULL
    );
`;

db.none(schemaSql).then(() => {
    console.log('Schema Create!');
    pgp.end();
}).catch(err => {
    console.log('Error Creating Schema!', err);
});