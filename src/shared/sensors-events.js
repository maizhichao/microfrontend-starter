/**
 * 神策所有事件
 */
const baseFunc = func => (...params) => window.sensors && func(...params);

const eventName = name => "Web_" + name;

/**
 * registerpage是设置公共属性
 * 产品那边约定好了目前就五个公共属性，
 * 研发不能自己随意加，因此如果产品自身有什么公共属性，
 * 只能是在每个事件里单独加上
 */
export const sensors = {};

for (let key in sensors) {
  sensors[key] = baseFunc(sensors[key]);
}
