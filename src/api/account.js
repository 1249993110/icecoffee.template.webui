import http from '../utils/request';

/**
 * 通过 Cookie 登录
 * @returns 
 */
export const signInWithCookie = (model) => {
    return http.post('/Account/SignInWithCookie', model);
};

/**
 * 通过 Cookie 注销
 * @returns 
 */
 export const signOutWithCookie = () => {
    return http.delete('/Account/SignOutWithCookie');
};

/**
 * 获取用户信息
 * @returns 
 */
 export const getUserInfo = () => {
    return http.get('/Account/UserInfo');
};

/**
 * 获取用户菜单
 * @returns 
 */
 export const getUserMenus = () => {
    return http.get('/Account/UserMenus');
};