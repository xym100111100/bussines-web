export default class ObjectUtils {
  static equals(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
}
