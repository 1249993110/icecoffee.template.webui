import http from '../../utils/request';

export const getRole = async (id) => {
    return await http.get('/SystemManagement/Roles/' + id);
};

export const getRoles = async () => {
    return await http.get('/SystemManagement/Roles');
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

export const getRoleMenus = async (roleId) => {
    return await http.get(`/SystemManagement/Roles/${roleId}/Menus`);
};

export const editRoleMenus = async (roleId, menuIds) => {
    return await http.put(`/SystemManagement/Roles/${roleId}/Menus`, menuIds);
};

export const getRolePermissions = async (roleId) => {
    return await http.get(`/SystemManagement/Roles/${roleId}/Permissions`);
};

export const editRolePermissions = async (roleId, permissionIds) => {
    return await http.put(`/SystemManagement/Roles/${roleId}/Permissions`, permissionIds);
};
