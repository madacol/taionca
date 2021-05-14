import {notifications} from "./stores"
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

/**
 * @param {string} msg message to notify
 */
export function notify(title, subtitle, kind="error", caption=undefined) {

    const newNotification = {title, subtitle, kind, caption};
    let newIndex;

    notifications.update(notificationsQueue => {
        newIndex = notificationsQueue.length;
        return [...notificationsQueue, newNotification]
    })
    setTimeout(() => {
        notifications.update(notificationsQueue => {
            delete notificationsQueue[newIndex];
            return (notificationsQueue.filter(x=>x).length > 0) // checking if there is any notification active
                ? notificationsQueue
                : []
        })
    }, 5000);
}

export async function apiFetch (url, options={}) {

    let data, error, success, redirect;
    try {
        const response = await fetch(url, options);
        ({error, success, redirect, ...data} = await response.json());
    } catch (err) {
        notify("Error", err.message, "error", "asdasd");
        throw err;
    }
    // if (redirect) {
    //     goto
    // }
    if (error) {
        notify(error, "", "error");
        throw new Error(error);
    }
    if (success) {
        notify(success, "", "success");
    }
    return data;
}

export const api = {
    get: apiFetch,
     post: async (url, bodyObject, headers={}, options={}) =>
        await apiFetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', ...headers},
            body: JSON.stringify(bodyObject),
            ...options
        }),
    patch: async (url, bodyObject, headers={}, options={}) =>
        await apiFetch(url, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json', ...headers},
            body: JSON.stringify(bodyObject),
            ...options
        }),
    delete: (url, options={}) => apiFetch(url, {method: 'DELETE', ...options})
}

/**
 * Examples
 * 
 * GET: `const users = await api.get('api/users')`
 * POST: `await api.post('api/users', newUser)`
 * PATCH: `await api.patch('api/user/123', modifiedUser)`
 * DELETE: `await api.delete('api/user')`
 */
