import http from '../../utils/request';

export const getRolePermissions = async (roleId) => {
    return await http.get('/SystemManagement/RolePermissions/' + roleId);
};

export const editRolePermissions = async (roleId, permissionIds) => {
    return await http.put('/SystemManagement/RolePermissions/' + roleId, permissionIds);
};
