import rs from "randomstring"

export const generateString =(len:number,charset:string[])=>{
    return rs.generate({
        length:len,
        charset:charset
    })
}