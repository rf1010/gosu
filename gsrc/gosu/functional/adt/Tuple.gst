<%@ params(basePackageName: String, arity: int) %>
<% var base =  basePackageName.HasContent ? "${basePackageName}." : "" %>
<% var applyArityMapper =
    \mappingFunction: block(i: java.lang.Integer): String -> (1..arity).map(mappingFunction).join(", ") %>
<% var genericsDef =        \ -> applyArityMapper(\e -> "T" + e) %>
<% var constructorParams =  \ -> applyArityMapper(\e -> "final elem" + e + ": T" + e) %>
<% var applyGenericDef =    \ -> applyArityMapper(\e -> "E" + e) %>
<% var applyTypeParamDef =  \ -> applyArityMapper(\e -> "final e" + e + ": E" + e) %>
<% var applyParamsArray =   \ -> applyArityMapper(\e -> "e" + e) %>
<% var toStringTypeDef  =   \ -> applyArityMapper(\e -> "\${typeof e" + e +"}" )%>
<% var toStringMethodDef  = \ -> applyArityMapper(\e -> "\${e" + e +"}" )%>
<% var toStringDef        = \ -> "\"Tuple" + arity + "<" + toStringTypeDef() + ">(" + toStringMethodDef() + ")\"" %>
package ${base}gosu.functional.adt

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

uses ${base}gosu.typesystem.TypeSystemUtil

class Tuple${arity}<${genericsDef()}> implements ITuple {

  private var _hashCode: int
  <% for ( var e in (1..arity) ) { %>
  private var e${e}: T${e} as readonly Element${e}  <% } %>

  final override property get size(): int { return ${arity} }

  construct(${constructorParams()} ) {
    <% for (var e in (1..arity-1)) { %>e${e} = elem${e}
    <% } %>e${arity} = elem${arity}
  }

  static function apply<${applyGenericDef()}>(${applyTypeParamDef()}): Tuple${arity} {
    var params = { ${applyParamsArray()} }.toArray()
    var className = TypeSystemUtil.getClassNameFromType(Tuple${arity})
    return TypeSystemUtil.getInstanceByClassName(className, params) as Tuple${arity}
  }

  override function hashCode(): int {
    final var const = 17
    var result = _hashCode
    if (result == 0) {
      result = const
      <% for (var e in (1..arity-1)) { %>result = 31 * result + (e${e} == null ? const : e${e}.hashCode())
      <% } %>result = 31 * result + (e${arity} == null ? const : e${arity}.hashCode())
      _hashCode = result
    }
    return result
  }

  override function equals(that: Object): boolean {
    if (that === this) return true
    if (!(that typeis Tuple${arity})) {
      return false
    }
    return
      <% if (arity > 2) { %>
        <% for (var e in (1..arity-1)) { %>((that as Tuple${arity}).e${e} typeis T${e} or (that as Tuple${arity}).e${e} == null) and
        <% } %>((that as Tuple${arity}).e${arity} typeis T${arity} or (that as Tuple${arity}).e${arity} == null) and
        <% for (var e in (1..arity-2)) { %>(that as Tuple${arity}).e${e} == this.e${e} and
        <% } %>(that as Tuple${arity}).e${arity-1} == this.e${arity-1} and
        (that as Tuple${arity}).e${arity} == this.e${arity}
      <% } else { %>
        <% for (var e in (1..arity-1)) { %>((that as Tuple${arity}).e${e} typeis T${e} or (that as Tuple${arity}).e${e} == null) and
        <% } %>((that as Tuple${arity}).e${arity} typeis T${arity} or (that as Tuple${arity}).e${arity} == null) and
        (that as Tuple${arity}).e${arity-1} == this.e${arity-1} and
        (that as Tuple${arity}).e${arity} == this.e${arity}
      <% } %>
  }

  override function toString(): String {
    return ${toStringDef()}
  }
}