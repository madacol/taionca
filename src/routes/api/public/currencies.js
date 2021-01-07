import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

// List currencies
export const get =
    async (req, res) => {

        const {rows: currencies} = await query(
            'select * from currencies;'
        );

        res.json(
            currencies
        );
    }
