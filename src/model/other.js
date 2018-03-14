if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}


function show_all_user() {
    const sql = `
        SELECT *
        FROM Users
    `;
    return db.any(sql);
}

function show_all_weight() {
    const sql = `
        SELECT *
        FROM Weights
    `;
    return db.any(sql);
}

function show_all_reserve() {
    const sql = `
        SELECT *
        FROM Reserve
    `;
    return db.any(sql);
}

module.exports = {
    show_all_user,
    show_all_weight,
    show_all_reserve
};