exports.filterObj = (body , ...requiredFields) => {
    const newObj = {}
    Object.keys(body).forEach(el => {
        if(requiredFields.includes(el)){
            newObj[el] = body[el]
        }
    })
    return newObj
} 