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

    // Add 1 day to the last date
    const xScaleBandMaxDate = new Date(ticker.at(-1).Date);
    xScaleBandMaxDate.setDate(xScaleBandMaxDate.getDate() + 1);

    // X axis
    const x = d3
    .scaleBand()
    .domain(d3.utcDay
      .range(new Date(ticker.at(0).Date), xScaleBandMaxDate)
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

    // Create a group for each day of data, and append two lines to it.
    const g = svg.append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke", "black")
      .selectAll("g")
      .data(ticker)
      .join("g")
      .attr("transform", d => `translate(${x(new Date(d.Date))},0)`);

    // g.append("line")
    //   .attr("y1", d => y(d.Low))
    //   .attr("y2", d => y(d.High));

    g.append("line")
      .attr("y1", d => y(d.Open))
      .attr("y2", d => y(d.Close))
      .attr("stroke-width", x.bandwidth())
      .attr("stroke", d => d.Open > d.Close ? d3.schemeSet1[0]
          : d.Close > d.Open ? d3.schemeSet1[2]
          : d3.schemeSet1[8]);

    }, []);

  return <svg ref={svgRef} width={960} height={500} ></svg>

}

export default CandlestickChart;