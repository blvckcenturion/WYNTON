const elementSearch = (e : any, termSetter : Function, resultSetter : Function, collection : any[], filterFunction : any ) => {
    if (e.target.value.trim()){
        let results = collection.filter(filterFunction)
        resultSetter(results)
    } else {
        resultSetter(null)
    }
    termSetter(e.target.value)
}

export default elementSearch;