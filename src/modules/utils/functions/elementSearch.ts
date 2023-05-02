const elementSearch = (e : any, termSetter : Function, resultSetter : Function, collection : any[], filterFunction : any ) => {
    let results = collection.filter(filterFunction)
    resultSetter(results)
    termSetter(e.target.value)
}

export default elementSearch;