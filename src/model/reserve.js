if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}


function store_relation(weight_id, lend, borrow, ask_time, ask_kg) {
    const status = "pending-booking";
    const sql = `
        INSERT INTO Reserve ($<this:name>)
        VALUES ($<weight_id>, $<lend>, $<borrow>, $<ask_time>, $<ask_kg>, $<status>)
        RETURNING *
    `;
    return db.one(sql, {
        weight_id,
        lend,
        borrow,
        ask_time,
        ask_kg,
        status
    });
}

function search_reserve(lend, borrow, weight_id) {

    const sql = `
        SELECT *
        FROM Reserve
        WHERE lend = $<lend> and borrow = $<borrow> and weight_id = $<weight_id>
    `;
    return db.any(sql, {
        lend,
        borrow,
        weight_id
    });
}

function search_reserve_by_weight_id(weight_id) {

    const sql = `
        SELECT *
        FROM Reserve
        WHERE weight_id = $<weight_id>
    `;
    return db.any(sql, {
        weight_id
    });
}

function search_reserve_by_borrow(borrow) {

    const sql = `
        SELECT *
        FROM Weights a, Reserve b
        where b.borrow = $<borrow> and a.id = b.weight_id
    `;
    return db.any(sql, {
        borrow
    });
}

function change_to_approve(id) {
    var message = "approved-booking";
    const sql = `
        UPDATE Reserve
        SET status = $<message>
        WHERE id = $<id>
        RETURNING *
    `;
    return db.one(sql, {
        id,
        message
    });
}

function change_to_reject(id) {
    var message = "canceled-booking";
    const sql = `
        UPDATE Reserve
        SET status = $<message>
        WHERE id = $<id>
        RETURNING *
    `;
    return db.one(sql, {
        id,
        message
    });
}

module.exports = {
    store_relation,
    search_reserve,
    search_reserve_by_weight_id,
    search_reserve_by_borrow,
    change_to_approve,
    change_to_reject
};