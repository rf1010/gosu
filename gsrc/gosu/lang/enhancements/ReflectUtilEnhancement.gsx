package gosu.lang.enhancements

uses gosu.functional.Invoke
uses gosu.typesystem.TypeSystemUtil
uses gw.lang.reflect.ReflectUtil
uses gw.util.concurrent.LockingLazyVar

enhancement ReflectUtilEnhancement : gw.lang.reflect.ReflectUtil {

  /**
   *  Obtains the value of a property from an object and coerces it into type A. If the property is not found
   *  or the value cannot be coerced to type, null is returned.
   *
   *  It is usually used to return the values of "private" fields. Use with caution: there must be a reason
   *  why a field is private.
   */
  @Param("obj", "The object from which the property is returned")
  @Param("propertyName", "The name of property to return")
  @Returns("The value of property as type A")
  static function getPropertyAsType_ext<A>(obj: Object, propertyName: String): A {
    return Invoke.safely(\ -> TypeSystemUtil.toType<A>(ReflectUtil.getProperty(obj, propertyName)))
  }

  /**
   *  Obtains the value of a function/method call and coerces it into type A. If the methodName is not found
   *  or the value cannot be coerced to type, null is returned.
   *
   *  It is usually used to invoke "private" functions and return their result.
   *  Use with caution: there must be a reason  why a method is private.
   */
  @Param("obj", "The object on which the method is invoked")
  @Param("methodName", "The name of method to invoke")
  @Returns("The value returned by a method as type A")
  static function invokeMethodAndReturnTypedResult_ext<A>(obj: Object, methodName: String, args: Object[]): A {
    return Invoke.safely(\ -> TypeSystemUtil.toType<A>(ReflectUtil.invokeMethod(obj, methodName, args)))
  }

  /**
   *  Wraps `getPropertyAsType_ext()` into a lazy variable (which gets evaluated only once, and the value is stored
   *  for subsequent requests. It is likely to be more efficient than reflective look up at with a frequent
   *  use on an object.
   */
  @Param("obj", "The object from which the property is returned")
  @Param("propertyName", "The name of property to return")
  @Returns("The lazy var which holds the value of propertyName as type A")
  static function getPropertyAsTypedLazyVar_ext<A>(obj: Object, propertyName: String): LockingLazyVar<A> {
    return LockingLazyVar.make<A>(\ -> getPropertyAsType_ext(obj, propertyName))
  }

  /**
   *  Wraps `invokeMethodAndReturnTypedResult_ext()` into a lazy variable (which gets evaluated only once,
   *  and the value is stored for subsequent requests. It is useful when calling expensive private functions
   *  on an object when the result does not change. Use with caution.
   */
  @Param("obj", "The object from which the property is returned")
  @Param("propertyName", "The name of property to return")
  @Returns("The lazy var which holds the value of propertyName as type A")
  static function invokeMethodAndReturnAsLazyVarTypedResult_ext<A>(obj: Object, methodName: String, args: Object[]):
      LockingLazyVar<A> {
    return LockingLazyVar.make<A>(\ -> invokeMethodAndReturnTypedResult_ext(obj, methodName, args))
  }
}
