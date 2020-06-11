export default (messages, constantsGroup) => {
  const toExport = {};
  for (let groupName in constantsGroup) {
    const enriched = {};
    const values = constantsGroup[groupName];
    const msgGroup = messages[groupName];
    if (!msgGroup) {
      throw Error(
        `Failed to merge Intl messages with constant: Missing message definitions for [${groupName}]`
      );
    }
    for (let key in values) {
      enriched[key] = {
        ...values[key],
        ...msgGroup[key]
      };
    }
    toExport[groupName] = enriched;
  }
  return toExport;
};
