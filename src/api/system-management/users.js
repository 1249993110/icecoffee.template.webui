import http from '../../utils/request';

export const getUser = async (userId) => {
    return await http.get('/SystemManagement/Users/' + userId);
};

export const getUsers = async (queryParams) => {
    return await http.get('/SystemManagement/Users', {
        params: queryParams,
    });
};

export const addUser = async (addUserParams) => {
    return await http.post('/SystemManagement/Users/', addUserParams);
};

export const editUser = async (editUserParams) => {
    return await http.put('/SystemManagement/Users/', editUserParams);
};

export const deleteUser = async (userId) => {
    return await http.delete('/SystemManagement/Users/' + userId);
};

export const deleteUsers = async (userIds) => {
    return await http.delete('/SystemManagement/Users/', { data: userIds });
};

export const modifyUserPassword = async (userId, passwordHash) => {
    return await http.put(`/SystemManagement/Users/${userId}/Password`, passwordHash, { headers: { 'Content-Type': 'application/json' } });
};

export const getUserRoles = async (userId) => {
    return await http.get(`/SystemManagement/Users/${userId}/Roles`);
};

export const editUserRoles = async (userId, roleIds) => {
    return await http.put(`/SystemManagement/Users/${userId}/Roles`, roleIds);
};

export const editUserEnabled = async (userId, isEnabled) => {
    return await http.put(`/SystemManagement/Users/${userId}/Enabled`, isEnabled ? 'true' : 'false', { headers: { 'Content-Type': 'application/json' } });
};
