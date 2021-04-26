import fetch from "node-fetch";

/**
 * Validate if `userPermissions` contains all `permissionsRequired`
 *
 * @param {number[]} permissions_ids - List of `permission_id` to be validated
 * @param {number[]} userPermissions - List of `permission_id` the user has
 *
 * @return {boolean}
 */
export const checkPermissions = (permissions_ids, userPermissions) => {
    return permissions_ids.every(permission_id => {  // All *permissions_ids* must pass validation
        return userPermissions.includes(permission_id);
    })
}

/**
 * currency_code should not be received from frontend, is a vulnerability
 * se debe hacer previamente un query para obtener la moneda de la ODT
 */
export async function getRate(odt_currency_code, expense_currency_code){
    if (odt_currency_code === expense_currency_code) {
        return 1;
    }
    const url = `https://bolivarparalelo.com/api/rate/${odt_currency_code}/${expense_currency_code}`;
    console.log({url});
    const response = await fetch(url);
    const rates = await response.json();
    return (rates.buy + rates.sell) / 2;
}