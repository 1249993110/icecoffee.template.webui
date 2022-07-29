import http from '../../utils/request';

export const getRoleMenus = async (roleId) => {
    return await http.get('/SystemManagement/RoleMenus/' + roleId);
};

export const editRoleMenus = async (roleId, menuIds) => {
    return await http.put('/SystemManagement/RoleMenus/' + roleId, menuIds);
};
