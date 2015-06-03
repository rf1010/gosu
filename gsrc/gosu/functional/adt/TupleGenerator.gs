package gosu.functional.adt

uses com.guidewire.pl.config.PLConfigResourceKeys
uses gosu.functional.Validation
uses gosu.logging.Logger
uses org.apache.commons.io.FileUtils

uses java.io.File
uses java.io.FileWriter

/**
 *   Generates Tuple gosu classes and tests.
 */
class TupleGenerator {

  private static final var _instance: TupleGenerator as readonly INSTANCE = new TupleGenerator()
  private static final var _logger: Logger as readonly logger = Logger.finder.APPLICATION

  // defaults, if not set by withXYZ()
  private var _basePackageName: String as readonly BasePackageName = ""
  private var _relativePackageName: String as readonly RelativePackageName = "gosu.functional.adt"
  private var _arity: int as readonly Arity = 5

  // derived paths
  private var _gosuOutputPath = PLConfigResourceKeys.GOSU_CLASSES_DIR.Dir
      ?.resolveSingleDir().AbsolutePath
  private var _testOutputPath = PLConfigResourceKeys.GOSU_TEST_DIR.Dir
      ?.resolveSingleDir().AbsolutePath
  private var _basePackagePath = convertToPlatformIndependentPath(_basePackageName)
  private var _relativePackagePath = convertToPlatformIndependentPath(_relativePackageName)
  private var _thisDisplayName = this.IntrinsicType.DisplayName

  private construct() {
  }

  /**
   *  Sets the base package name (usually, customer prefix, i.e. com.sampleorg).
   */
  @Param("basePackageName", "Base package name")
  function withBasePackageName(basePackageName: String): TupleGenerator {
    _logger.debug(\ -> "Setting base package to ${basePackageName}")
    _basePackageName = basePackageName
    return this
  }

  /**
   *  Sets the relative package name (e.g. gosu.functional.adt).
   */
  function withRelativePackageName(relativePackageName: String): TupleGenerator {
    _logger.debug(\ -> "Setting relative package to ${RelativePackageName}")
    _relativePackageName = relativePackageName
    return this
  }

  /**
   * Sets arity (number of dimensions). Minimum: 2, default: 5.
   */
  function withMaxArity(arity: int): TupleGenerator {
    Validation.require(\ -> arity >= 2, "Tuple arity (size) must be at least 2.")
    _logger.debug(\ -> "Setting arity to ${arity}")
    _arity = arity
    return this
  }

  /**
   *  Invokes the generator after all properties are set using withXYZ() (or the defaults are used).
   */
  function run() {
    (2.._arity).each(\a -> {

      _logger.info(\ -> "Generating ${FullPackagePath}.Tuple${a}")
      // generate gosu classes
      using (var writer = getGosuClassFileWriter(a) ) {
        generateTupleSourceFile(a, writer)
      }

      _logger.info(\ -> "Generating ${FullPackagePath}.Tuple${a}Test")
      // generate gosu test classes
      using (var writer = getGosuTestFileWriter(a) ) {
        generateTupleTestSourceFile(a, writer)
      }
    })
  }

  /**
   *  Generate a source file for Tuple of arity (size) a.
   */
  private function generateTupleSourceFile(a: int, writer: FileWriter) {
    _logger.trace(\ -> "Starting to generate Tuple${a}")
    gosu.functional.adt.Tuple.render(writer, _basePackageName, a)
  }

  /**
   *  Generate a source file for Tuple Test of arity (size) a.
   */
  private function generateTupleTestSourceFile(a: int, writer: FileWriter) {
    _logger.trace(\ -> "Starting to generate Tuple${a}")
    gosu.functional.adt.TupleTest.render(writer, _basePackageName, a)
  }

  /**
   *  Converts package names (with dots) into file paths.
   */
  private static function convertToPlatformIndependentPath(packageName: String): String {
    return packageName.replaceAll("\\.", File.separator)
  }

  /**
   *  Returns a file writer for a Gosu class.
   */
  private function getGosuClassFileWriter(a: int): FileWriter {
    _logger.trace(\ -> "Starting")
    var fs = File.separator
    var dirPath = { _gosuOutputPath, _basePackagePath, _relativePackagePath }
        .where(\elm -> elm.HasContent).join(File.separator)
    var fileName = "Tuple${a}.gs"
    _logger.debug(\ -> "Getting a FileWriter for dirPath = ${dirPath}, fileName = ${fileName}")
    return getWriter(dirPath, fileName)
  }

  /**
   *  Returns a file writer for a GUnit test.
   */
  private function getGosuTestFileWriter(a: int): FileWriter {
    _logger.trace(\ -> "Starting")
    var dirPath = { _testOutputPath, _basePackagePath, _relativePackagePath }
        .where(\elm -> elm.HasContent).join(File.separator)
    var fileName = "Tuple${a}Test.gs"
    _logger.debug(\ -> " Getting a FileWriter for dirPath = ${dirPath}, fileName = ${fileName}")
    return getWriter(dirPath, fileName)
  }

  /**
   *  Returns a writer for a generated file.
   */
  private function getWriter(dirName: String, fileName: String): FileWriter {
    var fs = File.separator
    var outputDir = new File("${dirName}")
    _logger.debug(\ -> "Making a directory = ${outputDir}")
    FileUtils.forceMkdir(outputDir)
    _logger.debug(\ -> "Returning a FileWriter")
    var outputFile = new File("${dirName}${fs}${fileName}")
    return new FileWriter(outputFile)
  }

  private property get DisplayName(): String {
    return toString()
  }

  /**
   *   toString implementation using arity, package name, etc.
   */
  override function toString(): String {
    return "${_thisDisplayName}(${Arity}, ${FullPackagePath})"
  }

  private property get FullPackagePath(): String {
    var basePath = _basePackagePath.HasContent ? "${_basePackagePath}." : ""
    return "${basePath}${RelativePackageName}"
  }
}