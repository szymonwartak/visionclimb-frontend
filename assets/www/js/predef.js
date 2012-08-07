Object.size = function(arr) {
	var size = 0, key;
	for(key in arr) {
		if(arr.hasOwnProperty(key)) size++
	}
	return size
}
