import http from '../../utils/request';

export const getUser = async (userId) => {
    return await http.get('/SystemManagement/Users/' + userId);
};

export const getUsers = async (paginationQueryParams) => {
    return await http.get('/SystemManagement/Users', {
        params: paginationQueryParams,
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

export const deleteUsers = async (deleteUserParams) => {
    return await http.delete('/SystemManagement/Users/', { data: deleteUserParams });
};
