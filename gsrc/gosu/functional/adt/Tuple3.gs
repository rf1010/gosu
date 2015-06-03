package gosu.functional.adt

/**
 *  Generated code: do not edit directly. To generate Tuple classes,
 *  use TupleGenerator.
 *
 *  Sample usage: TupleGenerator.INSTANCE.withBasePackageName("com.abc").withMaxArity(5).run()
 *  will generate:
 *    com.abc.gosu.functional.adt.Tuple2
 *    com.abc.gosu.functional.adt.Tuple3
 *    com.abc.gosu.functional.adt.Tuple4
 *    com.abc.gosu.functional.adt.Tuple5
 *
 *  Idiomatic Tuple usage example:
 *   function WidgetXYZVisible(claim: Claim): boolean {
 *     // Tuple helper
 *     var Tuple = \faultRating: typekey.FaultRating, lossCause: typekey.LossCause -> Tuple2.apply(faultRating, lossCause)
 *
 *     // combinations of Fault Rating and Loss Cause when the widget is visible
 *     var businessRules = {
 *       Tuple(TC_NOFAULT, TC_ABANDONMENT),
 *       Tuple(TC_SPLIT_EXT, TC_ABANDONMENT),
 *       Tuple(TC_NOFAULT, TC_ANIMAL)
 *     }
 *
 *     // construct the type for a claim in question
 *     var claimCondition = Tuple(claim.FaultRating, claim.LossCause)
 *
 *     // return the result
 *     return businessRules.contains(claimCondition)
 *   }
 *
 *   Tuples can be constructed by calling a parametrized constructor:
 *      var t = new Tuple2<String, Integer>("A", 1)
 *
 *    or by invoking the static apply factory function:
 *      var t = Tuple2.apply("A", 1)
 *
 *    Static apply factory function is preferrable since in most cases the typesystem can reliably defect
 *    argument types.
 *
 *    Invoking a public constructor with no parameter specification will result in a Tuple object with parameters
 *    initialized to Object types:
 *      var t = new Tuple2("A", 1)
 *    is equivalent to:
 *      var t = new Tuple2<Object, Object>("A", 1)
 *
 */

uses gosu.typesystem.TypeSystemUtil

class Tuple3<T1, T2, T3> implements ITuple {

  private var _hashCode: int
  
  private var e1: T1 as readonly Element1  
  private var e2: T2 as readonly Element2  
  private var e3: T3 as readonly Element3  

  final override property get size(): int { return 3 }

  construct(final elem1: T1, final elem2: T2, final elem3: T3 ) {
    e1 = elem1
    e2 = elem2
    e3 = elem3
  }

  static function apply<E1, E2, E3>(final e1: E1, final e2: E2, final e3: E3): Tuple3 {
    var params = { e1, e2, e3 }.toArray()
    var className = TypeSystemUtil.getClassNameFromType(Tuple3)
    return TypeSystemUtil.getInstanceByClassName(className, params) as Tuple3
  }

  override function hashCode(): int {
    final var const = 17
    var result = _hashCode
    if (result == 0) {
      result = const
      result = 31 * result + (e1 == null ? const : e1.hashCode())
      result = 31 * result + (e2 == null ? const : e2.hashCode())
      result = 31 * result + (e3 == null ? const : e3.hashCode())
      _hashCode = result
    }
    return result
  }

  override function equals(that: Object): boolean {
    if (that === this) return true
    if (!(that typeis Tuple3)) {
      return false
    }
    return
      
        ((that as Tuple3).e1 typeis T1 or (that as Tuple3).e1 == null) and
        ((that as Tuple3).e2 typeis T2 or (that as Tuple3).e2 == null) and
        ((that as Tuple3).e3 typeis T3 or (that as Tuple3).e3 == null) and
        (that as Tuple3).e1 == this.e1 and
        (that as Tuple3).e2 == this.e2 and
        (that as Tuple3).e3 == this.e3
      
  }

  override function toString(): String {
    return "Tuple3<${typeof e1}, ${typeof e2}, ${typeof e3}>(${e1}, ${e2}, ${e3})"
  }
}