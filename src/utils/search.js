export const searchDesc = (array,id, field)=>{
    const i = array.find((p)=> p.id=== id)

    return i[field];
  }
