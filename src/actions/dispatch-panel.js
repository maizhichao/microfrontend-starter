export const PANEL_VISIBLE = "leopard/panel/PANEL_VISIBLE";

export function setVisible(status) {
  return {
    type: PANEL_VISIBLE,
    payload: status
  };
}
