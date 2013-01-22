//////////////
// helpers

var USERID = Math.random().toString(36).substr(2,16)
// use instead of array push (merge strategy = replace)
var mergeIfFound = function(array, object) {
	var isFound = false
	for(var o1 in array) {
		if(object.id == array[o1].id) {
			isFound = true
			array[o1] = object

		}
	}
	if(!isFound) array.push(object)
}

Object.size = function(arr) {
	var size = 0, key;
	for(key in arr) {
		if(arr.hasOwnProperty(key)) size++
	}
	return size
}

var arrayObjectToString = function(array) {
	return arrayToString(array, function(obj) { return "{"+obj.toString()+"}" })
}

var arrayToString = function(array, indexToStringFunction) {
	indexToStringFunction = indexToStringFunction || function(obj) { return obj }
	var result = "["
	for(var i1 in array) {
		if(array.hasOwnProperty(i1))
			result += indexToStringFunction(array[i1])+", "
	}
	if(Object.size(array)>0) result = result.substring(0,result.length-2)
	return result+"]"
}
