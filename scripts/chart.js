const chartEl = document.getElementById("chart");
const chart = echarts.init(chartEl);

const chartOption = {
  grid: {
    left: "1%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    name: "Size",
    type: "category",
    boundaryGap: false,
    data: [],
    axisLabel: {
      formatter: function (value) {
        return value + "B";
      },
    },
  },
  yAxis: {
    name: "Pass@k",
    type: "value",
    show: true,
    nameTextStyle: {
      align: "left",
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
      },
    },
    min: function (value) {
      return Math.floor(value.min / 10) * 10;
    },
  },
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "cross",
    },
  },
  series: [],
};

async function displayData(data) {
  const models = await fetch("models.json").then((resp) => resp.json());
  const flattened = flatten(data);
  //console.log("Flattened data:", flattened);

  const modelSizes = models.map((m) => Math.round(m.size)).filter(Boolean);
  modelSizes.push(0)
  modelSizes.sort((a, b) => a - b);


  chartOption.xAxis.data = [...new Set(modelSizes)];
  chartOption.series = [];

  const series = ["pass_1", "pass_5"];
  //console.log("series:", series);
  chartOption.legend = series.map((name) => ({ name }));
  //console.log("chartOption.legend:", chartOption.legend);

  for (const serieName of series) {

    const serie = {
      name: serieName,
      type: "scatter",
      data: [],
      label: {
        show: true,
        position: 'top',
        formatter: function (params) {
          return params.data.modelname;
        },
        // textStyle: {
        //   color: function (params) {
        //     return params.color;
        //   }
        // },
      },
      itemStyle: {
        opacity: 0.7,
      },
      emphasis: {
        focus: "series",
      },
      markLine: {
        symbol: "none",
        emphasis: {
          label: {
            position: "middle",
            formatter: function (params) {
              return params.data.name;
            },
          },
        },
        data: [],
      },
    };
    const data = flattened;
    //console.log("data:", data);
    for (const row of data) {
      const modelSize = models.find((m) => m.model === row.model)?.size;
      if (modelSize !== undefined) {
        serie.data.push({
          name: `${row["model"]}(${serieName})`,
          modelname: row["model"],
          value: [`${Math.round(modelSize)}`, row[serieName]],
        });
      } else {
        serie.markLine.data.push({
          name: `${row["model"]}(${serieName})`,
          yAxis: row[serieName],
        });
      }
    }
    chartOption.series.push(serie);
  }

  chart.setOption(chartOption);
}

buttons.forEach(({ id, file}) => {
  document.getElementById(id).addEventListener("click", () => {
    fetch(file)
      .then((resp) => resp.json())
      .then((data) => {
        displayData(data);
      });
  });
});

fetch("data/data_overall.json")
  .then((resp) => resp.json())
  .then((data) => {
    displayData(data);
  });

window.addEventListener("resize", () => {
  chart.resize();
});
