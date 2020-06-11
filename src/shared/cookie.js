/*
 *  get value from sessionStorage test for continuous pull request
 *  @param key:string
 *  @return value:string from sessionStorage fix bug #9
 */
export function get(key) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + key + "=");
  if (parts.length === 2) {
    return parts
      .pop()
      .split(";")
      .shift();
  }
}
/*
 *  set sessionStorage key value
 *  @param key:string
 *  @param value:string
 *  @return void
 */
export function set(key, value, options) {
  options = options || {};
  document.cookie = [
    key,
    "=",
    value,
    options.expires ? "; expires=" + options.expires : "",
    "; path=",
    options.path ? options.path : "/",
    options.domain ? "; domain=" + options.domain : "",
    options.secure ? "; secure" : ""
  ].join("");
}

export function remove() {
  return (document.cookie = "");
}
