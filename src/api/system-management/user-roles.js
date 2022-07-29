import http from '../../utils/request';

export const getUserRoles = async (userId) => {
    return await http.get('/SystemManagement/UserRoles/' + userId);
};

export const editUserRoles = async (userId, roleIds) => {
    return await http.put('/SystemManagement/UserRoles/' + userId, roleIds);
};
