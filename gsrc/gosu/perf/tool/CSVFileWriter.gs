package gosu.perf.tool

uses gosu.logging.Logger
uses java.util.Date
uses java.io.FileWriter
uses java.lang.System

class CSVFileWriter {

  final static var _logger = Logger.finder.DEV
  final static var _instance: CSVFileWriter as INSTANCE = new CSVFileWriter()
  final static var _fileName = "performance-statistics"
  var _fileLocation = "/tmp/log/"

  private construct() {
  }

  /**
   *  Writes an event to a CSV file.
   */
  function write(event: PerfEvent) {
    using(var writer = getFileWriter(event)) {
      writer.append(new Date(event.DateTime).asString_ext("yyyy-MM-dd HH:mm:ss.SSS"))
      writer.append(",")
      writer.append(event.BusinessId)
      writer.append(",")
      writer.append(event.ServerId)
      writer.append(",")
      writer.append(event.ClassName)
      writer.append(",")
      writer.append(event.FunctionName)
      writer.append(",")
      writer.append(event.Duration as String)
      writer.append(System.lineSeparator())
    }
  }

  private function getFileWriter(event: PerfEvent): FileWriter {
    return new FileWriter(_fileLocation + getFileName(event), true)
  }

  private static function getFileName(event: PerfEvent): String {
    var currentDate = new Date().asString_ext("yyyy-MM-dd")
    var serverName = event.ServerId ?: "Unknown"
    return "${_fileName}-${serverName}-${currentDate}.csv"
  }
}