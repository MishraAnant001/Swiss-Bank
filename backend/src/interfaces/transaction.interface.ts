export interface ITransaction{
    from_account:string,
    to_account:string,
    type:string,
    amount:number,
    description?:string
}