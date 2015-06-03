package gosu.functional.adt

interface ITuple {
  property get size(): int
  override function hashCode(): int
  override function equals(that: Object): boolean
  override function toString(): String
}
