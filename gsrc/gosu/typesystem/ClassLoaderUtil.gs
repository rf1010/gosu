package gosu.typesystem

uses gosu.logging.Logger
uses java.lang.Class
uses java.lang.ClassLoader
uses java.lang.Iterable
uses java.lang.Thread
uses java.util.Map
uses java.util.Set
uses java.util.Vector

class ClassLoaderUtil {

  final static var _logger = Logger.finder.API

  /**
   *  Returns classes loaded by the given class loader.
   */
  static function getClassesLoadedByClassLoader(classLoader: ClassLoader): Iterable {
    _logger.trace(\ -> "Starting")
    var classLoaderClass = classLoader.Class

    while (classLoaderClass != java.lang.ClassLoader) {
      classLoaderClass = classLoaderClass.Superclass
      _logger.debug(\ -> "Looking for classloader type; superclass=${classLoaderClass}")
    }

    var classesField = classLoaderClass.getDeclaredField("classes")
    classesField.setAccessible(true)
    var classesValues = classesField.get(classLoader) as Vector
    var classes = classesValues.toList()
    _logger.debug(\ -> "Obtained ${classes.Count} classes loaded by classLoader=${classLoader}")
    var result = classes
    _logger.debug(\ -> "Returning result=${result}")
    _logger.trace(\ -> "Finished")
    return result
  }

  /**
   *  Returns classes loaded by the class loader associated with the current thread.
   */
  static property get LoadedClassesByClassLoader(): Map<ClassLoader, Iterable> {
    _logger.trace(\ -> "Starting")
    var result: Map<ClassLoader, Iterable> = {}
    var classLoader = Thread.currentThread().ContextClassLoader
    _logger.debug(\ -> "Current's thread classLoader=${classLoader}")
    while (classLoader != null) {
      var listOfClasses = getClassesLoadedByClassLoader(classLoader)
      result.put(classLoader, listOfClasses)
      _logger.debug(\ -> "Found ${listOfClasses.Count} loaded by classLoader=${classLoader}")
      classLoader = classLoader.Parent
    }
    _logger.trace(\ -> "Finished")
    return result
  }

  /**
   *  Returns all classes loaded by class loaders.
   */
  static property get LoadedClasses(): List {
    _logger.trace(\ -> "Starting")
    var result = LoadedClassesByClassLoader.Values.flatten().toList()
    _logger.trace(\ -> "Finished")
    return result
  }

  /**
   *  Returns the set of interfaces supported by a class, including its superclasses
   */
  static function getClassInterfaces(clz: Class): Set<Class> {
    var result: Set<Class> = {}
    while (clz != null) {
      var supportedInterfaces = clz.Interfaces
      if (supportedInterfaces.HasElements) {
        result.addAll(supportedInterfaces.toSet())
      }
      clz = clz.Superclass
    }
    return result
  }
}