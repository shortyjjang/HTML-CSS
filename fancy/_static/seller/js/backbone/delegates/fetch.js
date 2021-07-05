FancyBackbone.Delegates.fetch = function(object, fetchArgs) {
  var deferred = $.Deferred();
  var objectPromise = object.fetch(fetchArgs);
  objectPromise.done(function() {
    deferred.resolve(object);
  });
  objectPromise.fail(function() {
    deferred.reject(arguments);
  });
  return deferred.promise();
};