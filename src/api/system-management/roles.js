import http from '../../utils/request';

export const getRole = async () => {
    return await http.get('/SystemManagement/Roles');
};

export const getRoles = async (paginationQueryParams) => {
    return await http.get('/SystemManagement/Roles', {
        params: paginationQueryParams,
    });
};

export const addRole = async (addRoleParams) => {
    return await http.post('/SystemManagement/Roles/', addRoleParams);
};

export const editRole = async (editRoleParams) => {
    return await http.put('/SystemManagement/Roles/', editRoleParams);
};

export const deleteRole = async (roleId) => {
    return await http.delete('/SystemManagement/Roles/' + roleId);
};

export const deleteRoles = async (deleteRoleParams) => {
    return await http.delete('/SystemManagement/Roles/', { data: deleteRoleParams });
};
