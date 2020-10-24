import { compose } from "compose-middleware";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

export const post = compose(
    checkPermissionsMW(1,2),
    (req, res) => {
        res.json({success: 'Yeah!, usuario tiene los permisos con ids 1 y 2 para ver este mensaje!'})
    }
)