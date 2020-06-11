export function exit() {
  //神策注销当前UserId
  document.cookie = "UserId=; path=/;";
  location.href = `/zh-cn/logout?returnURL=${encodeURIComponent(
    location.origin
  )}`;
}
