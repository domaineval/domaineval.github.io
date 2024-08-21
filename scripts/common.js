const domains = ["computation", "network", "visualization", "basic", "system", "cryptography"];
const buttons = domains.map(item => ({
  id: item,
  file: `data/data_${item}.json`
}));

function flatten(data) {
  const results = [];
  for (const [key, value] of Object.entries(data)) {
    for (const row of value) {
      const {
        Model: model,
        Pass_at_k: score,
      } = row;

      let result = results.find(
        (r) => r.model === model
      );
      if (!result) {
        result = { model };
        results.push(result);
      }

      result[key] = (score * 100).toFixed(2);
    }
  }
  return results;
}