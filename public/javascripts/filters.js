var app = angular.module('filters', []);

app.filter('noDuplicatesArr', function(){
	return function(arr) {
		var array = [], freq = [], prev; 

		arr.sort();
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] !== prev){
				array.push(arr[i]);
				freq.push(1);
			}	else {
				b[b.length-1]++;
			}

			prev = arr[i];
		}
		// returns array w/ no duplicates and the frequencies 
		return [array, freq];
	}
});

app.filter('filterByTags', function() {
  return function(posts, tags) {
    return posts.filter(function(post) {
      for (var i in post.tags) {
        if (tags.indexOf(post.tags[i]) != -1) {
          return true;
        }
    	}
    	return false;
		});
  };
});