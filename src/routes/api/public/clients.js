import { query } from "../../../db";

// List clients
export const get =
    async (req, res) => {

        const {rows: clients} = await query(
            `select * from clients;`
        );

        res.json({
            clients
        });
    }
