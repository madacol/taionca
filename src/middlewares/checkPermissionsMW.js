// @ts-check

/**
 * Validate if `userPermissions` contains all `permissionsRequired`
 *
 * @param {number[]} permissionsRequired - List of `permission_id` to be validated
 * @param {number[]} userPermissions - List of `permission_id` the user has
 *
 * @return {boolean}
 */
const checkPermissions = (permissionsRequired, userPermissions) => {
    return permissionsRequired.every(permissionRequired => {  // All permissionsRequired must pass validation
        return userPermissions.includes(permissionRequired);
    })
}

/**
 * @param {number[]} permissionsRequired
 * @param {{session: {user: {permissions: number[]}}}} req
 * @param {*} res
 * @param {*} next
 */
const checkPermissions_semiMW = async (permissionsRequired, req, res, next) => {
    const {permissions: userPermissions} = req.session.user;

    const isAuthorized = checkPermissions(permissionsRequired, userPermissions);
    if (isAuthorized) return next();

    res.statusCode=403;
    res.json({
        error: "No está autorizado para realizar esta acción",
        log: permissionsRequired
    })
}

/**
 * Pass as arguments all permissions you need to validate
 *
 * @param  {...number} permissionsRequired - List of `permission_id` to be validated
 *
 * @return {import("polka").Middleware}
 */
function checkPermissionsMW (...permissionsRequired) {
    // @ts-ignore
    return (req, res, next) => checkPermissions_semiMW(permissionsRequired, req, res, next);
}

export default checkPermissionsMW;
