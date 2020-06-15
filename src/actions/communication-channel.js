import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
  HubConnectionState
} from "@aspnet/signalr";
import _ from "lodash";
import * as pop from "@se/pop";

const RETRY_INTERVAL = 5 * 1000; // 5s

async function checkIsAuthorized() {
  try {
    return await pop.checkIsAuthorized();
  } catch (err) {
    return false;
  }
}

class SignalRManager {
  _instancePromise = null;
  _subscriptions = [];

  async getInstance() {
    if (!this._instancePromise) {
      this._instancePromise = this.create();
    }
    return await this._instancePromise;
  }

  async create() {
    const instance = new HubConnectionBuilder()
      .withUrl(`${window.Leopard.APIPath}/hubs/realtimedata`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.Information)
      .build();
    const start = async () => {
      try {
        if (instance.state === HubConnectionState.Disconnected) {
          await instance.start();
          this._subscriptions.forEach(config => {
            this.invoke(config);
          });
          console.info("[SignalR] Connection established!");
        }
      } catch (err) {
        console.error(
          "[SignalR] Error while establishing SignalR connection:",
          err
        );
        if (await checkIsAuthorized()) {
          setTimeout(() => start(), RETRY_INTERVAL);
        }
      }
    };
    instance.onclose(async () => await start());
    await start();
    return instance;
  }

  async invoke(config) {
    const channel = await this.getInstance();
    if (channel.state === HubConnectionState.Connected) {
      const { requester, receivers } = config;
      const { subscription } = requester;
      const loadedData = await channel.invoke(
        subscription.name,
        subscription.args
      );
      receivers.forEach(({ onSnapshot }) => {
        if (onSnapshot) {
          onSnapshot(loadedData);
        }
      });
      console.info("[SignalR] Subscribe:", subscription);
    }
  }

  /**
   * @param {subscription: {name: string, args: any}, unsubscription: {name: string, args: any}} receiver
   * @param {name: string, functor: (args: any) => any} receiver
   * @returns unsubscriber
   */
  async subscribe(config) {
    try {
      const channel = await this.getInstance();
      const { requester, receivers } = config;
      const { unsubscription } = requester;
      receivers.forEach(({ name, onUpdate }) => channel.on(name, onUpdate));
      this.invoke(config);
      this._subscriptions.push(config);
      return () => {
        _.remove(this._subscriptions, sub => sub === config);
        if (channel.state === HubConnectionState.Connected) {
          receivers.forEach(({ name, onUpdate }) =>
            channel.off(name, onUpdate)
          );
          channel.send(unsubscription.name, unsubscription.args);
          console.info("[SignalR] Unsubscribe:", unsubscription);
        } else {
          console.info(
            "[SignalR] Ignore unsubscription, the connection was closed"
          );
        }
      };
    } catch (err) {
      // ignore from here, it will try to reconnect again.
    }
  }
}

export default new SignalRManager();
