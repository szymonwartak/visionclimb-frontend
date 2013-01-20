//////////////
// helpers

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
