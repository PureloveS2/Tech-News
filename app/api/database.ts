import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 5
});
 
// News route
export async function getRecentNews() {
    let conn;
    try {
        conn = await pool.getConnection();

        const recentNews = await conn.query("SELECT * FROM News ORDER BY id DESC LIMIT 10");

        return recentNews;
 
    } catch(err) {
        console.log("Database operation error:", err);
        throw err;
    } finally {
        if (conn) {
            conn.release();
            console.log("Connection released to pool.");
        };
    };
};

export async function getAllNewsPaginatedBy10(rowsToSkip: number) {
    let conn;
    try {
        conn = await pool.getConnection();

        const recentNews = await conn.query("SELECT * FROM News ORDER BY id DESC LIMIT 10 OFFSET ?", [rowsToSkip]);

        return recentNews;
 
    } catch(err) {
        console.log("Database operation error:", err);
        throw err;
    } finally {
        if (conn) {
            conn.release();
            console.log("Connection released to pool.");
        };
    };
};

export async function postNoticeToDB(noticeTitle: string, noticeSubtitle: string, noticeBody: string, noticeImageUrl: string, categorie: string) {
    let conn;
    try {
        conn = await pool.getConnection();

        const recentNews = await conn.query("INSERT INTO News (noticeTitle, noticeSubtitle, noticeBody, noticeImageUrl, categorie) VALUES (?, ?, ?, ?, ?)", [noticeTitle, noticeSubtitle, noticeBody, noticeImageUrl, categorie]);

        return recentNews;
 
    } catch(err) {
        console.log("Database operation error:", err);
        throw err;
    } finally {
        if (conn) {
            conn.release();
            console.log("Connection released to pool.");
        }
    }
}

// Login route
export async function getUserPassword(username: string) {
    let conn;
    try {
        conn = await pool.getConnection();

        const recentNews = await conn.query("SELECT password FROM Users WHERE username = ?", [username]);

        return recentNews;
 
    } catch(err) {
        console.log("Database operation error:", err);
        throw err;
    } finally {
        if (conn) {
            conn.release();
            console.log("Connection released to pool.");
        }
    }
}


async function executeDatabaseOperations() {
    let conn;
    try {
        conn = await pool.getConnection(); // Get a connection from the pool

        // --- SELECT Query ---
        const rows = await conn.query("SELECT id, name FROM your_table_name WHERE status = ?", ["active"]);
        console.log("Selected Rows:", rows);

        // --- INSERT Query (with parameters for security) ---
        const res = await conn.query("INSERT INTO your_table_name (name, status) VALUES (?, ?)", ["New Entry", "pending"]);
        console.log("Insert Result:", res); // res will contain { affectedRows: 1, insertId: ..., warningStatus: 0 }

    } catch (err) {
        console.error("Database operation error:", err);
        throw err; // Re-throw to handle higher up
    } finally {
        if (conn) {
            conn.release(); // Release connection back to the pool
            console.log("Connection released to pool.");
        }
    }
}

// Call the async function
// selectRecentNews()
//     .then(() => console.log("All database operations attempted."))
//     .catch((err) => console.error("Overall operation failed:", err))
//     .finally(() => {
//         // Optional: End the pool when your application is shutting down
//         // pool.end();
//         // console.log("Connection pool ended.");
//     });
