import { useEffect, useRef } from "react";
import * as d3 from "d3";
import tickerData from './ticker.json';

const margin = {top: 20, right: 30, bottom: 30, left: 40};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const CandlestickChart = () => {
  const svgRef = useRef(null);
  const renderRef = useRef(false);

  useEffect(() => {
    if (renderRef.current) {
      return;
    }
    renderRef.current = true;

    // append the svg object to the body of the page
    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    const ticker = tickerData.data as any;

    const newticker = d3.utcDay
    .range(new Date(ticker.at(0).Date), new Date(ticker.at(-1).Date))
    .filter(d => {
      return d.getUTCDay() !== 0 && d.getUTCDay() !== 6;
    })
    const days = d3.utcMonday
          .every(width > 720 ? 1 : 2)
          .range(new Date(ticker.at(0).Date), new Date(ticker.at(-1).Date))
    console.log("🚀 ~ file: candlestick-chart.tsx:70 ~ useEffect ~ newticker:", days)


    // X axis
    const x = d3
    .scaleBand()
    .domain(d3.utcDay
      .range(new Date(ticker.at(0).Date), new Date(ticker.at(-1).Date))
      .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
    )
    .range([margin.left, width - margin.right])
    .padding(0.2);

    // Y axis
    const y = d3.scaleLog()
    .domain([d3.min(ticker, d => d.Low), d3.max(ticker, d => d.High)])
    .rangeRound([height - margin.bottom, margin.top]);

    // Append the axes.
    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickValues(d3.utcMonday
          .every(width > 720 ? 1 : 2)
          .range(new Date(ticker.at(0).Date), new Date(ticker.at(-1).Date)))
      .tickFormat(d3.utcFormat("%-m/%-d")))
    .call(g => g.select(".domain").remove());

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y)
      .tickFormat(d3.format("$~f"))
      .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
    .call(g => g.selectAll(".tick line").clone()
      .attr("stroke-opacity", 0.2)
      .attr("x2", width - margin.left - margin.right))
    .call(g => g.select(".domain").remove());

    }, []);

  return <svg ref={svgRef} width={960} height={500} ></svg>

}

export default CandlestickChart;