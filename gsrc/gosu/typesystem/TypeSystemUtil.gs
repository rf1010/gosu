package gosu.typesystem

uses gw.lang.reflect.IConstructorInfo
uses gw.lang.reflect.TypeSystem
uses gosu.functional.Validation
uses gw.lang.reflect.IType

/**
 *  A collection of functions to support operations with TypeSystem, i.e. get an instance of a class by class name.
 */
class TypeSystemUtil {

  /**
   *  Returns the class constructor in the input.
   */
  @Param("className", "The fully qualified name of the class")
  @Param("numberOfParams", "The number of parameters in a constructor")
  @Returns("A constructor info object which allows to initialize the class")
  static function getConstructorByClassName(className: String, numberOfParams: int): IConstructorInfo {
    var gosuClass = TypeSystem.getByFullName(className)
    var callableConstructor = gosuClass.TypeInfo.getCallableConstructor(new IType[numberOfParams])
    Validation.require(\ -> callableConstructor != null, "Public constructor for ${className} is not found")
    return callableConstructor
  }

  /**
   *  Returns the class constructor in the input.
   */
  @Param("className", "The fully qualified name of the class")
  @Returns("A constructor info object which allows to initialize the class")
  static function getConstructorByClassName(className: String): IConstructorInfo {
    return getConstructorByClassName(className, 0)
  }

  /**
   *  Returns an instance of a class by class name and parameters.
   */
  @Param("className", "The fully qualified name of the class")
  @Param("params", "An array of parameters to pass to constructor")
  @Returns("An instance of a class")
  static function getInstanceByClassName(className: String, params: Object[]): gw.lang.reflect.gs.IGosuObject {
    var callableConstructor = getConstructorByClassName(className, params.length)
    var gosuClassInstance = callableConstructor.getConstructor().newInstance( params ) as gw.lang.reflect.gs.IGosuObject
    Validation.require(\ -> gosuClassInstance != null, "Failed to initialize an object of class ${className}")
    return gosuClassInstance
  }

  /**
   *  Returns an instance of a class by class name.
   */
  @Param("className", "The fully qualified name of the class")
  @Returns("An instance of a class")
  static function getInstanceByClassName(className: String): gw.lang.reflect.gs.IGosuObject {
    return getInstanceByClassName(className, new Object[0])
  }

  /**
   *  Returns the class name (with package name) from type.
   */
  @Param("t", "IType")
  @Returns("Full class name")
  static function getClassNameFromType(type: IType): String {
    var fullClassName = type.DisplayName
    return fullClassName.match("(.+?)\\s*?(<.+?>)?\\s*?(\\(.+?\\))?").Groups?.first()
  }

  /**
   *  Returns true if any of the declared methods of a class has the UnstableAPI annotation.
   */
  @Param("iType", "IType")
  @Returns("True if any of the declared methods have the UnstableAPI annotation")
  static function hasUnstableAPI(iType: IType): boolean {
    return iType.TypeInfo.Methods.hasMatch(\method ->
        method.DeclaredAnnotations.hasMatch(\annotation ->
            annotation.Type == gw.lang.UnstableAPI))
  }
}