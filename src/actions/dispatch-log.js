export const LOG_VISIBLE = "leopard/log/LOG_VISIBLE";

export function setVisible(status) {
  return {
    type: LOG_VISIBLE,
    payload: status
  };
}
