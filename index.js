function configureObjectExtensions() {
   Object.prototype.isSubClassOf = function (parent) {
      return this.prototype instanceof parent || this === parent;
   }
   Object.prototype.toJson = function (replacer = null, space = null) {
      return JSON.stringify(this, relacer, space)
   }
}

export default configureObjectExtensions()

