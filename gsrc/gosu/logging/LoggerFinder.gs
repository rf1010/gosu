package gosu.logging

class LoggerFinder {

  private static var _instance: LoggerFinder as readonly INSTANCE = new LoggerFinder()
  private construct() {}

  function findByCategoryName(name: String): Logger {
    return Logger.initLogger(name)
  }

  property get PLUGIN_CONTACT_SYSTEM(): Logger {
    return findByCategoryName("Plugin.ContactSystem")
  }

  property get API(): Logger {
    return findByCategoryName("API")
  }

  property get APPLICATION(): Logger {
    return findByCategoryName(Logger.ROOT_LOGGER_NAME)
  }

  property get DEV(): Logger {
    return findByCategoryName("DEV")
  }

  property get RULES(): Logger {
    return findByCategoryName("RuleEngine")
  }

  property get PLUGINS(): Logger {
    return findByCategoryName("Plugin")
  }

  property get MESSAGING(): Logger {
    return findByCategoryName("Messaging")
  }

  property get DATABASE(): Logger {
    return findByCategoryName("Server.Database")
  }

  property get PLUGIN_CLAIM_NUMBER_GENERATOR(): Logger {
    return findByCategoryName("Plugin.IClaimNumGenAdapter")
  }

  property get PLUGIN_POLICY_SEARCH(): Logger {
    return findByCategoryName("Plugin.IPolicySearchAdapter")
  }

  property get PLUGIN_POSTCODE_LOOKUP(): Logger {
    return findByCategoryName("Plugin.Postcode")
  }

  property get PLUGIN_CONTACT_SEARCH(): Logger {
    return findByCategoryName("Plugin.IContactSearchAdapter")
  }
}