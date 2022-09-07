export interface UserModel {
    id: number,
    userId?: string,
    password?: string,
    email?: string,
    mobile?: string,
    homepage?: string,
    idNO?: string,
    birthDate?: number,
    avatar?: string
}

export interface UserQo {
    sortPropertyName?: string,
    sortAscending?: boolean,
    userIdOrMobile?: string,
    current: number,
    pageSize: number
}

export interface PagerModel {
    content?: Array<any>,
    pageSize: number,
    current: number,
    total?: number
}