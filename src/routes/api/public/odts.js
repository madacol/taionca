import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

// List currencies
export const post =
    async (req, res) => {
        console.log(req.body)
        const {rows: currencies} = await query(
            'select name, id_currency from currencies;'
        );

        res.json(
            currencies
        );
    }
