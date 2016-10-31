### Run - wrapper for `gw.transaction.Transaction`

#### What
Useful abstractions which allow running functions with Guidewire bundles under
context of different users. This is particularly useful for Guidewire entity builders.

##### Note:
This class is applicable to the Guidewire platform and is not useful for
`gosu-lang` developers on the open-source version.

#### Why
Guidewire provides `gw.transaction.Transaction` class to handle programming cases
when an explicit bundle is required in the application code. These use cases are
documented extensively in the Guidewire documentation.

This class is an abstraction for the cases when a function, which requires a bundle,
also returns a value. This is typical for Guidewire entity builders, which require
a bundle but also return an entity object.

Additionally, "Run" is a bit faster to type than "Transaction". For this reason,
it is a separate class, rather than an enhancement on the existing "Transaction" type.

#### How
##### Without this class
```
import gw.transaction.Transaction

var result: A

Transaction.runWithNewBundle(\bundle -> {
  result = new XYXBuilder()
    .withA()
    .withB()
    .create(bundle)
}, user)

return result
```
##### With this class
```
import gosu.transaction.enhancements.Run

var result = Run.asUser(\bundle -> {
  new XYXBuilder()
    .withA()
    .withB()
    .create(bundle)
}, user)
```
