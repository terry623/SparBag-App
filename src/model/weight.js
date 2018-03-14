if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}

function store_infor(
    username,
    kg,
    dep,
    arr,
    fly_way,
    fly_1,
    fly_2,
    fly_3,
    company,
    date,
    meet_start,
    meet_end,
    meet_place,
    money_type,
    money,
    remain_kg
) {
    const sql = `
        INSERT INTO Weights ($<this:name>)
        VALUES ($<username>, $<kg>, $<dep>, $<arr>, $<fly_way>, $<fly_1>, $<fly_2>, $<fly_3>,
             $<company>, $<date>, $<meet_start>, $<meet_end>, $<meet_place>, $<money_type>, $<money>, $<remain_kg>)
        RETURNING *
    `;
    return db.one(sql, {
        username,
        kg,
        dep,
        arr,
        fly_way,
        fly_1,
        fly_2,
        fly_3,
        company,
        date,
        meet_start,
        meet_end,
        meet_place,
        money_type,
        money,
        remain_kg
    });
}

function get_weight(username) {
    const sql = `
        SELECT *
        FROM Weights
        WHERE username = $<username>
    `;
    return db.any(sql, {
        username
    });
}

function search_by_num(fly_num, date) {

    var sql;
    if (fly_num == "") {
        sql = `
            SELECT *
            FROM Weights
            WHERE date = $<date>
        `;
    } else {
        sql = `
            SELECT *
            FROM Weights
            WHERE (fly_1 = $<fly_num> or fly_2 = $<fly_num> or fly_3 = $<fly_num>)
            and date = $<date>
        `;
    }

    return db.any(sql, {
        fly_num,
        date
    });
}

function search_by_place(dep, arr, date) {

    var sql;
    if (dep == '' || arr == '') {
        sql = `
        SELECT *
        FROM Weights
        WHERE date = $<date>
    `;
    } else {
        sql = `
        SELECT *
        FROM Weights
        WHERE dep = $<dep> and arr = $<arr> and date = $<date>
    `;
    }
    return db.any(sql, {
        dep,
        arr,
        date
    });
}

function search_by_id(id) {
    const sql = `
        SELECT *
        FROM Weights
        WHERE id = $<id>
    `;
    return db.one(sql, {
        id
    });
}

function update_remain_kg(id, remain_kg, ask_kg) {
    const sql = `
        UPDATE Weights
        SET remain_kg = $<result_kg>
        WHERE id = $<id>
        RETURNING *
    `;
    var result_kg = remain_kg - ask_kg;
    return db.one(sql, {
        id,
        result_kg
    });
}

function delete_weight_by_id(id) {
    const sql = `
        DELETE
        FROM Weights
        WHERE id = $<id>
        RETURNING *
    `;
    return db.one(sql, {
        id
    });
}

module.exports = {
    store_infor,
    get_weight,
    search_by_num,
    search_by_place,
    search_by_id,
    update_remain_kg,
    delete_weight_by_id
};