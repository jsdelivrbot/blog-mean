"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const interface_1 = require("../interface");
const allTypes = ['string', 'integer', 'number', 'object', 'array', 'boolean', 'null'];
function findTypes(schema) {
    if (!schema) {
        return new Set();
    }
    let potentials;
    if (typeof schema.type === 'string') {
        potentials = new Set([schema.type]);
    }
    else if (Array.isArray(schema.type)) {
        potentials = new Set(schema.type);
    }
    else {
        potentials = new Set(allTypes);
    }
    if (interface_1.JsonValue.isJsonObject(schema.not)) {
        const notTypes = findTypes(schema.not);
        potentials = new Set([...potentials].filter(p => !notTypes.has(p)));
    }
    if (Array.isArray(schema.allOf)) {
        for (const sub of schema.allOf) {
            const types = findTypes(sub);
            potentials = new Set([...potentials].filter(p => types.has(p)));
        }
    }
    if (Array.isArray(schema.oneOf)) {
        let options = new Set();
        for (const sub of schema.oneOf) {
            const types = findTypes(sub);
            options = new Set([...options, ...types]);
        }
        potentials = new Set([...potentials].filter(p => options.has(p)));
    }
    if (Array.isArray(schema.anyOf)) {
        let options = new Set();
        for (const sub of schema.anyOf) {
            const types = findTypes(sub);
            options = new Set([...options, ...types]);
        }
        potentials = new Set([...potentials].filter(p => options.has(p)));
    }
    return potentials;
}
function addUndefinedDefaults(value, _pointer, schema) {
    if (!schema) {
        return value;
    }
    const types = findTypes(schema);
    if (types.size === 0) {
        return value;
    }
    let type;
    if (types.size === 1) {
        // only one potential type
        type = Array.from(types)[0];
    }
    else if (types.size === 2 && types.has('array') && types.has('object')) {
        // need to create one of them and array is simpler
        type = 'array';
    }
    else if (schema.properties && types.has('object')) {
        // assume object
        type = 'object';
    }
    else if (schema.items && types.has('array')) {
        // assume array
        type = 'array';
    }
    else {
        // anything else needs to be checked by the consumer anyway
        return value;
    }
    if (type === 'array') {
        return value == undefined ? [] : value;
    }
    if (type === 'object') {
        let newValue;
        if (value == undefined) {
            newValue = {};
        }
        else if (interface_1.JsonValue.isJsonObject(value)) {
            newValue = value;
        }
        else {
            return value;
        }
        if (!interface_1.JsonValue.isJsonObject(schema.properties)) {
            return newValue;
        }
        for (const propName of Object.getOwnPropertyNames(schema.properties)) {
            if (propName in newValue) {
                continue;
            }
            // TODO: Does not currently handle more complex schemas (oneOf/anyOf/etc.)
            const defaultValue = schema.properties[propName].default;
            newValue[propName] = defaultValue;
        }
        return newValue;
    }
    return value;
}
exports.addUndefinedDefaults = addUndefinedDefaults;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3Jtcy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvanNvbi9zY2hlbWEvdHJhbnNmb3Jtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDRDQUFxRDtBQUdyRCxNQUFNLFFBQVEsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXZGLG1CQUFtQixNQUFrQjtJQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWixNQUFNLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSSxVQUF1QixDQUFDO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBZ0IsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMscUJBQVMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFD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LEdBQUcsRUFBZ0IsQ0FBQztRQUM5QixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLHFCQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ25CLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxxQkFBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDbEIsQ0FBQztRQUVELEdBQUcsQ0FBQyxDQUFDLE1BQU0sUUFBUSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixRQUFRLENBQUM7WUFDWCxDQUFDO1lBRUQsMEVBQTBFO1lBQzFFLE1BQU0sWUFBWSxHQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFnQixDQUFDLE9BQU8sQ0FBQztZQUV6RSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsWUFBWSxDQUFDO1FBQ3BDLENBQUM7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWpFRCxvREFpRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBKc29uT2JqZWN0LCBKc29uVmFsdWUgfSBmcm9tICcuLi9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSnNvblBvaW50ZXIgfSBmcm9tICcuL2ludGVyZmFjZSc7XG5cbmNvbnN0IGFsbFR5cGVzID0gWydzdHJpbmcnLCAnaW50ZWdlcicsICdudW1iZXInLCAnb2JqZWN0JywgJ2FycmF5JywgJ2Jvb2xlYW4nLCAnbnVsbCddO1xuXG5mdW5jdGlvbiBmaW5kVHlwZXMoc2NoZW1hOiBKc29uT2JqZWN0KTogU2V0PHN0cmluZz4ge1xuICBpZiAoIXNjaGVtYSkge1xuICAgIHJldHVybiBuZXcgU2V0KCk7XG4gIH1cblxuICBsZXQgcG90ZW50aWFsczogU2V0PHN0cmluZz47XG4gIGlmICh0eXBlb2Ygc2NoZW1hLnR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcG90ZW50aWFscyA9IG5ldyBTZXQoW3NjaGVtYS50eXBlXSk7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzY2hlbWEudHlwZSkpIHtcbiAgICBwb3RlbnRpYWxzID0gbmV3IFNldChzY2hlbWEudHlwZSBhcyBzdHJpbmdbXSk7XG4gIH0gZWxzZSB7XG4gICAgcG90ZW50aWFscyA9IG5ldyBTZXQoYWxsVHlwZXMpO1xuICB9XG5cbiAgaWYgKEpzb25WYWx1ZS5pc0pzb25PYmplY3Qoc2NoZW1hLm5vdCkpIHtcbiAgICBjb25zdCBub3RUeXBlcyA9IGZpbmRUeXBlcyhzY2hlbWEubm90KTtcbiAgICBwb3RlbnRpYWxzID0gbmV3IFNldChbLi4ucG90ZW50aWFsc10uZmlsdGVyKHAgPT4gIW5vdFR5cGVzLmhhcyhwKSkpO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoc2NoZW1hLmFsbE9mKSkge1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIHNjaGVtYS5hbGxPZikge1xuICAgICAgY29uc3QgdHlwZXMgPSBmaW5kVHlwZXMoc3ViIGFzIEpzb25PYmplY3QpO1xuICAgICAgcG90ZW50aWFscyA9IG5ldyBTZXQoWy4uLnBvdGVudGlhbHNdLmZpbHRlcihwID0+IHR5cGVzLmhhcyhwKSkpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHNjaGVtYS5vbmVPZikpIHtcbiAgICBsZXQgb3B0aW9ucyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIHNjaGVtYS5vbmVPZikge1xuICAgICAgY29uc3QgdHlwZXMgPSBmaW5kVHlwZXMoc3ViIGFzIEpzb25PYmplY3QpO1xuICAgICAgb3B0aW9ucyA9IG5ldyBTZXQoWy4uLm9wdGlvbnMsIC4uLnR5cGVzXSk7XG4gICAgfVxuICAgIHBvdGVudGlhbHMgPSBuZXcgU2V0KFsuLi5wb3RlbnRpYWxzXS5maWx0ZXIocCA9PiBvcHRpb25zLmhhcyhwKSkpO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoc2NoZW1hLmFueU9mKSkge1xuICAgIGxldCBvcHRpb25zID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBzdWIgb2Ygc2NoZW1hLmFueU9mKSB7XG4gICAgICBjb25zdCB0eXBlcyA9IGZpbmRUeXBlcyhzdWIgYXMgSnNvbk9iamVjdCk7XG4gICAgICBvcHRpb25zID0gbmV3IFNldChbLi4ub3B0aW9ucywgLi4udHlwZXNdKTtcbiAgICB9XG4gICAgcG90ZW50aWFscyA9IG5ldyBTZXQoWy4uLnBvdGVudGlhbHNdLmZpbHRlcihwID0+IG9wdGlvbnMuaGFzKHApKSk7XG4gIH1cblxuICByZXR1cm4gcG90ZW50aWFscztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVuZGVmaW5lZERlZmF1bHRzKFxuICB2YWx1ZTogSnNvblZhbHVlLFxuICBfcG9pbnRlcjogSnNvblBvaW50ZXIsXG4gIHNjaGVtYT86IEpzb25PYmplY3QsXG4pOiBKc29uVmFsdWUge1xuICBpZiAoIXNjaGVtYSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGNvbnN0IHR5cGVzID0gZmluZFR5cGVzKHNjaGVtYSk7XG4gIGlmICh0eXBlcy5zaXplID09PSAwKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgbGV0IHR5cGU7XG4gIGlmICh0eXBlcy5zaXplID09PSAxKSB7XG4gICAgLy8gb25seSBvbmUgcG90ZW50aWFsIHR5cGVcbiAgICB0eXBlID0gQXJyYXkuZnJvbSh0eXBlcylbMF07XG4gIH0gZWxzZSBpZiAodHlwZXMuc2l6ZSA9PT0gMiAmJiB0eXBlcy5oYXMoJ2FycmF5JykgJiYgdHlwZXMuaGFzKCdvYmplY3QnKSkge1xuICAgIC8vIG5lZWQgdG8gY3JlYXRlIG9uZSBvZiB0aGVtIGFuZCBhcnJheSBpcyBzaW1wbGVyXG4gICAgdHlwZSA9ICdhcnJheSc7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLnByb3BlcnRpZXMgJiYgdHlwZXMuaGFzKCdvYmplY3QnKSkge1xuICAgIC8vIGFzc3VtZSBvYmplY3RcbiAgICB0eXBlID0gJ29iamVjdCc7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLml0ZW1zICYmIHR5cGVzLmhhcygnYXJyYXknKSkge1xuICAgIC8vIGFzc3VtZSBhcnJheVxuICAgIHR5cGUgPSAnYXJyYXknO1xuICB9IGVsc2Uge1xuICAgIC8vIGFueXRoaW5nIGVsc2UgbmVlZHMgdG8gYmUgY2hlY2tlZCBieSB0aGUgY29uc3VtZXIgYW55d2F5XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKHR5cGUgPT09ICdhcnJheScpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gdW5kZWZpbmVkID8gW10gOiB2YWx1ZTtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgIGxldCBuZXdWYWx1ZTtcbiAgICBpZiAodmFsdWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHt9IGFzIEpzb25PYmplY3Q7XG4gICAgfSBlbHNlIGlmIChKc29uVmFsdWUuaXNKc29uT2JqZWN0KHZhbHVlKSkge1xuICAgICAgbmV3VmFsdWUgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmICghSnNvblZhbHVlLmlzSnNvbk9iamVjdChzY2hlbWEucHJvcGVydGllcykpIHtcbiAgICAgIHJldHVybiBuZXdWYWx1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHByb3BOYW1lIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNjaGVtYS5wcm9wZXJ0aWVzKSkge1xuICAgICAgaWYgKHByb3BOYW1lIGluIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiBEb2VzIG5vdCBjdXJyZW50bHkgaGFuZGxlIG1vcmUgY29tcGxleCBzY2hlbWFzIChvbmVPZi9hbnlPZi9ldGMuKVxuICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gKHNjaGVtYS5wcm9wZXJ0aWVzW3Byb3BOYW1lXSBhcyBKc29uT2JqZWN0KS5kZWZhdWx0O1xuXG4gICAgICBuZXdWYWx1ZVtwcm9wTmFtZV0gPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuIl19