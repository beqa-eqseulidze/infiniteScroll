export interface IUser{
    id:string|number,
    firstName:string,
    lastName:string,
    profilPic:string,
    description:string,
    friendsId?:number[]|string[]|[]
}

